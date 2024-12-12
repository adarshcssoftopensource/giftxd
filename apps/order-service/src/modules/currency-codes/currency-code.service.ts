import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CURRENCY_CODE_DTOS } from '@app/dto';
import { CURRENCY_CODE_MODELS, USER_MODELS } from '@app/schemas';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class CurrencyCodeService {
  constructor(
    @InjectModel(CURRENCY_CODE_MODELS.currencyCode.name)
    private currencyModel: Model<CURRENCY_CODE_MODELS.currencyCode>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private jwt: JwtService,
  ) {}

  async createCurrencyCode(model: CURRENCY_CODE_DTOS.createCurrencyDtos) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    const existingCurrencyCode = await this.currencyModel.findOne({
      value: model.value,
    });
    if (existingCurrencyCode) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'duplicate',
            msg: 'currency with the same name already exists',
            path: 'name',
          },
        ],
      });
    }

    try {
      await new this.currencyModel(model).save();

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

  async getAllCurrencyCode(token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    const currencyCode = await this.currencyModel
      .find({ active: true })
      .select({ name: 1, value: 1, _id: 0 });
    if (!currencyCode.length) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'Currency codes not found',
            path: 'unknown',
          },
        ],
      });
    }
    return currencyCode;
  }

  async updateCurrencyCode(model: CURRENCY_CODE_DTOS.UpdateCurrencyDtos) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    try {
      const currencyCodes = await this.currencyModel.findOne({
        value: model.currencyCode,
      });
      if (!currencyCodes) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'currency-Code not found',
              path: 'unknown',
            },
          ],
        });
      }
      if (model.name) {
        currencyCodes.name = model.name;
      }
      if (typeof model.active === 'boolean') {
        currencyCodes.active = model.active;
      }
      if (model.value) {
        currencyCodes.value = model.value;
      }

      await currencyCodes.save();
      return currencyCodes;
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
