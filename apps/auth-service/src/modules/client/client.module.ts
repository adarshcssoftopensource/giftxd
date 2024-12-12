import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Client.name, schema: USER_MODELS.ClientSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
      { name: HOME_MODELS.PhoneNumber.name, schema: HOME_MODELS.PhoneNumberSchema}
    ]),
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
    ConfigService,
    {
      provide: 'PlaidClient',
      useFactory: (configService: ConfigService) => {
        const clientId = configService.get<string>('PLAID_CLIENT_ID');
        const secret = configService.get<string>('PLAID_SECRET');
        const environment = configService.get<string>('PLAID_ENVIRONMENT')
        if (!clientId || !secret) {
          throw new Error('Plaid credentials not found');
        }

        const configuration = new Configuration({
          basePath: (environment == "PRODUCTION")  ? PlaidEnvironments.production : PlaidEnvironments.sandbox,
          baseOptions: {
            headers: {
              'PLAID-CLIENT-ID': clientId,
              'PLAID-SECRET': secret,
            },
          },
        });
        return new PlaidApi(configuration);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['PlaidClient'],
})
export class ClientModule {}
