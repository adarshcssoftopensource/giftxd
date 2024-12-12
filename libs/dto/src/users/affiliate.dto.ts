import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
export class CreateAffiliateDto {
  @IsString()
  @ApiProperty()
  user_name: string;

  @IsString()
  @ApiProperty()
  full_name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  company_name: string;

  @ApiProperty()
  @IsOptional()
  total_payouts: string;

  @ApiProperty()
  @IsOptional()
  date_onboarded: Date;

  @ApiProperty()
  @IsOptional()
  payment_method: string;
}

export class AffiliatePagingQueryDto {
  @ApiProperty()
  page_number: number;
  @ApiProperty()
  page_size: number;
}

export class UpdateAffiliateDto {
  @IsString()
  @ApiProperty()
  user_name: string;

  @IsString()
  @ApiProperty()
  full_name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  company_name: string;

  @ApiProperty()
  @IsOptional()
  total_payouts: string;

  @ApiProperty()
  @IsOptional()
  date_onboarded: Date;

  @ApiProperty()
  @IsOptional()
  payment_method: string;
}
