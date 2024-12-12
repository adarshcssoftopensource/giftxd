import { Injectable, Inject, Scope } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';
@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly orderClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
    @Inject('WALLET_CLIENT_SERVICE') private readonly walletClient: ClientProxy,
  ) {}

  async createOrder(model: ORDER_DTOS.CreateOrderDto) {
    model.token = this.request.headers['x-access-token'];
    const response = this.orderClientService.send('order.create', model);
    return response;
  }

  // async createOrder(model: ORDER_DTOS.CreateOrderDto) {
  //   try {
  //     model.token = this.request.headers['x-access-token'];
  //     const response = await firstValueFrom(
  //       this.orderClientService.send('order.create', model),
  //     );
  //     if (response[0]?.vendor && response[0]?.client) {
  //       const escrow_payload = {
  //         payer: response[0]?.vendor,
  //         payee: response[0]?.client,
  //         amountCrypto: '0.01',
  //         ratePercentage: '0.75',
  //         feePercentage: '0.04',
  //         assetType: 'BTC_TEST',
  //       };
  //       const escrow = await firstValueFrom(
  //         this.walletClient.send('wallet.internal.escrows', escrow_payload),
  //       );
  //       if (escrow?.error) {
  //         return escrow;
  //       } else {
  //         return 'Order Created';
  //       }
  //     } else {
  //       return response;
  //     }
  //   } catch (error) {
  //     console.log(
  //       '🚀 ~ file: order.service.ts:29 ~ OrderService ~ createOrder ~ error:',
  //       error,
  //     );
  //   }
  // }
  async getAllOrder(query: ORDER_DTOS.OrderPagingQueryDto) {
    try {
      query.token = this.request.headers['x-access-token'];
      const data = await this.orderClientService.send('order.getAll', query);
      return data;
    } catch (error) {
      console.log(
        '🚀 ~ file: order.service.ts:29 ~ OrderService ~ getAllOrder ~ error:',
        error,
      );
    }
  }
  getByIdOrder(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.getById', { id, token });
  }
  byIdSellerOrder(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.byIdSellerOrder', { id, token });
  }
  updateOrder(model: ORDER_DTOS.OrderUpdateDto) {
    model.token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.update', { ...model });
  }
  cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    model.token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.cancel', { ...model });
  }
  deleteOrder(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.deleteById', { id, token });
  }
  flter_topic(model: ORDER_DTOS.FilterOrderDto) {
    model.token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.filter', model);
  }

  updateOrderGrc(model: ORDER_DTOS.OrderUpdateGcrsDto) {
    return this.orderClientService.send('order.updateGrc', { ...model });
  }

  approveOrder(model: ORDER_DTOS.OrderApproveDto) {
    model.token = this.request.headers['x-access-token'];
    return this.orderClientService.send('order.approve', { ...model });
  }
}
