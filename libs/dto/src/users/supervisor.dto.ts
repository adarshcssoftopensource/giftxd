import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
export class CreateSupervisorDto {
  @IsString()
  @ApiProperty()
  full_name: string;

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

export class SupervisorPagingQueryDto {
  @ApiProperty()
  page_number: number;
  @ApiProperty()
  page_size: number;
}

export class UpdateSupervisorDto {
  @ApiProperty()
  full_name: string;

  @ApiProperty()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  employment_type: string;

  @ApiProperty()
  @IsOptional()
  date_onboarded: Date;

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
  @IsOptional()
  onboarded_date: Date;

  @ApiProperty({ default: 0 })
  @IsOptional()
  orders_completed: number;

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
  can_change_employee_schedule: boolean;
}

export class SupervisorSearchQueryDto {
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
