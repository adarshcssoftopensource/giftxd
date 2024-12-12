import { TCPConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TCPConnectionModule.register('MAIL_CLIENT_SERVICE', {
      portKey: 'MAIL_CLIENT_SERVICE_PORT',
    }),
  ],
})
export class ServiceClient {}
