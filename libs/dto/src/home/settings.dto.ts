// update-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone_number?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  last_active?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  active_session?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  account_closed?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notification_preferences?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferred_language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferred_time_zone?: string;
}
