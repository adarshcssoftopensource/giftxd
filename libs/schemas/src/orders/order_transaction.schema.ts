import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Order } from './order.schema';
import { OrderTransactionStatus } from './order.schema';

@Schema()
class OrderTransaction {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
  })
  order: Order;

  @Prop({
    type: String,
    enum: OrderTransactionStatus,
    default: OrderTransactionStatus.Escrow,
  })
  transactionStatus: OrderTransactionStatus;

  @Prop()
  amount: number;

  @Prop({ required: false })
  escrowId: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;
}

const OrderTransactionSchema = SchemaFactory.createForClass(OrderTransaction);

export { OrderTransaction, OrderTransactionSchema };
