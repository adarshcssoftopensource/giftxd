import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PROVIDER_DTOS } from '@app/dto';
import {
  PROVIDER_DETAILS_MODELS,
  PROVIDER_MODEL,
  USER_MODELS,
} from '@app/schemas';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class ProviderService {
  constructor(
    @InjectModel(PROVIDER_MODEL.Provider.name)
    private providerModel: Model<PROVIDER_MODEL.Provider>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(PROVIDER_DETAILS_MODELS.ProviderDetails.name)
    private providerDetail: Model<PROVIDER_DETAILS_MODELS.ProviderDetails>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private jwt: JwtService,
  ) {}

  async createProvider(model: PROVIDER_DTOS.CreateProviderDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);

    if (!user) {
      return new RpcException('Invalid user');
    }
    const existingProvider = await this.providerModel.findOne({
      value: model.name,
    });

    if (existingProvider) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'duplicate',
            msg: 'Provider with the same name already exists',
            path: 'name',
          },
        ],
      });
    }

    try {
      await new this.providerModel(model).save();

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

  async getAllProvider(token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    const providers = await this.providerModel
      .find()
      .select({ name: 1, value: 1, _id: 0, active: 1 })
      .sort({ name: 1 });
    if (!providers.length) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'provider not found',
            path: 'unknown',
          },
        ],
      });
    }
    return providers;
  }

  async getByNameProvider(providerName: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    if (!providerName) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: providerName,
            msg: 'provider not found',
            path: 'id',
          },
        ],
      });
    }
    const provider = await this.providerModel
      .findOne({ value: providerName })
      .select({ name: 1, value: 1, _id: 0 });
    if (!provider) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'provider not found',
            path: 'unknown',
          },
        ],
      });
    }
    return provider;
  }

  async updateprovider(model: PROVIDER_DTOS.UpdateProviderDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    try {
      const provider = await this.providerModel.findOne({
        value: model.nameOfProvider,
      });
      if (!provider) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'provider not found',
              path: 'unknown',
            },
          ],
        });
      }
      if (model.name) {
        provider.name = model.name;
      }
      if (model.value) {
        provider.value = model.value;
      }

      await provider.save();
      return provider;
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

  async deleteProvider(name: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    try {
      const provider = await this.providerModel.findOne({
        value: name,
      });
      provider.deleteOne();
      if (!provider) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: name,
              msg: 'provider not found',
              path: 'id',
            },
          ],
        });
      }
      return provider;
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
  async providerDetails(token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (!user) {
      return new RpcException('Invalid user');
    }
    const data = await this.providerDetail
      .find()
      .select({ _id: 0, created_at: 0, updated_at: 0 });
    return data[0];
  }
}
