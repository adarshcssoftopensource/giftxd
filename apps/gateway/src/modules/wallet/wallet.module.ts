import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { JwtAuthGuard } from '../../../../../libs/common/src/guard/auth.guard';
import { AdminService } from '../admin/admin.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService, JwtAuthGuard, AdminService],
  exports: [WalletService],
})
export class WalletModule { }
