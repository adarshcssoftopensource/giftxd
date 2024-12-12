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
import { OrderService } from './order.service';
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ORDER_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/create')
  @HttpCode(201)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Order created')
  @UseInterceptors(ResponseInterceptor)
  createOrder(@Body() model: ORDER_DTOS.CreateOrderDto) {
    return this.orderService.createOrder(model);
  }

  @Get('/getAll')
  @HttpCode(200)
  @ResponseMessage('get all data')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async getAllOrder(@Query() query: ORDER_DTOS.OrderPagingQueryDto) {
    try {
      const data = await this.orderService.getAllOrder(query);
      return data;
    } catch (error) {
      console.log(
        '🚀 ~ file: order.controller.ts:44 ~ OrderController ~ getAllOrder ~ error:',
        error,
      );
    }
  }

  @Get('/getById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  getByIdOrder(@Query('id') id: string) {
    return this.orderService.getByIdOrder(id);
  }

  @Get('/seller')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  byIdSellerOrder(@Query('id') id: string) {
    return this.orderService.byIdSellerOrder(id);
  }

  // @Put('/update')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  // @HttpCode(200)
  // @ResponseMessage('update order')
  // @ApiHeader(access_token_payload)
  // @UseGuards(AuthGuards.JwtAuthGuard)
  // @UseInterceptors(ResponseInterceptor)
  // async updateOrder(@Body() model: ORDER_DTOS.OrderUpdateDto) {
  //   return await this.orderService.updateOrder(model);
  // }

  @Put('/void')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('voided order')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async cancelOrder(@Body() model: ORDER_DTOS.OrderCancelDto) {
    return this.orderService.cancelOrder(model);
  }

  @Delete('delete')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('delete data')
  @UseInterceptors(ResponseInterceptor)
  async deleteOrder(@Query('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @Get('/filter')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('data fetched')
  @UseInterceptors(ResponseInterceptor)
  async filter_order(@Query() model: ORDER_DTOS.FilterOrderDto) {
    return this.orderService.flter_topic(model);
  }

  @Put('gcrs/order-update')
  @ApiExcludeEndpoint()
  @HttpCode(200)
  @ResponseMessage('update order')
  @UseInterceptors(ResponseInterceptor)
  async updateOrderGrc(@Body() model: ORDER_DTOS.OrderUpdateGcrsDto) {
    return await this.orderService.updateOrderGrc(model);
  }

  @Put('/approve')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('update order')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async approveOrder(@Body() model: ORDER_DTOS.OrderApproveDto) {
    return await this.orderService.approveOrder(model);
  }

  // @Get('my-ip')
  // async getMyIp(@Ip() ip) {
  //   return ip;
  // }

  // @Get('my-ip')
  // get(@RealIP() ip: string): string {
  //   console.log("🚀 ~ file: order.controller.ts:149 ~ OrderController ~ get ~ ip:", ip)
  //   return ip;
  // }
}
