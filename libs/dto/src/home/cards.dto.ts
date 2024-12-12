import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';

class DetectionAccuracyRateDto {
  @ApiProperty()
  @IsNumber()
  cardNumber: number;

  @ApiProperty()
  @IsNumber()
  expirationDate: number;

  @ApiProperty()
  @IsNumber()
  securityCode: number;
}

export class CreateCardDto {
  @ApiProperty()
  @IsString()
  cardNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parsedText: string;

  @ApiProperty()
  @IsString()
  validThruMonth: string;

  @ApiProperty()
  @IsString()
  validThruYear: string;

  @ApiProperty()
  @IsString()
  cvv: string;

  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty({ type: DetectionAccuracyRateDto })
  @IsObject()
  detectionAccuracyRate: DetectionAccuracyRateDto;
}

export class UpdateCardDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  cardNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  validThruMonth?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  validThruYear?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cvv?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({ type: DetectionAccuracyRateDto })
  @IsObject()
  @IsOptional()
  detectionAccuracyRate?: DetectionAccuracyRateDto;
}
