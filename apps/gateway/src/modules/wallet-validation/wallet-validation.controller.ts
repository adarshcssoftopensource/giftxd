// wallet-validation.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { WalletValidationService } from './wallet-validation.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('wallet-validation')
@ApiTags('wallet-validation')
export class WalletValidationController {
  constructor(
    private readonly walletValidationService: WalletValidationService,
  ) {}

  @Get()
  async validateWallet(
    @Query('address') address: string,
    @Query('network') network: string,
  ) {
    return await this.walletValidationService.validateWallet(address, network);
  }
}
