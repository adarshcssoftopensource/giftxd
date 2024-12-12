import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';
import { TokenDto } from '../users/token.dto';

enum cardType {
  Bitcoin = 'BITCOIN',
  Tether = 'TETHER',
  USD_COIN = 'usd coin',
}

export class CreateOfferDto extends TokenDto {
  @ApiProperty()
  paymentMethod: string;

  @IsEnum(cardType)
  @ApiProperty()
  @ApiProperty()
  cardType: string;

  @IsString()
  @ApiProperty()
  @ApiProperty()
  currency: string;

  @IsNumber()
  @ApiProperty()
  @ApiProperty()
  amount: number;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  attributes: string[];

  @ApiProperty({ default: false })
  @IsOptional()
  eCode: boolean;

  @ApiProperty()
  @IsOptional()
  eCodeValue: string;

  @ApiProperty()
  @IsOptional()
  AppSecret: string;
}
