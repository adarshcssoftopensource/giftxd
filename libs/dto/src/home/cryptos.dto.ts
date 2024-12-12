import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class CryptoCreateDto {
    @ApiProperty()
    symbol: string;
  
    @ApiProperty()
    price: number;
  
    @ApiProperty({ required: false, default: Date.now() })
    lastUpdated?: Date;
  }

export class UpdateCryptoDto {
  @ApiProperty()
  @IsOptional()
  symbol?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  lastUpdated?: Date;
}
