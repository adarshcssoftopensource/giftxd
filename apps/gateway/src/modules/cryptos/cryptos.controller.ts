import { Controller, Get, Param } from '@nestjs/common';
import { CryptoService } from './cryptos.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('crypto')
@ApiTags('crypto-price')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get()
  async getCryptoData() {
    return this.cryptoService.getCryptoData();
  }
}
