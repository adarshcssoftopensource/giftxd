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
  UploadedFiles,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuards,
  ResponseInterceptor,
  ResponseMessage,
  memoryUploader,
} from '@app/common';
import { SellerService } from './seller.service';
import { ApiBody, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { OFFER_DTOS, ORDER_DTOS, SELLER_DTOS } from '@app/dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { access_token_payload } from '@app/common/global/swagger';
@Controller('seller')
@ApiTags('Seller')
export class SellerController {
  constructor(private sellerService: SellerService) {}
  @Post('/offer')
  @ResponseMessage('offer created')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  createSchedule(@Body() model: SELLER_DTOS.CreateOfferDto) {
    return this.sellerService.createSeller(model);
  }

  @Get('/recommdation')
  @ResponseMessage('get all recommdation')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  getRecommdation(
    @Query() query: OFFER_DTOS.OfferPagingQueryDto,
    @Query('id') id: string,
  ) {
    return this.sellerService.getRecommdation(query, id);
  }

  @Get('/getAll')
  @ResponseMessage('get all data')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  getAllOffer(@Query() query: OFFER_DTOS.OfferSellerPagingQueryDto) {
    return this.sellerService.getAllOffer(query);
  }

  @Get('/getById')
  @ResponseMessage('fetch the data')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  getByIdOffer(@Query('id') id: string) {
    return this.sellerService.getByIdOffer(id);
  }

  @Put('/update')
  @ResponseMessage('update offer')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async updateoffer(@Body() model: SELLER_DTOS.UpdateOfferDto) {
    return await this.sellerService.updateOffer(model);
  }

  @Get('/orders')
  @ResponseMessage('Get Seller orders')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async orders(@Query() query: OFFER_DTOS.orderQueryDtoWithFilter) {
    return this.sellerService.getOrders(query);
  }

  @Put('/order/cancel')
  @ResponseMessage('order')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async cancelOrder(@Body() model: ORDER_DTOS.OrderCancelDto) {
    return this.sellerService.cancelOrder(model);
  }

  @Delete('delete')
  @ResponseMessage('delete data')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async deleteOffer(@Query('id') id: string) {
    return this.sellerService.deleteOffer(id);
  }

  @Post('/uploadGiftCard')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'front_side_image', maxCount: 1 },
        { name: 'back_side_image', maxCount: 1 },
        { name: 'receipt_front_side', maxCount: 1 },
        { name: 'receipt_back_side', maxCount: 1 },
      ],
      { storage: memoryUploader() },
    ),
  )
  @UseInterceptors(ResponseInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ORDER_DTOS.CreateUserCardFileDto,
    required: false,
  })
  @ResponseMessage('card detail upload')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  uploadCard(
    @UploadedFiles() files: any,
    @Body() model: ORDER_DTOS.CreateUserCardBodyDto,
  ) {
    return this.sellerService.uploadCard(files, model);
  }

  @Get('/getUserCard')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('card detail fetched')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  getUserCards(@Query() query: ORDER_DTOS.GetUserCardDto) {
    return this.sellerService.getUserCards(query);
  }

  @Get('/OrderById')
  @ResponseMessage('fetch the data')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  getByIdOrder(@Query('id') id: string) {
    return this.sellerService.getByIdOrder(id);
  }

  @Get('getReview/')
  @ResponseMessage('Get Seller orders')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async sellerGetReview(@Query() query: OFFER_DTOS.sellerGetReview) {
    return this.sellerService.sellerGetReview(query);
  }
}
