import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
export class CryptoCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
