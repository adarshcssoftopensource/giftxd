import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumberString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import * as mongoose from 'mongoose';

import {
  StatusType,
  OrderType,
  OrderTransactionStatus,
} from '@app/schemas/orders';
import { TokenDto } from '../users/token.dto';

export enum SortOrder {
  ASC = 1,
  DES = -1,
}

export class getOfferRecommdationDto {
  @ApiProperty()
  @IsOptional()
  sellerId: string;

  @ApiProperty()
  @IsOptional()
  offerId: string;
}

export class CreateOrderDto extends TokenDto {
  @ApiProperty()
  @IsOptional()
  sellerOfferId: string;

  @ApiProperty()
  @IsOptional()
  buyerOfferId: string;

  @ApiProperty()
  @IsOptional()
  twoFa: string;
}

export class OrderPagingQueryDto extends TokenDto {
  @ApiProperty()
  page_number: number;

  @ApiProperty()
  page_size: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  cryptocurrency: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  search: string;

  @IsOptional()
  @ApiProperty({ type: String, enum: StatusType, required: false })
  status: StatusType;

  @IsOptional()
  @ApiProperty({
    type: String,
    enum: OrderTransactionStatus,
    required: false,
  })
  orderTransactionStatus: OrderTransactionStatus;

  @IsOptional()
  @ApiProperty({ required: false })
  provider: string[];

  @ApiProperty()
  @IsOptional()
  @ApiProperty({
    type: String,
    enum: OrderType,
    required: false,
  })
  orderType: OrderType;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  startDate: Date;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  endDate: Date;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  currency: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  minPrice: string;

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  maxPrice: string;
}

export class OrderUpdateDto extends TokenDto {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @IsEnum(StatusType)
  @IsOptional()
  @ApiProperty()
  status: StatusType;
}

export class OrderApproveDto extends TokenDto {
  @IsString()
  @ApiProperty()
  id: string;
}

export class OrderUpdateGcrsDto {
  @IsString()
  @ApiProperty()
  orderId: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  accountId: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  currency: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  amountInFiat: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  amountInUsd: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  balance: string;

  @IsString()
  @IsEnum(StatusType)
  @ApiProperty()
  status: StatusType;

  @IsString()
  @ApiProperty()
  secretKey: string;
}

export class OrderCancelDto extends TokenDto {
  @IsString()
  @ApiProperty()
  id: string;

  @ApiProperty()
  notes: mongoose.Schema.Types.Mixed;
}

export class CreateUserCardBodyDto extends TokenDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  card_number: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  card_exp_month: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  card_exp_year: string;
}

export class CreateUserCardFileDto extends TokenDto {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  front_side_image: any;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  back_side_image: any;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  receipt_front_side: any;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  receipt_back_side: any;

  @IsString()
  @ApiProperty()
  sellerOffer?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  card_number?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  card_exp_month?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  card_exp_year?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  card_cvc?: string;
}

export class GetUserCardDto extends TokenDto {
  @ApiProperty()
  @IsString()
  sellerOffer?: string;
}
export class FilterOrderDto extends TokenDto {
  @ApiProperty()
  @IsNumberString()
  page_number: number;

  @ApiProperty()
  @IsNumberString()
  page_size: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(OrderType)
  @ApiProperty({ required: false })
  order_type: string;
}
