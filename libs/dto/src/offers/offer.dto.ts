import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import * as mongoose from 'mongoose';
import { TokenDto } from '../users/token.dto';
import {
  BuyerOfferStatus,
  UserTypeOffers,
} from '@app/schemas/offer/offer.schema';
import { SellerOfferStatus } from '@app/schemas/seller/sellerOffer.schema';

export enum sortTypeOffer {
  ascending = 'ASCENDING',
  descending = 'DESCENDING',
}

export enum sortTypeOrder {
  cardType = 'CARD_TYPE',
  recentlyInitiated = 'INITIATED',
}

export enum StatusTypeOffer {
  redeemed = 'REDEEMED',
  cancelled = 'CANCELLED',
  reject = 'REJECTED',
}

export class orderQueryDtoWithFilter extends TokenDto {
  @ApiProperty()
  @IsOptional()
  page_number: number;

  @ApiProperty()
  @IsOptional()
  page_size: number;

  @ApiProperty({ type: String, enum: StatusTypeOffer, required: false })
  status: StatusTypeOffer;

  @ApiProperty({
    type: String,
    enum: sortTypeOrder,
    default: sortTypeOrder.recentlyInitiated,
  })
  sortBy: sortTypeOrder;
}

export class OfferCreateDto extends TokenDto {
  @IsString()
  @ApiProperty()
  cryptocurrency: string;

  @IsString()
  @ApiProperty()
  currency: string;

  @ApiProperty({ default: false })
  @IsOptional()
  isPaused: boolean;

  @IsNumber()
  @ApiProperty()
  offerDiscount: number;

  @IsNumber()
  @ApiProperty()
  minPrice: number;

  @IsNumber()
  @ApiProperty()
  maxPrice: number;

  @IsOptional()
  @ApiProperty()
  twoFa: string;

  @ApiProperty()
  accounts: {
    id: mongoose.Types.ObjectId;
    amount: number;
    priority: number;
    originalAmount: number;
    isActive: boolean;
  }[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  attributes: string[];

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty({ default: false })
  @IsOptional()
  limitationByCountries: boolean;

  @ApiProperty()
  @IsOptional()
  blockedCountries: string[];

  @ApiProperty()
  @IsOptional()
  allowedCountries: string[];

  @ApiProperty()
  @IsOptional()
  verifiedSeller: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  eCode: boolean;
}

export class duplicateOfferCreateDto extends TokenDto {
  @ApiProperty()
  id: string;
}

export class OfferPagingQueryDto extends TokenDto {
  @ApiProperty()
  @IsOptional()
  page_number: number;

  @ApiProperty()
  @IsOptional()
  page_size: number;

  @ApiProperty({ type: String, enum: BuyerOfferStatus, required: false })
  status: BuyerOfferStatus;

  @ApiProperty({
    type: String,
    enum: sortTypeOffer,
    default: sortTypeOffer.descending,
  })
  sortBy: sortTypeOffer;
}

export class orderQueryDto extends TokenDto {
  @ApiProperty()
  @IsOptional()
  page_number: number;

  @ApiProperty()
  @IsOptional()
  page_size: number;
}

export class sellerGetReview extends TokenDto {
  @ApiProperty()
  sellerOfferId: string;

  @ApiProperty()
  buyerOfferId: string;
}

export class OfferSellerPagingQueryDto extends TokenDto {
  @ApiProperty()
  @IsOptional()
  page_number: number;

  @ApiProperty()
  @IsOptional()
  page_size: number;

  @ApiProperty({ type: String, enum: SellerOfferStatus, required: false })
  status: SellerOfferStatus;
}

export class getRecommdationDto extends TokenDto {
  @ApiProperty()
  @IsOptional()
  sellerId: string;
}

export class OfferUpdateDto extends TokenDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  accounts: {
    id: mongoose.Types.ObjectId;
    amount: number;
    priority: number;
    originalAmount: number;
    isActive: boolean;
  }[];

  @ApiProperty()
  @IsOptional()
  twoFa: string;

  @ApiProperty({ default: false })
  @IsOptional()
  eCode: boolean;

  @IsOptional()
  @ApiProperty()
  cryptocurrency: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  currency: string;

  @ApiProperty({ default: false })
  @IsOptional()
  isPaused: boolean;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  maxPrice: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  offerDiscount: number;

  @IsOptional()
  @ApiProperty()
  label: string;

  @IsOptional()
  @ApiProperty()
  terms: string;

  @IsOptional()
  @ApiProperty()
  tradeInstructions: string;

  @IsOptional()
  @ApiProperty()
  notes: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  attributes: string[];

  @IsOptional()
  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  @IsOptional()
  verifiedSeller: boolean;

  @ApiProperty()
  @IsOptional()
  limitForNewUser: number;

  @ApiProperty()
  @IsOptional()
  minimumTrade: number;

  @ApiProperty({ default: false })
  @IsOptional()
  limitationByCountries: boolean;

  @ApiProperty()
  @IsOptional()
  blockedCountries: string[];

  @ApiProperty()
  @IsOptional()
  allowedCountries: string[];

  @ApiProperty()
  @IsOptional()
  algorithmDetection: string;

  @ApiProperty()
  @IsOptional()
  proxyOrVpn: string;

  @ApiProperty({
    type: String,
    enum: UserTypeOffers,
    default: UserTypeOffers.all,
  })
  userType: UserTypeOffers;
}
