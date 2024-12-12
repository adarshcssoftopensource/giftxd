// currency-codes.controller.ts

import { Controller, Get } from '@nestjs/common';
import { CurrencyCodesService } from './currency-codes.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('currency-codes')
@ApiTags('currency-codes')
export class CurrencyCodesController {
  constructor(private readonly currencyCodesService: CurrencyCodesService) {}

  @Get()
  async getCurrencyCodes() {
    return await this.currencyCodesService.getCurrencyCodes();
  }
}
