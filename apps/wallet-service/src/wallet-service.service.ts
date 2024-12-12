import { InternalEscrowDto } from '@app/dto/wallet';
import { USER_MODELS } from '@app/schemas';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

@Injectable()
export class WalletServiceService {
  private walletBaseUrl = process.env.WALLET_BASE_URL;
  constructor(
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
  ) {}
  async getWallet(userId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.walletBaseUrl}/wallets/external/${userId}/address`,
      );
      return response.data;
    } catch (error) {
      const { status, data } = error.response;
      return new RpcException({ error: data.error, errorCode: status });
    }
  }

  async createWallet(userId: string): Promise<any> {
    try {
      const response = await axios.post(`${this.walletBaseUrl}/wallets`, {
        userID: userId,
      });
      return response.data;
    } catch (error) {
      const { status, data } = error.response;
      return new RpcException({ error: data.error, errorCode: status });
    }
  }

  async walletInternalBalance(userId: string) {
    try {
      const response = await axios.get(
        `${this.walletBaseUrl}/wallets/internal/${userId}/balance`,
      );
      return response.data;
    } catch (error) {
      const { status, data } = error.response;
      return new RpcException({ error: data.error, errorCode: status });
    }
  }
  async internalTransfer({ sourceUserId, internalBalanceTransferDto }) {
    try {
      const isExist = await this.userModel.findOne({
        username: internalBalanceTransferDto.destinationUsername,
      });

      // Check if destination user not exists
      if (!isExist) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: internalBalanceTransferDto.destinationUsername,
              msg: 'Username does not exist',
            },
          ],
        });
      }

      // Perform the internal balance transfer
      await axios.post(
        `${this.walletBaseUrl}/wallets/internal/${sourceUserId}/transfers`,
        {
          amount: internalBalanceTransferDto.amount,
          assetType: internalBalanceTransferDto.assetType,
          destinationUserId: isExist?._id,
        },
      );

      // Return success message
      return { data: 'Money transfer successful' };
    } catch (error) {
      // Error Handling
      if (error.response) {
        const { status, data } = error.response;
        return new RpcException({ data: data.error, errorCode: status });
      } else {
        // Log and handle unexpected errors
        console.error('An unexpected error occurred:', error);
        return new RpcException({
          errorCode: 500,
          message: 'Internal server error',
        });
      }
    }
  }

  async getExternalTransfers({ sourceUserId, status }) {
    try {
      const response = await axios.get(
        `${this.walletBaseUrl}/wallets/external/${sourceUserId}/transfers?status=${status}`,
      );
      return response.data;
    } catch (error) {
      const { status, data } = error.response;
      return new RpcException({ data: data.error, errorCode: status });
    }
  }

  async externalWithdrawals({
    sourceUserId,
    assetType,
    externalWithdrawalDto,
  }) {
    try {
      await axios.post(
        `${this.walletBaseUrl}/wallets/external/${sourceUserId}/${assetType}/withdrawals`,
        externalWithdrawalDto,
      );
      return { data: 'Withdrwal Successfull' };
    } catch (error) {
      // Error Handling
      if (error.response) {
        const { status, data } = error.response;
        return new RpcException({ data: data.error, errorCode: status });
      } else {
        // Log and handle unexpected errors
        console.error('An unexpected error occurred:', error);
        return new RpcException({
          errorCode: 500,
          message: 'Internal server error',
        });
      }
    }
  }

  async createWalletEscrow(internalEscrowDto: InternalEscrowDto) {
    try {
      const response = await axios.post(
        `${this.walletBaseUrl}/wallets/internal/escrows`,
        internalEscrowDto,
      );
      return response.data;
    } catch (error) {
      const { status, data } = error.response;
      return new RpcException({ message: data, errorCode: status });
    }
  }
}
