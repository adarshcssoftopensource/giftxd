import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from '../users/token.dto';
import { IsOptional } from 'class-validator';

export class createLinkedAccountLimit extends TokenDto {
  @ApiProperty()
  vendor: string;

  @ApiProperty()
  @IsOptional()
  AMAZON: number;

  @ApiProperty()
  @IsOptional()
  STEAM: number;

  @ApiProperty()
  @IsOptional()
  APPLE: number;

  @ApiProperty()
  GOOGLE_PLAY: number;

  @ApiProperty()
  @IsOptional()
  I_TUNES: number;

  @ApiProperty()
  @IsOptional()
  RAZER_GOLD: number;
}
