import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from './order.schema';
import { User } from '../users/user.schema';

export enum RequestType {
  Inbound = 'inbound',
  Outbound = 'outbound',
}

export enum ApiType {
  PATCH = 'PATCH',
  PUT = 'PUT',
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
}

@Schema()
class GiftXdLogs {
  @Prop()
  orderId: string;

  @Prop()
  userId: string;

  @Prop()
  response: mongoose.Schema.Types.Mixed;

  @Prop()
  request: mongoose.Schema.Types.Mixed;

  @Prop()
  exception: mongoose.Schema.Types.Mixed;

  @Prop({ type: String, enum: RequestType })
  requestType: RequestType;

  @Prop({ type: String, enum: ApiType })
  API: ApiType;

  @Prop()
  serviceName: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop()
  functionName: string;

  @Prop()
  flow: string;

  @Prop()
  accountId: string;

  @Prop()
  requestTimeStamp: string;
  @Prop()
  responseTimeStamp: string;
}

const GiftXdLogsSchema = SchemaFactory.createForClass(GiftXdLogs);

export { GiftXdLogsSchema, GiftXdLogs };
