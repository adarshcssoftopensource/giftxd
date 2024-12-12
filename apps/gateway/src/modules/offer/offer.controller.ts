import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { OfferService } from './offer.service';
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger';
import { OFFER_DTOS, ORDER_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('offer')
@ApiTags('offer')
export class OfferController {
  constructor(private OfferService: OfferService) {}

  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(201)
  @ResponseMessage('offer created')
  @UseInterceptors(ResponseInterceptor)
  createOffer(@Body() model: OFFER_DTOS.OfferCreateDto) {
    return this.OfferService.createOffer(model);
  }

  @Get('/getAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllOffer(@Query() query: OFFER_DTOS.OfferPagingQueryDto) {
    return this.OfferService.getAllOffer(query);
  }

  @Put('/order/cancel')
  @ResponseMessage('order')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async cancelOrder(@Body() model: ORDER_DTOS.OrderCancelDto) {
    return this.OfferService.cancelOrder(model);
  }

  @Get('/orders')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('get all orders')
  @UseInterceptors(ResponseInterceptor)
  getOrders(@Query() query: OFFER_DTOS.orderQueryDtoWithFilter) {
    return this.OfferService.getAllOrders(query);
  }

  @Get('/getRecommdation')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getRecommdation(@Query() query: OFFER_DTOS.getRecommdationDto) {
    return this.OfferService.getRecommdation(query);
  }

  @Get('/getById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getByIdOffer(@Query('id') id: string) {
    return this.OfferService.getByIdOffer(id);
  }

  @Put('/update')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('update offer')
  @UseInterceptors(ResponseInterceptor)
  async updateoffer(@Body() model: OFFER_DTOS.OfferUpdateDto) {
    return await this.OfferService.updateOffer(model);
  }

  @Delete('delete')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('delete data')
  @UseInterceptors(ResponseInterceptor)
  // @ApiExcludeEndpoint()
  async deleteOffer(@Query('id') id: string) {
    return this.OfferService.deleteOffer(id);
  }

  @Get('/orderGetById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getByIdOrder(@Query('id') id: string) {
    return this.OfferService.getByIdOrder(id);
  }

  @Post('/create/duplicate')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(201)
  @ResponseMessage('offer created')
  @UseInterceptors(ResponseInterceptor)
  duplicateOffer(@Body() model: OFFER_DTOS.duplicateOfferCreateDto) {
    return this.OfferService.duplicateOffer(model);
  }
}
