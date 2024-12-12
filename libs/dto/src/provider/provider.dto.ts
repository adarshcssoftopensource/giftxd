import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TokenDto } from '../users/token.dto';

export class CreateProviderDto extends TokenDto {
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  value: string;
}

export class UpdateProviderDto extends TokenDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  nameOfProvider;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  value: string;

  @IsOptional()
  @ApiProperty()
  active: string;
}
