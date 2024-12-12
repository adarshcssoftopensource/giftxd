import { Injectable } from '@nestjs/common';
import {
  HOME_MODELS,
  LINKED_ACCOUNT_LIMIT_MODELS,
  USER_MODELS,
} from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { RpcException } from '@nestjs/microservices';
import { roleType } from '@app/schemas/users/role.schema';
import { S3Service } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { KycVerificationStatus } from '@app/schemas/users/client.schema';

const toObjectId = Types.ObjectId;
@Injectable()
export class VendorService {
  constructor(
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Vendor.name)
    private vendorModel: Model<USER_MODELS.Vendor>,
    @InjectModel(USER_MODELS.Client.name)
    private clientModel: Model<USER_MODELS.Client>,
    @InjectModel(USER_MODELS.Role.name)
    private roleModel: Model<USER_MODELS.Role>,
    @InjectModel(HOME_MODELS.PhoneNumber.name)
    private phoneNumberModel: Model<HOME_MODELS.PhoneNumber>,
    @InjectModel(LINKED_ACCOUNT_LIMIT_MODELS.AccountLimit.name)
    private linkedAccountLimitModel: Model<LINKED_ACCOUNT_LIMIT_MODELS.AccountLimit>,
    private s3Service: S3Service,
    private jwt: JwtService,
  ) {}

  async createVendor(token: string) {
    const decode = await this.jwt.verifyAsync(token);
    const user = await this.userModel.findById(decode['_id']);
    const client = await this.clientModel.findOne({ user: decode['_id'] });
    const phone_number = await this.phoneNumberModel.findOne({
      phoneNumber: user.phone_number,
    });
    const isVerified =
      user?.email_verified &&
      phone_number?.isVerified &&
      client.identity_verif_status == KycVerificationStatus.COMPLETED &&
      client.residency_verif_status == KycVerificationStatus.COMPLETED;
    if (!isVerified) {
      return new RpcException('User is not verified');
    }
    // const vendor_payload = {
    //   email: model.email,
    //   fullName: model.fullName,
    //   country: model.country,
    //   ResidencyProof: model.ResidencyProof,
    //   user: user._id,
    // };
    const role = await this.roleModel.findOne({
      name: roleType.Vendor,
    });
    if (!role) {
      throw new RpcException('Vendor Role not exist');
    }
    const vendorExist = await this.vendorModel.findOne({
      user: new toObjectId(user._id),
    });
    if (vendorExist) {
      return new RpcException('User is Already vendor');
    }
    try {
      // if (file) {
      //   const result = await this.s3Service.uploadFile(file, 'residenceProof/');
      //   vendor_payload.ResidencyProof = result.Location;
      // }
      // const user = await this.userModel.findById(model.user);
      if (!user) {
        return new RpcException('Invalid User ID');
      }
      user.role = role;
      user.save();
    } catch (error) {
      return new RpcException('Invalid User ID');
    }
    const vendor_payload = {
      email: user.email,
      fullName: user.firstname + '' + user.lastname,
      country: user.country,
      user: user._id,
    };

    const vendor = await new this.vendorModel({
      ...vendor_payload,
    }).save();
    const accountLimitPayload = {
      vendor: user._id,
    };
    await new this.linkedAccountLimitModel({
      ...accountLimitPayload,
    }).save();
    return vendor;
  }
  async getBYIdVendor(id: string) {
    let vendor;
    {
      vendor = await this.vendorModel.aggregate([
        {
          $match: { _id: new Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $project: {
            'userInfo.password': 0,
          },
        },
      ]);
    }
    return vendor;
  }
}
