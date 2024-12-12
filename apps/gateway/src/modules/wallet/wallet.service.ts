import { WALLET_DTOS } from '@app/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class WalletService {
  constructor(
    @Inject('WALLET_CLIENT_SERVICE') private readonly walletClient: ClientProxy,
  ) {}

  getWallet(userId: string) {
    return this.walletClient.send('wallet.getwallet', userId);
  }

  walletInternalBalance(userId: string) {
    return this.walletClient.send('wallet.internal.balance', userId);
  }

  balanceTransfer(
    sourceUserId: string,
    internalBalanceTransferDto: WALLET_DTOS.InternalBalanceTransferDto,
  ) {
    return this.walletClient.send('wallet.internal.transfer', {
      sourceUserId,
      internalBalanceTransferDto,
    });
  }

  getExternalTransfers(sourceUserId: string, status) {
    return this.walletClient.send('wallet.external.transfers', {
      sourceUserId,
      status,
    });
  }

  externalWithdrawal(
    sourceUserId: string,
    assetType: string,
    externalWithdrawalDto: WALLET_DTOS.ExternalWithdrawalDto,
  ) {
    return this.walletClient.send('wallet.external.withdrawal', {
      sourceUserId,
      assetType,
      externalWithdrawalDto,
    });
  }

  internalWalletEscrow(
    sourceUserId: string,
    internalEscrowDto: WALLET_DTOS.InternalEscrowDto,
  ) {
    return this.walletClient.send('wallets.internal.escrows', {
      sourceUserId,
      internalEscrowDto,
    });
  }
}
