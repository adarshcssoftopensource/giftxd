import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GIFT_XD_LOGS_MODELS } from '@app/schemas';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class GiftXdLogsService {
  constructor(
    @InjectModel(GIFT_XD_LOGS_MODELS.GiftXdLogs.name)
    private giftXdLogsModel: Model<GIFT_XD_LOGS_MODELS.GiftXdLogs>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
  ) {}

  async createGifXdLogs(model: any) {
    console.log(model, 'mdoel');
    try {
      const payload = {
        orderId: model.orderId,
        response: model.response,
        request: model.request,
        exception: model.exception,
        requestType: model.requestType,
        API: model.API,
        serviceName: model.serviceName,
        userId: model.userId,
        functionName: model.functionName,
        flow: model.flow,
        requestTimeStamp: model?.requestTimeStamp || null,
        responseTimeStamp: model?.responseTimeStamp || null,
      };
      const data = await new this.giftXdLogsModel(payload).save();
      console.log('Data saved successfully:', data);
    } catch (error) {
      console.error('Error while saving data:', error);
    }
  }
}
