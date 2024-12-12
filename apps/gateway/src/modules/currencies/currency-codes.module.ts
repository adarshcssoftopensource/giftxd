// currency-codes.module.ts or your module file

import { Module } from '@nestjs/common';
import { CurrencyCodesService } from './currency-codes.service';
import { CurrencyCodesController } from './currency-codes.controller';

@Module({
  providers: [CurrencyCodesService],
  controllers: [CurrencyCodesController],
})
export class CurrencyCodeModule {}
