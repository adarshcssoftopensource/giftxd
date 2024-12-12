import { IsString, IsNotEmpty } from 'class-validator';
import { TokenDto } from '../users/token.dto';
import { ApiProperty } from '@nestjs/swagger';

export class InternalBalanceTransferDto extends TokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly destinationUsername: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly assetType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly amount: string;
}

export class ExternalWithdrawalDto extends TokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly amount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly externalAddress: string;
}

export class InternalEscrowDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly payer: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly payee: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly amountCrypto: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly ratePercentage: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly feePercentage: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly assetType: string;
}
