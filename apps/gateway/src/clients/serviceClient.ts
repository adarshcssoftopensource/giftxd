import { TCPConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AdminService } from '../modules/admin/admin.service';
import { ClientController } from '../modules/clients/client.controller';
import { ClientService } from '../modules/clients/client.service';
import { OrderController } from '../modules/order/order.controller';
import { OrderService } from '../modules/order/order.service';
import { SellerService } from '../modules/seller/seller.service';
import { SellerController } from '../modules/seller/seller.controller';
import { WalletController } from '../modules/wallet/wallet.controller';
import { WalletService } from '../modules/wallet/wallet.service';

@Module({
  controllers: [ClientController, OrderController, SellerController, WalletController],
  providers: [ClientService, AdminService, OrderService, SellerService, WalletService],
  imports: [
    TCPConnectionModule.register('AUTH_CLIENT_SERVICE', {
      // hostKey: 'AUTH_CLIENT_SERVICE_HOST',
      portKey: 'AUTH_CLIENT_SERVICE_PORT',
    }),
    TCPConnectionModule.register('ORDER_CLIENT_SERVICE', {
      // hostKey: 'ORDER_CLIENT_SERVICE_HOST',
      portKey: 'ORDER_CLIENT_SERVICE_PORT',
    }),
    TCPConnectionModule.register('SELLER_CLIENT_SERVICE', {
      // hostKey: 'SELLER_CLIENT_SERVICE_HOST',
      portKey: 'SELLER_CLIENT_SERVICE_PORT',
    }),
    TCPConnectionModule.register('TRANSACTION_CLIENT_SERVICE', {
      // hostKey: 'TRANSACTION_CLIENT_SERVICE_HOST',
      portKey: 'TRANSACTION_CLIENT_SERVICE_PORT',
    }),
    TCPConnectionModule.register('WALLET_CLIENT_SERVICE', {
      // hostKey: 'WALLET_CLIENT_SERVICE_HOST',
      portKey: 'WALLET_CLIENT_SERVICE_PORT',
    }),
  ],
})
export class ServiceClient { }
console.log();
