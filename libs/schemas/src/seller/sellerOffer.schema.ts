import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Attribute } from '../attributes';
import { Provider } from '../provider';
import { Offer } from '../offer/offer.schema';

enum cardType {
  Fixed = 'FIXED',
  Market = 'MARKET',
}

export enum SellerOfferStatus {
  pending = 'PENDING',
  matched = 'MATCHED',
  processing = 'PROCESSING',
  accepted = 'ACCEPTED',
  cancelled = 'CANCELLED',
  closed = 'CLOSED',
  completed = 'COMPLETED',
}
@Schema()
class SellerOffer {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Provider.name,
  })
  paymentMethod: Provider;

  @Prop({ type: String, enum: cardType })
  rateType: cardType;

  @Prop()
  currency: string;

  @Prop({ default: false })
  eCode: boolean;

  @Prop()
  eCodeValue: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Offer.name,
  })
  offerId: Offer;

  @Prop()
  amount: number;

  @Prop({ required: false })
  transactionRate: number;

  @Prop({ required: false })
  transactionFees: number;

  @Prop({ required: false })
  offerRate: number;

  @Prop({ required: false })
  checkoutAmount: number;

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: Attribute.name,
    },
  ])
  attributes: Attribute[];

  @Prop({
    type: String,
    enum: SellerOfferStatus,
    default: SellerOfferStatus.pending,
  })
  status: SellerOfferStatus;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop()
  btcPrice: number;

  @Prop()
  giftCardAmountInBTC: number;

  @Prop()
  exchangeRateInBTC: number;
}

const SellerOfferSchema = SchemaFactory.createForClass(SellerOffer);

export { SellerOfferSchema, SellerOffer };
