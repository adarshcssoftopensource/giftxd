import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { TokenDto } from '../users/token.dto';

export class createCurrencyDtos extends TokenDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  value: string;

  @ApiProperty({ default: true })
  @IsOptional()
  active: boolean;
}

export class UpdateCurrencyDtos extends TokenDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsOptional()
  currencyCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsOptional()
  value: string;

  @ApiProperty()
  @IsOptional()
  @IsOptional()
  active: boolean;
}
