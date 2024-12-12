import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { TokenDto } from '../users/token.dto';

export class createCryptoCodeDtos extends TokenDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ default: true })
  @IsOptional()
  active: boolean;
}

export class UpdateCryptoCodeDtos extends TokenDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  cryptoCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  value: string;

  @ApiProperty()
  @IsOptional()
  active: boolean;
}
