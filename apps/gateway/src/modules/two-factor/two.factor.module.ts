import { Module } from '@nestjs/common';
import { TwoFactorAuthController } from './two.factor.controller';
import { TwoFactorAuthService } from './two.factor.service';
import { ClientService } from '../clients/client.service';

@Module({
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, ClientService],
})
export class TwoFactorAuthModule {}
