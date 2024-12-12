import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional, 
    IsString,
} from 'class-validator';

export class CreateContactMessageDto{  
    @ApiProperty()
    @IsString()
    topic: string;
  
    @ApiProperty()
    @IsEmail()
    @IsString()
    email_address: string; 

    @ApiProperty()
    @IsString()
    firstname: string;
  
    @ApiProperty()
    @IsString()
    lastname: string;

    @ApiProperty()
    @IsOptional()
    message: string;
}

export class ContactMessageListDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  email_address: string;
}

export class ContactMessageDto extends CreateContactMessageDto{  
    @ApiProperty()
    @IsString()
    id: string;
}