import { Injectable } from '@nestjs/common';
import { ORDER_MODELS, SELLER_MODEL, USER_MODELS } from '@app/schemas';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_DTOS } from '@app/dto';
import { RpcException } from '@nestjs/microservices';
import { S3Service } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';

@Injectable()
export class UserCardService {
  constructor(
    @InjectModel(ORDER_MODELS.UserCard.name)
    private usercardModel: Model<ORDER_MODELS.UserCard>,
    private s3Service: S3Service,
    @InjectModel(SELLER_MODEL.SellerOffer.name)
    private sellerModel: Model<SELLER_MODEL.SellerOffer>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    private jwt: JwtService,
  ) {}
  async uploadFiles(model: ORDER_DTOS.CreateUserCardFileDto) {
    try {
      const decode: any = this.jwt.decode(model.token);
      const user = await this.userModel.findById(decode._id).populate('role');
      if (user?.role?.name !== roleType.Client) {
        return new RpcException('Invalid user');
      }
      if (user.email_verified !== true) {
        return new RpcException('User is not verified.');
      }
      const sellerOffer = await this.sellerModel
        .findById(model.sellerOffer)
        .lean();
      if (
        !sellerOffer ||
        sellerOffer.createdBy.toString() !== user._id.toString()
      ) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'offer not found',
              path: 'unknown',
            },
          ],
        });
      }
      const existingUserCard = await this.usercardModel.findOne({
        sellerOffer: model.sellerOffer,
      });
      if (existingUserCard) {
        return new RpcException(
          'User card with this SellerOffer already exists',
        );
      }

      const upload_files_arr = [];

      if (model.back_side_image) {
        upload_files_arr.push(model.back_side_image[0]);
      }
      if (model.front_side_image) {
        upload_files_arr.push(model.front_side_image[0]);
      }
      if (model.receipt_back_side) {
        upload_files_arr.push(model.receipt_back_side[0]);
      }

      if (model.receipt_front_side) {
        upload_files_arr.push(model.receipt_front_side[0]);
      }

      const images_fields = {};
      if (upload_files_arr.length) {
        const [back_image, front_image, reciept_back, receipt_front] =
          await Promise.all(
            upload_files_arr.map((obj) => {
              return this.s3Service.uploadFile(obj);
            }),
          );
        images_fields['back_side_image'] = back_image.Location;
        images_fields['front_side_image'] = front_image.Location;
        images_fields['receipt_back_side'] = reciept_back.Location;
        images_fields['receipt_front_side'] = receipt_front.Location;
      }
      await new this.usercardModel({
        ...images_fields,
        user: user._id,
        sellerOffer: model.sellerOffer,
        card_cvc: model.card_cvc,
        card_exp_month: model.card_exp_month,
        card_exp_year: model.card_exp_year,
        card_number: model.card_number,
      }).save();
      return 'Uploaded';
    } catch (Err) {
      console.log(Err);
      return new RpcException({
        errorCode: 500,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'Something went wrong,Please try again',
            path: 'unknown',
          },
        ],
      });
    }
  }

  async getUserCards(query: ORDER_DTOS.GetUserCardDto) {
    try {
      const decode: any = this.jwt.decode(query.token);
      const user = await this.userModel.findById(decode._id).populate('role');
      if (user?.role?.name !== roleType.Client) {
        return new RpcException('Invalid user');
      }
      if (user.email_verified !== true) {
        return new RpcException('User is not verified.');
      }
      const sellerOfferId = new Types.ObjectId(query.sellerOffer);
      const sellerOffer = await this.sellerModel.findById(sellerOfferId).lean();
      if (
        !sellerOffer ||
        sellerOffer.createdBy.toString() !== user._id.toString()
      ) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'offer not found',
              path: 'unknown',
            },
          ],
        });
      }

      const data = await this.usercardModel.aggregate([
        {
          $match: {
            sellerOffer: sellerOfferId,
          },
        },
      ]);

      return data;
    } catch (Err) {
      return new RpcException({
        errorCode: 500,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'Something went wrong,Please try again',
            path: 'unknown',
          },
        ],
      });
    }
  }
}
