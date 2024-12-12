import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { TokenDto } from '../users/token.dto';
import { Website } from '@app/schemas/linked-account/account.schema';

export class linkedAccountVerify {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  secretKey: string;
}

export class linkedAccountGetGcrs {
  @ApiProperty()
  id: string;

  @ApiProperty()
  secretKey: string;
}

export class linkedAccountCreateDto extends TokenDto {
  @IsOptional()
  @ApiProperty({ type: String, enum: Website })
  website: Website;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  twoFA: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  currency: string;

  @ApiProperty({ type: Object })
  proxies: {
    country: string;
    city: string;
    zipCode: string;
    state: string;
    ISP: string;
  };
}

export class linkedAccountPagingQueryDto extends TokenDto {}
export class linkedAccountUpdateDto extends TokenDto {
  @IsOptional()
  @ApiProperty({ type: String, enum: Website })
  website: Website;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  twoFA: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsOptional()
  proxies: {
    country: string;
    city: string;
    zipCode: string;
    state: string;
    ISP: string;
  };
}
