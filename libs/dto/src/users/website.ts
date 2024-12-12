import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TokenDto } from './token.dto';

export class CriticalEventData {
  @IsString()
  @ApiProperty()
  os: string;

  @IsString()
  @ApiProperty()
  browser: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsDateString()
  @ApiProperty()
  datetime: string;
}

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  username: string;

  @ApiProperty({ required: false })
  country: string;

  @ApiProperty({ required: false })
  ip: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}

export class CreateTwoSettings extends TokenDto {
  @ApiProperty({ default: false })
  offerTwoFa: boolean;

  // @ApiProperty({ default: false })
  // orderTwoFa: boolean;
}

export class WebSiteUserSignupDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  lot_number: string;

  @ApiProperty()
  captcha_output: string;

  @ApiProperty()
  pass_token: string;

  @ApiProperty()
  gen_time: string;
}

export class WebSiteUserLoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  country: string;

  @ApiProperty({ required: false })
  ip: string;

  @ApiProperty()
  lot_number: string;

  @ApiProperty()
  captcha_output: string;

  @ApiProperty()
  pass_token: string;

  @ApiProperty()
  gen_time: string;
}

export class WebsiteUserForgetPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
export class WebsiteUserResetPasswordDto {
  @IsString()
  @ApiProperty()
  email: string;

  @IsStrongPassword()
  @ApiProperty()
  password: string;
}

export class WebsiteChangePassword {
  @IsStrongPassword()
  @ApiProperty()
  new_password: string;

  @IsStrongPassword()
  @ApiProperty()
  old_password: string;
}

export class PasswordResetEmailDto extends CriticalEventData {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstname: string;

  @IsString()
  giftxd_address: string;
}

export class LoginNotificationEmailDto extends CriticalEventData {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstname: string;
}
export class EmailVerificationDto extends CriticalEventData {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsNumber()
  expiryTime: number;

  @IsString()
  giftxd_address: string;
}

export class twoFaDto {
  @ApiProperty({ default: false })
  @IsOptional()
  twofaEnabled: boolean;

  @IsString()
  @IsOptional()
  twofaSecret: string;
}
