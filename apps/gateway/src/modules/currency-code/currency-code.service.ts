import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REQUEST } from '@nestjs/core';
import { CURRENCY_CODE_DTOS } from '@app/dto';
@Injectable()
export class CurrencyCodeService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly providerService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createCurrencyCodes(model: CURRENCY_CODE_DTOS.createCurrencyDtos) {
    model.token = this.request.headers['x-access-token'];
    return this.providerService.send('currencyCodes.create', model);
  }

  getAllCurrencyCodes() {
    const token = this.request.headers['x-access-token'];
    return this.providerService.send('currencyCodes.getAll', token);
  }

  updateCurrencyCodes(model: CURRENCY_CODE_DTOS.UpdateCurrencyDtos) {
    model.token = this.request.headers['x-access-token'];
    return this.providerService.send('currencyCodes.update', model);
  }
}
