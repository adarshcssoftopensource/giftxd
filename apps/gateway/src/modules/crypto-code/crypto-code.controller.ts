import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CRYPTO_CODE_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';
import { CryptoCodeService } from './crypto-code.service';

@Controller('Crypto-Codes')
@ApiTags('Crypto-Codes')
export class CryptoCodesController {
  constructor(private cryptoCodeService: CryptoCodeService) {}
  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Crypto Code created')
  @UseInterceptors(ResponseInterceptor)
  createCryptoCodes(@Body() model: CRYPTO_CODE_DTOS.createCryptoCodeDtos) {
    return this.cryptoCodeService.createCryptoCodes(model);
  }

  @Get('/getAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllCryptoCodes() {
    return this.cryptoCodeService.getAllCryptoCodes();
  }
  @Put('/updateByName')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updateByNameCryptoCodes(
    @Body() model: CRYPTO_CODE_DTOS.UpdateCryptoCodeDtos,
  ) {
    return this.cryptoCodeService.updateCryptoCodes(model);
  }
}
