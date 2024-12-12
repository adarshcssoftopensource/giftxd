import { MessagePattern } from '@nestjs/microservices';
import { CurrencyCodeService } from './currency-code.service';
import { Controller } from '@nestjs/common';
import { CURRENCY_CODE_DTOS } from '@app/dto';

@Controller('Currency-Code')
export class CurrencyCodeController {
  constructor(private currencyCodeService: CurrencyCodeService) {}
  @MessagePattern('currencyCodes.create')
  async createCurrencyCode(model: CURRENCY_CODE_DTOS.createCurrencyDtos) {
    const data = await this.currencyCodeService.createCurrencyCode(model);
    return data;
  }
  @MessagePattern('currencyCodes.getAll')
  async CurrencyCodeGetAll(token: string) {
    const data = await this.currencyCodeService.getAllCurrencyCode(token);
    return data;
  }

  @MessagePattern('currencyCodes.update')
  async updateCurrencyCode(model: CURRENCY_CODE_DTOS.UpdateCurrencyDtos) {
    const provider = await this.currencyCodeService.updateCurrencyCode(model);
    return provider;
  }
}
