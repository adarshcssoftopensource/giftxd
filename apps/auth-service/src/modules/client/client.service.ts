import { Inject, Injectable } from '@nestjs/common';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { hash_with_bcrypt } from '@app/common';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/client';
import { roleType } from '@app/schemas/users/role.schema';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import {
  PlaidApi,
  IdentityVerificationCreateResponse,
  IdentityVerificationRequestUser,
  IdentityVerificationCreateRequestUser,
  Strategy,
  IdentityVerificationGetResponse,
} from 'plaid';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { KycVerificationStatus } from '@app/schemas/users/client.schema';
import { JwtService } from '@nestjs/jwt';

const toObjectId = Types.ObjectId;
@Injectable()
export class ClientService {
  constructor(
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Client.name)
    private clientModel: Model<USER_MODELS.Client>,
    @InjectModel(USER_MODELS.Role.name)
    private roleModel: Model<USER_MODELS.Role>,
    @InjectModel(HOME_MODELS.PhoneNumber.name)
    private phoneNumberModel: Model<HOME_MODELS.PhoneNumber>,
    @Inject('MAIL_CLIENT_SERVICE')
    private readonly mailService: ClientProxy,
    @Inject('PlaidClient')
    private readonly plaidClient: PlaidApi,
    private readonly configService: ConfigService,
    private jwt: JwtService,
  ) {}

  async createClient(model: USER_DTOS.ClientCreateDto) {
    try {
      const isExist = await this.userModel.findOne({
        email: model.email,
      });
      if (isExist) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: model.email,
              msg: 'email already exists',
              path: 'email',
            },
          ],
        });
      }
      const role = await this.roleModel.findOne({
        name: roleType.Client,
      });
      if (!role) {
        throw new RpcException('Client Role not exist');
      }
      model.password = hash_with_bcrypt(model.password);
      const user_payload = {
        firstname: model.firstname,
        lastname: model.lastname,
        email: model.email,
        password: model.password,
        avatar: model.avatar,
        phone_number: model.phone_number,
        email_verified: false,
        email_otp: {},
        country: model.country,
        country_code: model.country_code,
        role: role._id,
        is_activated: model.is_activated,
        is_deleted: model.is_deleted,
      };
      const user = await new this.userModel({ ...user_payload }).save();
      const client_payload = {
        user: user._id,
        limit: model.limit,
        completed: model.completed,
      };
      const data = await new this.clientModel({ ...client_payload }).save();

      await this.sendOtpEmail(user.id);

      return data;
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async getAllClient(query: USER_DTOS.ClientPagingQueryDto) {
    try {
      let { page_number = '1', page_size = '50' } = query;
      page_number = Number(page_number);
      page_size = Number(page_size);
      const skip = (page_number - 1) * page_size;
      const client = await this.clientModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $facet: {
            result: [
              { $limit: page_size + skip },
              { $skip: skip },
              { $sort: { created_at: -1 } },
              // {
              //   $project: {
              //     'user._id': '$user._id',
              //     'user.firstname': '$user.firstname',
              //     'user.lastname': '$user.lastname',
              //     'user.email': '$user.email',
              //     'user.avatar': '$user.avatar',
              //     limit: '$limit',
              //     completed: '$completed',
              //     is_activated: '$is_activated',
              //     is_deleted: '$is_deleted',
              //     updated_at: '$updated_at',
              //     created_at: '$created_at',
              //   },
              // },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);
      if (!client.length) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'clients not found',
              path: 'unknown',
            },
          ],
        });
      }
      const totalCount = client[0].totalCount[0]
        ? client[0].totalCount[0].count
        : 0;
      const data = client[0].result;
      return {
        data: toSearchModel(data),
        items_count: data.length,
        page_number: page_number,
        page_size: page_size,
        totalCount,
      };
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async getBYIdClient(id: string) {
    try {
      const [client] = await this.clientModel.aggregate([
        {
          $match: { user: new toObjectId(id) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: false,
          },
        },
      ]);
      if (!client) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: 'unknown',
              msg: 'client not found',
              path: 'unknown',
            },
          ],
        });
      }
      return toModel(client);
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async enable2FA(id: string) {
    const client = await this.getBYIdClient(id);
    if (client instanceof RpcException) {
      return client;
    }
    try {
      const secret = speakeasy.generateSecret({
        name: `GiftXD: ${client['email']}`,
      });
      await this.clientModel.findOneAndUpdate(
        { user: id },
        {
          $set: {
            twofa_enabled: true,
            twofa_secret: secret.base32,
          } as USER_DTOS.ClientUpdateDto,
        },
        { new: true },
      );
      return {
        qrcode_url: await QRCode.toDataURL(secret.otpauth_url),
      };
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async verify2FA(payload) {
    const { id, token } = payload;
    const client = await this.getBYIdClient(id);
    if (client instanceof RpcException) {
      return client;
    }
    if (!client['twofa_enabled']) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: '2FA not enabled for this client',
            path: 'unknown',
          },
        ],
      });
    }
    try {
      return {
        valid: speakeasy.totp.verify({
          secret: client['twofa_secret'],
          encoding: 'base32',
          token: token,
        }),
      };
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async disable2FA(payload) {
    const { id, token } = payload;
    const temp = await this.verify2FA(payload);
    if (temp instanceof RpcException) {
      return temp;
    }

    if (!temp.valid) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: '2FA code expired',
            path: 'unknown',
          },
        ],
      });
    }

    await this.clientModel.findOneAndUpdate(
      { user: id },
      {
        $set: {
          twofa_enabled: false,
          twofa_secret: '',
        } as USER_DTOS.ClientUpdateDto,
      },
      { new: true },
    );
    return {};
  }

  async updateClient(id: string, model: USER_DTOS.ClientUpdateDto) {
    try {
      // Preparing update for User
      const userUpdate = {};
      Object.keys(model).forEach((key) => {
        if (
          model[key] !== undefined &&
          key !== 'limit' &&
          key !== 'completed'
        ) {
          userUpdate[key] = model[key];
        }
      });

      // If password needs to be updated and is provided
      if (model.password) {
        userUpdate['password'] = hash_with_bcrypt(model.password);
      }

      // Updating User
      const user = await this.userModel.findOneAndUpdate(
        { _id: id },
        { $set: userUpdate },
        { new: true },
      );
      if (!user) {
        throw new RpcException({ errorCode: 404, message: 'User not found' });
      }

      // Preparing update for Client
      const clientUpdate = {};
      if (model.limit !== undefined) clientUpdate['limit'] = model.limit;
      if (model.completed !== undefined)
        clientUpdate['completed'] = model.completed;

      // Updating Client
      if (Object.keys(clientUpdate).length > 0) {
        const client = await this.clientModel.findOneAndUpdate(
          { user: id },
          { $set: clientUpdate },
          { new: true },
        );
        if (!client) {
          throw new RpcException({
            errorCode: 404,
            message: 'Client not found for this user',
          });
        }
      }

      return user;
    } catch (err) {
      throw new RpcException({
        errorCode: 400,
        message: `Error updating client: ${err.message}`,
      });
    }
  }

  async deleteClient(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete(id);
      if (!user) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'client not found',
              path: 'id',
            },
          ],
        });
      }
      const client = await this.clientModel.findOneAndDelete({
        user: user['_id'],
      });
      return 'client deleted';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
    // return user;
  }

  async searchClient({
    searchValue,
    page_number,
    page_size,
  }: USER_DTOS.ClientSearchQuery) {
    const parsedPageNumber = Number(page_number || '1');
    const parsedPageSize = Number(page_size || '50');

    const skip = (parsedPageNumber - 1) * parsedPageSize;
    const [client] = await this.clientModel.aggregate([
      // { $skip: skip },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          items: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $match: {
                $or: [
                  {
                    'user.firstname': {
                      $regex: `.*${searchValue}.*`,
                      $options: 'i',
                    },
                  },
                  {
                    'user.lastname': {
                      $regex: `.*${searchValue}.*`,
                      $options: 'i',
                    },
                  },
                  {
                    'user.email': {
                      $regex: `.*${searchValue}.*`,
                      $options: 'i',
                    },
                  },
                ],
              },
            },
            { $sort: { created_at: -1 } },
          ],
        },
      },
    ]);

    // const data = client[0].result;
    const totalCount = client.total.length > 0 ? client.total[0].count : 0;
    delete client.total;
    client.items = toSearchModel(client.items);
    client['page_number'] = parsedPageNumber;
    (client['page_size'] = parsedPageSize),
      (client['items_total'] = client.items.length);
    return client;
  }

  private convertToE164(phoneNumber: string): string {
    phoneNumber = phoneNumber.split(' ')[0];
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    const primaryNumber = digitsOnly.split('x')[0];
    const e164Number = `+${primaryNumber}`;

    return e164Number;
  }

  async verifyIdDocument(payload: { token: string }) {
    const decode: any = this.jwt.decode(payload.token);
    const id = decode._id;
    const user_ = await this.userModel.findById(decode._id).populate('role');
    if (!user_ || user_.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    const client = await this.getBYIdClient(id);
    if (client instanceof RpcException) {
      return client;
    }
    const user: IdentityVerificationCreateRequestUser = {
      email_address: client['email'],
    };
    if (client['firstname'] && client['lastname']) {
      user.name = {
        given_name: client['firstname'],
        family_name: client['lastname'],
      };
    }

    try {
      let response: AxiosResponse<IdentityVerificationCreateResponse>;
      try {
        console.log(
          'creating...',
          this.configService.get('PLD_DOCUMENT_TEMPLATE_ID'),
        );
        response = await this.plaidClient.identityVerificationCreate({
          client_user_id: id,
          is_shareable: true,
          template_id: this.configService.get('PLD_DOCUMENT_TEMPLATE_ID'),
          gave_consent: true,
          user: user,
        });
        await this.clientModel.findOneAndUpdate(
          { user: id },
          { $set: { identity_verif_status: KycVerificationStatus.PENDING } },
          { new: true },
        );
      } catch (error) {
        console.log(error, '    => retrying...');
        response = await this.plaidClient.identityVerificationRetry({
          client_user_id: id,
          template_id: this.configService.get('PLD_DOCUMENT_TEMPLATE_ID'),
          strategy: Strategy.Reset,
          user: user as IdentityVerificationRequestUser,
        });
      }

      // console.log({
      //   userId: id,
      //   emailVerified: user_.email_verified,
      //   phoneVerified: client.phone_number !== "",
      //   idVerified: client.identity_verif_status == KycVerificationStatus.COMPLETED,
      //   residencyVerified: client.residency_verif_status == KycVerificationStatus.COMPLETED
      // });

      return {
        shareable_url: response.data.shareable_url,
      };
    } catch (error) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: id,
            msg: error.message,
            path: 'ID Document Verification',
          },
        ],
      });
    }
  }

  async getAllVerificationStatus(
    payload: { token: string },
    id: string = null,
  ) {
    if (id === null || id === undefined) {
      const decode: any = this.jwt.decode(payload.token);
      id = decode._id;
    }
    const client = await this.clientModel
      .findOne({ user: id })
      .populate('user');
    if (!client) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: {},
            msg: 'User not found',
            path: 'email',
          },
        ],
      });
    }

    const phone_number = await this.phoneNumberModel.findOne({
      phoneNumber: client.user.phone_number,
    });

    return {
      emailVerified: client.user.email_verified,
      phoneVerified: phone_number ? phone_number.isVerified : false,
      idVerified:
        client.identity_verif_status == KycVerificationStatus.COMPLETED,
      residencyVerified:
        client.residency_verif_status == KycVerificationStatus.COMPLETED,
    };
  }

  private generateOTP(length: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  private generateOTPWithExpiry(
    length: number,
    expiryTimeInMinutes: number,
  ): USER_MODELS.OTPData {
    const otp = this.generateOTP(length);
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + expiryTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
    return { otp, expiryTime };
  }

  async sendOtpEmail(payload: { token: string }) {
    try {
      const decode: any = this.jwt.decode(payload.token);
      const id = decode._id;
      const user_ = await this.userModel.findById(decode._id).populate('role');
      if (!user_ || user_.role.name !== roleType.Client) {
        return new RpcException('Invalid user');
      }
      const client = await this.clientModel
        .findOne({ user: id })
        .populate('user');
      if (!client) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'Invalid user',
              path: 'email',
            },
          ],
        });
      }

      const otp_data = this.generateOTPWithExpiry(6, 5);
      await this.sendVerificationEmail({
        user: client.user,
        otp: otp_data.otp,
        expiryTime: 5,
      });

      const user = await this.userModel.findOneAndUpdate(
        { _id: id },
        { $set: { email_otp: otp_data } },
        { new: true },
      );

      return {};
    } catch (Err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  private async sendVerificationEmail(data: {
    user: any;
    otp: string;
    expiryTime: number;
  }) {
    const { user, otp, expiryTime } = data;

    const payload = {
      email: user.email,
      firstname: user.firstname,
      otp: otp,
      expiryTime: expiryTime,
    };

    const temp = await this.mailService.send('mail.emailVerification', payload);
    temp.subscribe((response) => {
      console.log(response);
    });
    return temp;
  }

  async verifyResidency(payload: { token: string }) {
    const decode: any = this.jwt.decode(payload.token);
    const id = decode._id;
    const user_ = await this.userModel.findById(decode._id).populate('role');
    if (!user_ || user_.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    const client = await this.getBYIdClient(id);
    if (client instanceof RpcException) {
      return client;
    }
    const user: IdentityVerificationCreateRequestUser = {
      email_address: client['email'],
    };
    if (client['firstname'] && client['lastname']) {
      user.name = {
        given_name: client['firstname'],
        family_name: client['lastname'],
      };
    }
    if (client['phone_number'])
      user['phone_number'] = this.convertToE164(client['phone_number']);

    try {
      let response: AxiosResponse<IdentityVerificationCreateResponse>;
      try {
        console.log('creating...');
        response = await this.plaidClient.identityVerificationCreate({
          client_user_id: id,
          is_shareable: true,
          template_id: this.configService.get('PLD_RESIDENCY_TEMPLATE_ID'),
          gave_consent: true,
          user: user,
        });
        await this.clientModel.findOneAndUpdate(
          { user: id },
          { $set: { residency_verif_status: KycVerificationStatus.PENDING } },
          { new: true },
        );
      } catch (error) {
        console.log(error, '    => retrying...');
        response = await this.plaidClient.identityVerificationRetry({
          client_user_id: id,
          template_id: this.configService.get('PLD_RESIDENCY_TEMPLATE_ID'),
          strategy: Strategy.Reset,
          user: user as IdentityVerificationRequestUser,
        });
      }

      // console.log({
      //   userId: id,
      //   emailVerified: user_.email_verified,
      //   phoneVerified: client.phone_number !== "",
      //   idVerified: client.identity_verif_status == KycVerificationStatus.COMPLETED,
      //   residencyVerified: client.residency_verif_status == KycVerificationStatus.COMPLETED
      // });

      return {
        shareable_url: response.data.shareable_url,
      };
    } catch (error) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: id,
            msg: error.message,
            path: 'Residency Verification',
          },
        ],
      });
    }
  }

  async updateClientKyc(webhook_payload: USER_DTOS.ClientKycStatusUpdateDto) {
    const response: AxiosResponse<IdentityVerificationGetResponse> =
      await this.plaidClient.identityVerificationGet({
        identity_verification_id: webhook_payload.identity_verification_id,
      });
    const getResponse: IdentityVerificationGetResponse = response.data;
    console.log('Webhook Recieved ============================> ', getResponse);
    const identityVerificationPassed: boolean =
      getResponse.documentary_verification?.status == 'success';
    // getResponse.steps.selfie_check === "success"
    const residencyVerificationPassed: boolean =
      getResponse.kyc_check?.address?.summary === 'match';
    if (identityVerificationPassed || residencyVerificationPassed) {
      if (identityVerificationPassed) {
        await this.clientModel.findOneAndUpdate(
          { user: getResponse.client_user_id },
          {
            $set: {
              identity_verif_status: KycVerificationStatus.COMPLETED,
              isUnlimited: true,
            },
          },
          { new: true },
        );
      }

      if (residencyVerificationPassed) {
        await this.clientModel.findOneAndUpdate(
          { user: getResponse.client_user_id },
          {
            $set: {
              residency_verif_status: KycVerificationStatus.COMPLETED,
              isUnlimited: true,
            },
          },
          { new: true },
        );

        await this.userModel.findOneAndUpdate(
          { _id: getResponse.client_user_id },
          { $set: { country: getResponse.user.address.country } },
          { new: true },
        );
      }

      console.log({
        userId: getResponse.client_user_id,
        ...(await this.getAllVerificationStatus(
          null,
          getResponse.client_user_id,
        )),
      });
    }

    return {};
  }
}
