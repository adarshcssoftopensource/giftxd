import { TRANSACTION_DTOS } from '@app/dto';
import { ORDER_MODELS, TRANSACTION_MODELS } from '@app/schemas';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

const toObjectId = Types.ObjectId;
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TRANSACTION_MODELS.Transaction.name)
    private transactionModel: Model<TRANSACTION_MODELS.Transaction>,
    @InjectModel(ORDER_MODELS.Order.name)
    private orderModel: Model<ORDER_MODELS.Order>,
  ) {}

  async createTransaction(model: TRANSACTION_DTOS.TransactionCreateDto) {
    try {
      const order = await this.orderModel.findOne({
        _id: new toObjectId(model.order_id),
      });
      if (!order) {
        return new RpcException({
          errorCode: 400,
          message: ['Invalid order Id'],
        });
      }

      const transactionPayload = model;
      const data = await new this.transactionModel(transactionPayload).save();
      return data;
    } catch (error) {
      return new RpcException('Cannot create transaction');
    }
  }

  async getAllTransaction(
    model: TRANSACTION_DTOS.FilterTransactionDto,
  ): Promise<TRANSACTION_DTOS.TransactionResponseDto[]> {
    const page_number = Number(model.page_number) || 1;
    const page_size = Number(model.page_size) || 10;
    const start_date = model.start_date;
    const end_date = model.end_date;
    const status = model.status;
    const card_type = model.card_type;
    const skip = (page_number - 1) * page_size;
    const andCondition = [];

    if (status) {
      andCondition.push({ status });
    }

    if (start_date && end_date) {
      andCondition.push({
        created_at: { $gte: new Date(start_date), $lte: new Date(end_date) },
      });
    }

    if (card_type) {
      andCondition.push({ card_type });
    }

    const matchStage = {
      $match: {
        $and: andCondition,
      },
    };

    const lookupStage = {
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: '_id',
        as: 'orderInfo',
      },
    };

    const unwindStage = {
      $unwind: {
        path: '$orderInfo',
        preserveNullAndEmptyArrays: true,
      },
    };

    const aggregatePipeline: PipelineStage[] = [lookupStage, unwindStage];
    if (matchStage.$match.$and.length > 0) {
      aggregatePipeline.push(matchStage);
    }

    aggregatePipeline.push({ $skip: skip }, { $limit: page_size });

    const data =
      await this.transactionModel.aggregate<TRANSACTION_DTOS.TransactionResponseDto>(
        aggregatePipeline,
      );
    return data;
  }
}
