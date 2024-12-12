import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Attribute } from '../attributes';
import { Provider } from '../provider';
import { LinkedAccount } from '../linked-account/account.schema';

export enum BuyerOfferStatus {
  pending = 'PENDING',
  matched = 'MATCHED',
  processing = 'PROCESSING',
  accepted = 'ACCEPTED',
  cancelled = 'CANCELLED',
  closed = 'CLOSED',
  completed = 'COMPLETED',
  paused = 'PAUSED',
}

export enum UserTypeOffers {
  guest = 'GUEST',
  logged_in = 'LOGGED_IN',
  all = 'ALL',
}

enum RateType {
  Fixed = 'FIXED',
  Market = 'MARKET',
}

@Schema()
class Offer {
  @Prop({ type: String, enum: UserTypeOffers, default: UserTypeOffers.all })
  userType: UserTypeOffers;

  @Prop({ default: false })
  verifiedSeller: boolean;

  @Prop()
  limitForNewUser: number;

  @Prop()
  minimumTrade: number;

  @Prop({ default: false })
  limitationByCountries: boolean;

  @Prop({ default: false })
  isPaused: boolean;

  @Prop({ default: false })
  eCode: boolean;

  @Prop()
  blockedCountries: string[];

  @Prop()
  allowedCountries: string[];

  @Prop()
  algorithmDetection: string;

  @Prop()
  proxyOrVpn: string;

  @Prop()
  currency: string;

  @Prop()
  cryptocurrency: string;

  @Prop({ type: String, enum: RateType, default: RateType.Market })
  rateType: RateType;

  @Prop()
  offerDiscount: number;

  @Prop()
  minPrice: number;

  @Prop()
  maxPrice: number;

  @Prop()
  label: string;

  @Prop()
  terms: string;

  @Prop()
  tradeInstructions: string;

  @Prop({
    type: String,
    enum: BuyerOfferStatus,
    default: BuyerOfferStatus.pending,
  })
  status: BuyerOfferStatus;
  @Prop()
  notes: string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop({ type: Object })
  currencyRate: object;

  @Prop({ type: Object })
  rate: object;

  @Prop({ type: Object })
  fee: object;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  updatedBy: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  vendor: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Provider.name,
  })
  paymentMethod: Provider;

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: Attribute.name,
    },
  ])
  attributes: Attribute[];

  @Prop({
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: LinkedAccount,
    },
    amount: {
      type: Number,
    },
    priority: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    originalAmount: {
      type: Number,
    },
  })
  accounts: {
    id: mongoose.Types.ObjectId;
    amount: number;
    priority: number;
    originalAmount: number;
    isActive: boolean;
  }[];

  @Prop()
  btcPrice: number;
}

const OfferSchema = SchemaFactory.createForClass(Offer);

export { OfferSchema, Offer };

// customFields: [
//   {
//     id: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'custom',
//     },
//     amount: {
//       type: String,
//     },
// priority
//   },
// ],
