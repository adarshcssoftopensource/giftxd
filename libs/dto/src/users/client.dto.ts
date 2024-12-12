import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class ClientCreateDto {
  @IsString()
  @ApiProperty()
  firstname: string;

  @IsString()
  @ApiProperty()
  lastname: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsOptional()
  limit: string;

  @ApiProperty()
  @IsOptional()
  completed: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  phone_number: string;

  @ApiProperty()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsOptional()
  signup_date: Date;

  @ApiProperty()
  @IsOptional()
  country_code: string;

  @ApiProperty({ default: true })
  @IsOptional()
  is_activated: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  is_deleted: boolean;
}

export class ClientPagingQueryDto {
  @ApiProperty()
  page_number: number;
  @ApiProperty()
  page_size: number;
}

export class ClientUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  completed?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  country_code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  signup_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  twofa_enabled?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  twofa_secret?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  is_activated?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  is_deleted?: boolean;
}

export class ClientSearchQuery {
  @IsString()
  @ApiProperty()
  @IsOptional()
  searchValue: string;

  @IsNumberString()
  @ApiProperty()
  page_number: number;

  @IsNumberString()
  @ApiProperty()
  page_size: number;
}

export class Client2FA_DTO {
  @IsString()
  @ApiProperty()
  token: string;
}

export class ClientKycStatusUpdateDto {
  @IsString()
  @ApiProperty()
  webhook_type: string;

  @IsString()
  @ApiProperty()
  webhook_code: string;

  @IsString()
  @ApiProperty()
  identity_verification_id: string;

  @IsString()
  @ApiProperty()
  environment: string;
}
