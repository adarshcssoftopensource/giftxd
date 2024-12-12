import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { MailServiceModule } from './mail-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 7373,
      },
    },
  );
  await app.listen();
  console.log('Mail-Service Is Running On Port 7373');
}
bootstrap();
