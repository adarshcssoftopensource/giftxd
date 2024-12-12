import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';
import { Controller } from '@nestjs/common';
import { ORDER_DTOS } from '@app/dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}
  @MessagePattern('order.create')
  async createorder(model: ORDER_DTOS.CreateOrderDto) {
    const data = await this.orderService.createOrder(model);
    return data;
  }
  @MessagePattern('order.getAll')
  async ordergetAll(query: ORDER_DTOS.OrderPagingQueryDto) {
    try {
      const data = await this.orderService.getAllOrder(query);
      return data;
    } catch (error) {
      console.log(
        '🚀 ~ file: order.controller.ts:21 ~ OrderController ~ ordergetAll ~ error:',
        error,
      );
      return error;
    }
  }
  @MessagePattern('order.getById')
  async getByIdOrder({ id, token }) {
    const order = await this.orderService.getByIdOrder(id, token);
    return order;
  }

  @MessagePattern('order.byIdSellerOrder')
  async byIdSellerOrder({ id, token }) {
    const order = await this.orderService.byIdSellerOrder(id, token);
    return order;
  }

  @MessagePattern('order.update')
  async updateOrder(model: ORDER_DTOS.OrderUpdateDto) {
    const order = await this.orderService.updateOrder(model);
    return order;
  }

  @MessagePattern('order.cancel')
  async cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    const order = await this.orderService.cancelOrder(model);
    return order;
  }

  @MessagePattern('order.deleteById')
  async deleteOrder({ id, token }) {
    const order = await this.orderService.deleteOrder(id, token);
    return order;
  }
  @MessagePattern('order.filter')
  async filterOrder(model: ORDER_DTOS.FilterOrderDto) {
    const order = await this.orderService.filter_order(model);
    return order;
  }

  @MessagePattern('order.updateGrc')
  async updateOrderGrc(model: ORDER_DTOS.OrderUpdateGcrsDto) {
    const order = await this.orderService.updateOrderGrc(model);
    return order;
  }

  @MessagePattern('order.approve')
  async approveOrder(model: ORDER_DTOS.OrderUpdateDto) {
    const order = await this.orderService.approveOrder(model);
    return order;
  }
}
