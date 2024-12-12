import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
  HttpCode,
  Inject,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  AuthGuards,
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { access_token_payload } from '@app/common/global/swagger';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { WALLET_DTOS } from '@app/dto';
@Controller('wallet')
@ApiTags('wallet')
@UseGuards(AuthGuards.JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    @Inject(REQUEST) private request: Request,
    private jwt: JwtService,
  ) {}

  @Post('/internal/transfer')
  @HttpCode(201)
  @ResponseMessage('Transfered Success!')
  @ApiHeader(access_token_payload)
  @UseInterceptors(MessageResponseInterceptor)
  internalBalanceTransfer(
    @Body() internalBalanceTransferDto: WALLET_DTOS.InternalBalanceTransferDto,
  ) {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);

    return this.walletService.balanceTransfer(
      decode['_id'],
      internalBalanceTransferDto,
    );
  }

  @Get('/internal/balance')
  @HttpCode(200)
  @ResponseMessage('Internal Balance Fetched!')
  @ApiHeader(access_token_payload)
  @UseInterceptors(ResponseInterceptor)
  getWalletInternalBalance() {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    return this.walletService.walletInternalBalance(decode['_id']);
  }

  @Get('/external/get-wallet-address')
  @HttpCode(200)
  @ResponseMessage('Wallet Address Fetched!')
  @ApiHeader(access_token_payload)
  @UseInterceptors(ResponseInterceptor)
  getWalletAddress() {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    return this.walletService.getWallet(decode['_id']);
  }

  @Get('/external/transfer')
  @HttpCode(200)
  @ResponseMessage('External Transfer Fetched!')
  @ApiHeader(access_token_payload)
  @UseInterceptors(ResponseInterceptor)
  getExternalTransfers(@Query('status') status: string) {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    return this.walletService.getExternalTransfers(decode['_id'], status);
  }

  @Post('/external/withdrawal/:assetType')
  @HttpCode(201)
  @ResponseMessage('Withdrawal Success!')
  @ApiHeader(access_token_payload)
  @UseInterceptors(MessageResponseInterceptor)
  externalBalanceWithdrawals(
    @Param('assetType') assetType: string,
    @Body() externalWithdrawalDto: WALLET_DTOS.ExternalWithdrawalDto,
  ) {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    return this.walletService.externalWithdrawal(
      decode['_id'],
      assetType,
      externalWithdrawalDto,
    );
  }

  @Post('/internal/escrows')
  @HttpCode(201)
  @ApiHeader(access_token_payload)
  @UseInterceptors(MessageResponseInterceptor)
  internalWalletEscrow(
    @Body() internalEscrowDto: WALLET_DTOS.InternalEscrowDto,
  ) {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    return this.walletService.internalWalletEscrow(
      decode['_id'],
      internalEscrowDto,
    );
  }
}
