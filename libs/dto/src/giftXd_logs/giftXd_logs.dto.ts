import { RequestType, ApiType } from '@app/schemas/orders';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class createGiftXdLogs {
  @ApiProperty({ required: false })
  @IsOptional()
  orderId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  response: mongoose.Schema.Types.Mixed;

  @ApiProperty({ required: false })
  @IsOptional()
  request: mongoose.Schema.Types.Mixed;

  @ApiProperty()
  @IsOptional()
  exception: mongoose.Schema.Types.Mixed;

  @ApiProperty({ type: String, enum: RequestType })
  requestType: RequestType;

  @ApiProperty({ type: String, enum: ApiType })
  API: ApiType;

  @ApiProperty()
  @IsOptional()
  serviceName: string;
}
