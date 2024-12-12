import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ATTRIBUTE_DTOS } from '@app/dto';
import { ATTRIBUTE_MODEL, PROVIDER_MODEL, USER_MODELS } from '@app/schemas';
import { Model, Types } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ContactCardsController } from 'apps/gateway/src/modules/contacts/contacts.controller';
@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(ATTRIBUTE_MODEL.Attribute.name)
    private attributeModel: Model<ATTRIBUTE_MODEL.Attribute>,
    @InjectModel(PROVIDER_MODEL.Provider.name)
    private providerModel: Model<PROVIDER_MODEL.Provider>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private jwt: JwtService,
  ) {}

  async createAttribute(model: ATTRIBUTE_DTOS.CreateAttribueDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    try {
      const provider = await this.providerModel.findOne({
        value:model.provider
      });
      if (!provider) {
        return new RpcException('Provider not found');
      }
      model.provider = provider._id.toString();
      const data = await new this.attributeModel(model).save();
      return {
        id: data._id,
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

  async getAllAttribute(query: ATTRIBUTE_DTOS.queryatributeDto) {
    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    const provider = await this.providerModel.findOne({
      value: new RegExp(query.provider, 'i'),
    });
    if (!provider) {
      return [];
    }
    const matchStage = {
      $match: {},
    };
    if (provider) {
      matchStage.$match = { provider: new Types.ObjectId(provider._id) };
    }
    const attributes = await this.attributeModel.aggregate([
      matchStage,
      {
        $graphLookup: {
          from: 'attributes',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent_id',
          as: 'children',
          maxDepth: 5,
        },
      },
      {
        $match: { parent_id: { $exists: false } },
      },

      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $project: {
          __v: 0,
          created_at: 0,
          updated_at: 0,
          is_deleted: 0,
          provider: 0,
          'children.created_at': 0,
          'children.parent_id': 0,
          'children.updated_at': 0,
          'children.is_deleted': 0,
          'children.provider': 0,
          'children.__v': 0,
        },
      },
    ]);

    return attributes;
  }

  async deleteAttribute(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id);
    if (!user) {
      return new RpcException('Invalid user');
    }
    try {
      const attribute = await this.attributeModel.findByIdAndDelete(id);
      if (!attribute) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'attribute not found',
              path: 'id',
            },
          ],
        });
      }
      return 'Deleted successfully';
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
