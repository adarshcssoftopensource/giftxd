import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsOptional()
  token: string;
}
