import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CRYPTO_CODE_DTOS } from '@app/dto';
import { CRYPTO_CODES_MODELS, USER_MODELS } from '@app/schemas';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class CryptoCodeService {
  constructor(
    @InjectModel(CRYPTO_CODES_MODELS.cryptoCode.name)
    private cryptoModel: Model<CRYPTO_CODES_MODELS.cryptoCode>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private jwt: JwtService,
  ) {}

  async createCryptoCode(model: CRYPTO_CODE_DTOS.createCryptoCodeDtos) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    const existingCryptoCode = await this.cryptoModel.findOne({
      value: model.value,
    });
    if (existingCryptoCode) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'duplicate',
            msg: 'crypto with the same name already exists',
            path: 'name',
          },
        ],
      });
    }

    try {
      await new this.cryptoModel(model).save();

      return 'created';
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

  async getAllCryptoCode(token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    const currencyCode = await this.cryptoModel
      .find({ active: true })
      .select({ name: 1, value: 1, _id: 0 });
    return currencyCode;
  }

  async updateCryptoCode(model: CRYPTO_CODE_DTOS.UpdateCryptoCodeDtos) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    try {
      const cryptoCodes = await this.cryptoModel.findOne({
        value: model.cryptoCode,
      });
      if (!cryptoCodes) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'Crypto code not found',
              path: 'unknown',
            },
          ],
        });
      }
      if (model.name) {
        cryptoCodes.name = model.name;
      }
      if (typeof model.active === 'boolean') {
        cryptoCodes.active = model.active;
      }
      if (model.value) {
        cryptoCodes.value = model.value;
      }
      await cryptoCodes.save();
      return cryptoCodes;
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
}
