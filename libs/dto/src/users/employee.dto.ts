import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  Min,
  IsNumber,
  IsArray,
} from 'class-validator';
export class CreateEmployeeDto {
  @IsString()
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @IsString()
  @ApiProperty()
  employment_type: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  assign_to: string[];

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  phone_number: number;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ default: false })
  @IsOptional()
  two_factor_auth: boolean;
}

export class EmployeePagingQueryDto {
  @ApiProperty()
  page_number: number;
  @ApiProperty()
  page_size: number;
}

export class UpdateEmployeeDto {
  @ApiProperty()
  @IsOptional()
  full_name: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  employment_type: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [String] })
  assign_to: string[];

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  onboarded_date: Date;

  @ApiProperty()
  @IsOptional()
  phone_number: number;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty({ default: false })
  @IsOptional()
  two_factor_auth: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  can_accept_orders: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  can_void_orders: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  teminated: boolean;

  @ApiProperty()
  @IsOptional()
  terminated_period: number;
  0;
  @ApiProperty({ default: 0 })
  @IsOptional()
  orders_completed: number;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  strikes_count: number;
}

export class EmployeeSearchQueryDto {
  @IsOptional()
  @ApiProperty({ default: 1 })
  page?: number;

  @IsOptional()
  @ApiProperty({ default: 10 })
  limit?: number;

  @IsString()
  @ApiProperty({ required: true })
  search: string;
}
