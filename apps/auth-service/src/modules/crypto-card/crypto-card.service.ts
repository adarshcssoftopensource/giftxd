import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { Client, RpcException } from '@nestjs/microservices';
import { hash_with_bcrypt } from '@app/common';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/client';

const toObjectId = Types.ObjectId;
@Injectable()
export class CryptoCardService {
  constructor(
    @InjectModel(USER_MODELS.CryptoCard.name)
    private cryptocardModel: Model<USER_MODELS.CryptoCard>,
  ) {}

  async createCryptoCard(model: any) {
    // Adjust the type as needed
    const cryptocard = await new this.cryptocardModel(model).save();
    return cryptocard;
  }

  async getCryptoCards() {
    try {
      const cryptocards = await this.cryptocardModel.find();
      return cryptocards;
    } catch (error) {
      throw new RpcException('Error getting crypto');
    }
  }

  async deleteById(id: string) {
    try {
      const result = await this.cryptocardModel.findByIdAndDelete(
        new toObjectId(id),
      );
      if (!result) {
        throw new RpcException(`CryptoCard with ID ${id} not found`);
      }
      return result;
    } catch (error) {
      throw new RpcException('Error deleting cryptocard: ' + error.message);
    }
  }
}
