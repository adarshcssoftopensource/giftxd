import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Param,
  Put,
  Delete,
  HttpCode,
  UploadedFile,
} from '@nestjs/common';
import {
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { CryptoCardsService } from './crypto-cards.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cryptocard')
@ApiTags('cryptocard')
export class CryptoCardsController {
  constructor(private cryptocardService: CryptoCardsService) {}
  // @Post('/create')
  // @ResponseMessage('cryptocard created')
  // @UseInterceptors(ResponseInterceptor)
  // createCryptoCard(@Body() model: USER_DTOS.CryptoCreateDto) {
  //   return this.cryptocardService.createCryptoCard(model);
  // }

  @Get('/getall')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  async getUserCount() {
    return this.cryptocardService.getCryptoCards();
  }

  // @Delete('/:id')
  // @HttpCode(200)
  // @UseInterceptors(MessageResponseInterceptor)
  // async deleteCryptoCard(@Param('id') id: string) {
  //   return this.cryptocardService.deleteCryptoCard(id);
  // }
}
