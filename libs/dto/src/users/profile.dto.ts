import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class UserProfileCreateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  last_seen: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  last_ip: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  facebook: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  twitter: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  linkedin: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  trades_completed: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  active_offers: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  feedback: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  language: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  trade_patterns: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  trades: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tradevolume_btc: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tradevolume_eth: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tradevolume_usdt: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tradevolume_usdc: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  trustedby: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  blockedby: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hasblocked: number;

  @ApiProperty()
  @IsOptional()
  joindate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profilelink: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  positive_feedback: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  negative_feedback: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  holdings: number;
}

export class UserProfileUpdateDto extends UserProfileCreateDto {}
