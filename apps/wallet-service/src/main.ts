import { NestFactory } from '@nestjs/core';
import { WalletServiceModule } from './wallet-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WalletServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 7377,
      },
    },
  );
  await app.listen();
  console.log('Wallet Service Is Running On Port 7377');
}

bootstrap();

