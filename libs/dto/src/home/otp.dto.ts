import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OtpSendDto {
  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
