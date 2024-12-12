import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNumberString,
  isNumber,
  isNumberString,
  IsEnum,
} from 'class-validator';

export enum TransactionStatus {
  Created = 'CREATED',
  Success = 'SUCCESS',
  Failed = 'FAILED',
  Pending = 'PENDING',
  PartiallyPaid = 'PARTIALLY_PAID',
}

export enum CardType {
  Debit = 'DEBIT',
  Credit = 'CREDIT',
  Visa = 'VISA',
  Default = 'NONE',
}

export class TransactionCreateDto {
  @IsString()
  @ApiProperty()
  funding_method: string;

  @IsEnum(CardType)
  @ApiProperty({ default: CardType.Default })
  @IsOptional()
  card_type: CardType;

  @ApiProperty()
  order_id: string;

  @IsString()
  @ApiProperty()
  cashout_method: string;

  @ApiProperty()
  @IsNumber()
  purchase_amount: number;

  @ApiProperty()
  purchase_date: Date;
}

export class TransactionPagingQueryDto {
  @ApiProperty()
  page_number: number;

  @ApiProperty()
  page_size: number;
}

export class TransactionUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  funding_method: string;

  @IsOptional()
  @ApiProperty()
  order: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cashout_method: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  purchase_amount: number;

  @IsOptional()
  @ApiProperty()
  purchase_date: Date;
}

export class FilterTransactionDto {
  @ApiProperty()
  @IsNumberString()
  page_number: number;

  @ApiProperty()
  @IsNumberString()
  page_size: number;

  @IsEnum(TransactionStatus)
  @IsOptional()
  @ApiProperty({ default: TransactionStatus.Created, required: false })
  @IsOptional()
  status: TransactionStatus;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  amount: number;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  start_date: string;

  @IsEnum(CardType)
  @IsOptional()
  @ApiProperty({ default: CardType.Default, required: false })
  @IsOptional()
  card_type: CardType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  end_date: string;
}

export class TransactionResponseDto {
  @IsString()
  @ApiProperty()
  funding_method: string;

  @IsString()
  @ApiProperty()
  status: string;

  @ApiProperty()
  orderInfo: string[];

  @IsString()
  @ApiProperty()
  card_type: string;

  @ApiProperty()
  order: string;

  @IsString()
  @ApiProperty()
  cashout_method: string;

  @IsNumber()
  @ApiProperty()
  purchase_amount: number;

  @ApiProperty()
  purchase_date: Date;
}
