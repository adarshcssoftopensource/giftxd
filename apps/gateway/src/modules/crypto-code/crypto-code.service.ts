import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REQUEST } from '@nestjs/core';
import { CRYPTO_CODE_DTOS } from '@app/dto';
@Injectable()
export class CryptoCodeService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly providerService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createCryptoCodes(model: CRYPTO_CODE_DTOS.createCryptoCodeDtos) {
    model.token = this.request.headers['x-access-token'];
    return this.providerService.send('cryptoCode.create', model);
  }

  getAllCryptoCodes() {
    const token = this.request.headers['x-access-token'];
    return this.providerService.send('cryptoCode.getAll', token);
  }

  updateCryptoCodes(model: CRYPTO_CODE_DTOS.UpdateCryptoCodeDtos) {
    model.token = this.request.headers['x-access-token'];
    return this.providerService.send('cryptoCode.update', model);
  }
}
