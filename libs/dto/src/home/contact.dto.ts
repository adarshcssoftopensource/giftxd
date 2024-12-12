import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
export class ContactCreateDto {
  @ApiProperty()
  email_support: string;

  @ApiProperty()
  phone_support: string;
}

export class UpdateContactDto {
  @ApiProperty()
  @IsOptional()
  email_support: string;

  @ApiProperty()
  @IsOptional()
  phone_support: string;
}
