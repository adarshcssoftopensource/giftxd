import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { HOME_DTOS } from '@app/dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
import { KycVerificationStatus } from '@app/schemas/users/client.schema';

@Injectable()
export class OtpService {
  private readonly twilioClient: Twilio.Twilio;
  private readonly verifySid: string;

  constructor(
    @InjectModel(HOME_MODELS.PhoneNumber.name)
    private readonly phoneNumberModel: Model<HOME_MODELS.PhoneNumber>,
    @InjectModel(USER_MODELS.User.name)
    private readonly userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Client.name)
    private readonly clientModel: Model<USER_MODELS.Client>,
    @Inject(REQUEST)
    private request: Request,
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
  ) {
    this.verifySid = this.configService.get<string>('TWILIO_VERIFY_SID');

    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    this.twilioClient = Twilio(accountSid, authToken);
  }

  async sendOTP(
    dto: HOME_DTOS.OtpSendDto,
  ): Promise<{ status: string; acceptable_phone: boolean }> {
    try {
      const result = await this.twilioClient.lookups.v2
        .phoneNumbers(dto.phoneNumber)
        .fetch();

      if (!result.valid) {
        throw new HttpException(
          'Phone number provided is invalid.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const phoneNumberDoc = await this.phoneNumberModel.findOne({
        phoneNumber: result.phoneNumber,
      });
      if (phoneNumberDoc) {
        if (phoneNumberDoc.isRegistered) {
          throw new HttpException(
            'Phone number already registered.',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (phoneNumberDoc.isVerified) {
          throw new HttpException(
            'Phone number already verified.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const phoneInfo = await this.twilioClient.lookups.v1
        .phoneNumbers(dto.phoneNumber)
        .fetch({ type: ['carrier'] });

      const carrierType = phoneInfo.carrier?.type;
      if (carrierType === null || carrierType === undefined) {
        throw new HttpException(
          'Unable to determine the carrier type.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isAcceptablePhone = carrierType === 'mobile';
      if (!isAcceptablePhone) {
        throw new HttpException(
          'Phone number is not a valid mobile number.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const verification = await this.twilioClient.verify.v2
        .services(this.verifySid)
        .verifications.create({ to: dto.phoneNumber, channel: 'sms' });

      return {
        status: verification.status,
        acceptable_phone: isAcceptablePhone,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.message || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyOTP(phoneNumber: string, otpCode: string): Promise<string> {
    const token = this.request.headers['x-access-token'];
    try {
      const decode: any = this.jwt.decode(token);
      const id = decode._id;
      const user_ = await this.userModel.findById(decode._id).populate('role');
      if (!user_ || user_.role.name !== roleType.Client) {
        throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
      }

      const verificationCheck = await this.twilioClient.verify.v2
        .services(this.verifySid)
        .verificationChecks.create({ to: phoneNumber, code: otpCode });
      if (verificationCheck.status === 'approved') {
        await new this.phoneNumberModel({
          phoneNumber,
          isRegistered: true,
          isVerified: true,
        }).save();
        const result = await this.twilioClient.lookups.v2
          .phoneNumbers(phoneNumber)
          .fetch();
        await this.userModel.findOneAndUpdate(
          { _id: id },
          {
            $set: {
              phone_number: phoneNumber,
              country_code: result.countryCode,
            },
          },
          { new: true },
        );
      }
      await this.clientModel.findOneAndUpdate(
        { user: id },
        {
          $set: {
            limit: 500,
          },
        },
        { new: true },
      );
      const client = await this.clientModel.findOne({ user: id });
      console.log({
        userId: id,
        emailVerified: user_.email_verified,
        phoneVerified: true,
        idVerified:
          client.identity_verif_status == KycVerificationStatus.COMPLETED,
        residencyVerified:
          client.residency_verif_status == KycVerificationStatus.COMPLETED,
      });
      return verificationCheck.status;
    } catch (error) {
      throw new HttpException(
        error.response?.message || error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
