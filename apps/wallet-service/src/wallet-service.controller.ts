import { InternalEscrowDto } from './../../../libs/dto/src/wallet/wallet.dto';
import { Controller } from '@nestjs/common';
import { WalletServiceService } from './wallet-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('wallet')
export class WalletServiceController {
  constructor(private readonly walletServiceService: WalletServiceService) {}

  @MessagePattern('wallet.getwallet')
  getUserWallet(userId: string): Promise<any> {
    return this.walletServiceService.getWallet(userId);
  }

  @MessagePattern('wallet.create')
  postWallet(userId: string): Promise<any> {
    return this.walletServiceService.createWallet(userId);
  }

  @MessagePattern('wallet.internal.balance')
  walletInternalBalance(userId: string) {
    return this.walletServiceService.walletInternalBalance(userId);
  }

  @MessagePattern('wallet.internal.transfer')
  internalBalanceTransfer({ sourceUserId, internalBalanceTransferDto }) {
    return this.walletServiceService.internalTransfer({
      sourceUserId,
      internalBalanceTransferDto,
    });
  }

  @MessagePattern('wallet.external.transfers')
  getExternalTransfers({ sourceUserId, status }) {
    return this.walletServiceService.getExternalTransfers({
      sourceUserId,
      status,
    });
  }

  @MessagePattern('wallet.external.withdrawal')
  externalWalletTransfer({
    sourceUserId,
    assetType,
    externalWithdrawalDto,
  }): Promise<any> {
    return this.walletServiceService.externalWithdrawals({
      sourceUserId,
      assetType,
      externalWithdrawalDto,
    });
  }
  @MessagePattern('wallet.internal.escrows')
  internalWalletEscrow(internalEscrowDto: InternalEscrowDto) {
    return this.walletServiceService.createWalletEscrow(internalEscrowDto);
  }
}
