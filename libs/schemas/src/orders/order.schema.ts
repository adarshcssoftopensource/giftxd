import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Employee } from '../users/employee.schema';
import { Supervisor } from '../users/supervisor.schema';
import { Offer } from '../offer/offer.schema';
import { SellerOffer } from '../seller/sellerOffer.schema';
import { Provider } from '../provider';

enum OrderType {
  OpenOrders = 'open_orders',
  ApprovedOrders = 'approved_orders',
  VoidedOrders = 'voided_orders',
  ArchivedOrders = 'archived_orders',
  RedeemptionFailure = 'redeemption_failure',
}

enum OrderTransactionStatus {
  Completed = 'COMPLETED',
  Refunded = 'REFUNDED',
  Escrow = 'ESCROW',
}

enum StatusType {
  initiated = 'ORDER_INITIATED',
  imageReviewed = 'IMAGE_REVIEWED',
  internalAccountsVerified = 'INTERNAL_ACCOUNTS_VERIFIED',
  balanceVerified = 'BALANCE_VERIFIED',
  redeemingGiftCard = 'REDEEMING_GIFT_CARD',
  releasingFunds = 'RELEASING_FUNDS',
  redeemed = 'REDEEMED',
  cancelled = 'CANCELLED',
  reject = 'REJECTED',
  failure = 'FAILED',
}

@Schema()
class Order {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  notes: mongoose.Schema.Types.Mixed;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  gcrsFailure: any;

  @Prop()
  cryptocurrency: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  client: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Provider.name,
  })
  provider: Provider;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  vendor: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Offer.name,
  })
  buyerOffer: Offer;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: SellerOffer.name,
  })
  sellerOffer: SellerOffer;

  @Prop({ unique: true })
  orderNumber: string;

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: Employee.name,
    },
  ])
  employee: Employee[];

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: Supervisor.name,
    },
  ])
  supervisor: Supervisor[];

  @Prop()
  orderAmount: number;

  @Prop({ required: false })
  transactionRate: number;

  @Prop({ required: false })
  transactionFees: number;

  @Prop({ required: false })
  offerRate: number;

  @Prop({ required: false })
  checkoutAmount: number;

  @Prop({ required: false })
  checkoutType: string;

  @Prop({ required: false })
  riskScore: string;

  @Prop({ required: false })
  limit: string;

  @Prop({ required: false })
  gcrsStatus: string;

  @Prop({ type: String, enum: OrderType, default: OrderType.OpenOrders })
  orderType: OrderType;

  @Prop({
    type: String,
    enum: OrderTransactionStatus,
    default: OrderTransactionStatus.Escrow,
  })
  orderTransactionStatus: OrderTransactionStatus;

  @Prop({ type: String, enum: StatusType, default: StatusType.initiated })
  status: StatusType;

  @Prop({ default: true })
  isActivated: boolean;

  @Prop()
  linkedAccount: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: User;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  updatedBy: User;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ default: Date.now() })
  updatedAt: Date;

  @Prop()
  currency: string;

  @Prop({ required: false })
  btcPrice: number;

  @Prop({ required: false })
  giftCardAmountInBTC: number;

  @Prop({ required: false })
  giftCardAmount: number;

  @Prop({ required: false })
  exchangeRateInBTC: number;

  @Prop({ required: false })
  escrowId: string;

  @Prop({ required: false })
  amountInFiat: number;

  @Prop({ required: false })
  gcrsCurrency: string;
}

const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderSchema, Order, StatusType, OrderType, OrderTransactionStatus };
