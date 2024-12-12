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
import { CurrencyCodeService } from './currency-code.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CURRENCY_CODE_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('Currency-Codes')
@ApiTags('Currency-Codes')
export class CurrencyCodesController {
  constructor(private currencyCodeService: CurrencyCodeService) {}
  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Currency Codes created')
  @UseInterceptors(ResponseInterceptor)
  createCurrencyCodes(@Body() model: CURRENCY_CODE_DTOS.createCurrencyDtos) {
    return this.currencyCodeService.createCurrencyCodes(model);
  }

  @Get('/getAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllCurrencyCodes() {
    return this.currencyCodeService.getAllCurrencyCodes();
  }
  @Put('/updateByName')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updateByNameCurrencyCodes(
    @Body() model: CURRENCY_CODE_DTOS.UpdateCurrencyDtos,
  ) {
    return this.currencyCodeService.updateCurrencyCodes(model);
  }
}
