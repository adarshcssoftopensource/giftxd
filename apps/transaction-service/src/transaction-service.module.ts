import { MongoConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JWTModuleGlobal } from '@app/common';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/transaction-service/.env`,
    }),
    JWTModuleGlobal,
    MongoConnectionModule.register('TRANSACTION'),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class TransactionServiceModule {}
