import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { TokenDto } from '../users/token.dto';

export class UpdateOfferDto extends TokenDto {
  @IsString()
  @ApiProperty({ required: true })
  id: string;

  @IsOptional()
  @ApiProperty()
  paymentMethod: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @ApiProperty()
  cardType: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  currency: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  offerId: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  amount: number;

  @ApiProperty({ default: false })
  @IsOptional()
  eCode: boolean;

  @ApiProperty()
  @IsOptional()
  eCodeValue: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  attributes: string[];
}
