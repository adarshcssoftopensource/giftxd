import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Order } from './order.schema';
import { StatusType } from './order.schema';

@Schema()
class OrderHistory {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
  })
  order: Order;
  @Prop({ type: String, enum: StatusType, default: StatusType.initiated })
  status: StatusType;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);

export { OrderHistory, OrderHistorySchema };
