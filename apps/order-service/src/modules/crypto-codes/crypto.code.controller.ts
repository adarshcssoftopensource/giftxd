import { MessagePattern } from '@nestjs/microservices';
import { CryptoCodeService } from './crypto-code.service';
import { Controller } from '@nestjs/common';
import { CRYPTO_CODE_DTOS } from '@app/dto';

@Controller('Crypto-Code')
export class CryptoCodeController {
  constructor(private cryptoCodeService: CryptoCodeService) {}
  @MessagePattern('cryptoCode.create')
  async createCryptoCode(model: CRYPTO_CODE_DTOS.createCryptoCodeDtos) {
    const data = await this.cryptoCodeService.createCryptoCode(model);
    return data;
  }
  @MessagePattern('cryptoCode.getAll')
  async CryptoCodeGetAll(token: string) {
    const data = await this.cryptoCodeService.getAllCryptoCode(token);
    return data;
  }

  @MessagePattern('cryptoCode.update')
  async updateCryptoCode(model: CRYPTO_CODE_DTOS.UpdateCryptoCodeDtos) {
    const provider = await this.cryptoCodeService.updateCryptoCode(model);
    return provider;
  }
}
