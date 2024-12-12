import { Module, DynamicModule, Global } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Global()
@Module({})
export class TCPConnectionModule {
  static register(
    SERVICE_NAME: string,
    env: {
      hostKey?: string;
      portKey: string;
    },
  ): DynamicModule {
    return {
      module: TCPConnectionModule,
      imports: [ConfigModule],
      providers: [
        ConfigService,
        {
          provide: SERVICE_NAME,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            console.log(configService.get(env.portKey));

            return ClientProxyFactory.create({
              transport: Transport.TCP,
              options: {
                host: configService.get(env.hostKey) ?? '0.0.0.0',
                port: Number(configService.get(env.portKey)),
              },
            });
          },
        },
      ],
      exports: [ConfigService, SERVICE_NAME],
    };
  }
}
