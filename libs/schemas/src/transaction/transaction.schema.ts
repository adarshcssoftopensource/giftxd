import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Order } from '../orders/order.schema';
import { CardType, TransactionStatus } from '@app/dto/transaction';

@Schema()
export class Transaction {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
  })
  order_id: Order;

  @Prop()
  funding_method: string;

  @Prop({ type: String, enum: CardType, default: CardType.Default })
  card_type: CardType;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.Created,
  })
  status: TransactionStatus;

  @Prop()
  cashout_method: string;

  @Prop()
  purchase_amount: number;

  @Prop({ default: Date })
  purchase_date: Date;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop()
  deleted_at: Date;

  @Prop()
  created_by: string;

  @Prop()
  updated_by: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
