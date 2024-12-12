import { ForbiddenException, Injectable, Logger, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_DTOS } from '@app/dto';
import axios from 'axios';
import {
  ORDER_MODELS,
  OFFER_MODELS,
  SELLER_MODEL,
  ORDER_TRANSACTION_MODEL,
  USER_MODELS,
  PROVIDER_MODEL,
  LINKED_ACCOUNT_MODEL,
  ORDER_HISTORY_MODELS,
  TWO_FA_SETTINGS_MODEL,
} from '@app/schemas';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
import { SellerOfferStatus } from '@app/schemas/seller/sellerOffer.schema';
import {
  ApiType,
  Order,
  OrderTransactionStatus,
  OrderType,
  RequestType,
  StatusType,
} from '@app/schemas/orders';
import { getBitcoinPrice } from 'apps/order-service/helper/btc-price';
import { User } from '@app/schemas/users';
import { GiftXdLogsService } from '../gifXd-logs/gifXd-logs.service';
import { RpcException } from '@nestjs/microservices';
import { BuyerOfferStatus } from '@app/schemas/offer/offer.schema';
import { CryptoService } from 'apps/gateway/src/modules/cryptos/cryptos.service';
import { verifyTwoFAComan } from '@app/common/twoFa/twoFa';
const toObjectId = Types.ObjectId;

@Injectable({ scope: Scope.REQUEST })
export class OrderService {
  private readonly logger = new Logger('OrderService');
  constructor(
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(ORDER_MODELS.Order.name)
    private orderModel: Model<ORDER_MODELS.Order>,
    @InjectModel(OFFER_MODELS.Offer.name)
    private offerModel: Model<OFFER_MODELS.Offer>,
    @InjectModel(SELLER_MODEL.SellerOffer.name)
    private sellerOfferModel: Model<SELLER_MODEL.SellerOffer>,
    @InjectModel(ORDER_TRANSACTION_MODEL.OrderTransaction.name)
    private OrderTransactionModel: Model<ORDER_TRANSACTION_MODEL.OrderTransaction>,
    @InjectModel(PROVIDER_MODEL.Provider.name)
    private providerModel: Model<PROVIDER_MODEL.Provider>,
    @InjectModel(ORDER_MODELS.UserCard.name)
    private userCardModel: Model<ORDER_MODELS.UserCard>,
    @InjectModel(LINKED_ACCOUNT_MODEL.LinkedAccount.name)
    private linkedAccountModel: Model<LINKED_ACCOUNT_MODEL.LinkedAccount>,
    @InjectModel(ORDER_HISTORY_MODELS.OrderHistory.name)
    private orderHistoryModel: Model<ORDER_HISTORY_MODELS.OrderHistory>,
    private jwt: JwtService,
    private giftXdLogService: GiftXdLogsService,
    private CryptoService: CryptoService,
    @InjectModel(TWO_FA_SETTINGS_MODEL.TwoFa.name)
    private twoFaModel: Model<TWO_FA_SETTINGS_MODEL.TwoFa>,
  ) {}
  generateRandomOrderNumber(): string {
    const min = 10000000;
    const max = 99999999;
    const randomOrderNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomOrderNumber.toString();
  }

  validateWalletBalance = async (orderAmountInBTC: number, createdBy: User) => {
    const logsPayload = {
      request: {
        orderAmountInBTC,
        createdBy,
      },
      API: ApiType.GET,
      serviceName: 'wallet',
      requestType: RequestType.Outbound,
      userId: createdBy.toString(),
      functionName: 'validateWalletBalance',
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    try {
      const response = await axios.get(
        `${process.env.WALLET_BASE_URL}wallets/internal/${createdBy}/balance`,
      );
      console.log(
        '🚀 ~ file: order.service.ts:82 ~ OrderService ~ validateWalletBalance ~ response:',
        response,
      );
      logsPayload['response'] = response.status;

      if (
        !response?.data?.available ||
        response?.data?.available.btcBalance < orderAmountInBTC
      ) {
        logsPayload['responseTimeStamp'] = new Date().toISOString();
        await this.giftXdLogService.createGifXdLogs(logsPayload);
        return false;
      }
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      await this.giftXdLogService.createGifXdLogs(logsPayload);
      return true;
    } catch (error) {
      console.log(
        '🚀 ~ file: order.service.ts:93 ~ OrderService ~ validateWalletBalance ~ error:',
        error,
      );
      // console.log('error', error);
      logsPayload['exception'] = error?.response;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      await this.giftXdLogService.createGifXdLogs(logsPayload);
      return false;
    } finally {
      console.log('Logs payload', logsPayload);
    }
  };

  walletEscrow = async (
    orderId: any,
    payer: User,
    payee: User,
    amountCrypto: number,
    ratePercentage: number,
    feePercentage: number,
  ) => {
    const payload = {
      payer: payer.toString(),
      payee: payee.toString(),
      amountCrypto: amountCrypto.toString(),
      ratePercentage: ratePercentage.toString(),
      feePercentage: feePercentage.toString(),
      assetType: 'BTC_TEST',
    };

    const options = {
      method: 'POST',
      url: `${process.env.WALLET_BASE_URL}wallets/internal/escrows`,
      data: payload,
    };
    const logsPayload = {
      request: options,
      API: ApiType.POST,
      serviceName: 'wallet',
      requestType: RequestType.Outbound,
      orderId: orderId,
      functionName: 'walletEscrow',
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    try {
      const response = await axios(options);
      console.log(
        '🚀 ~ file: order.service.ts:136 ~ OrderService ~ response:',
        response,
      );
      logsPayload['response'] = response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      if (response?.data?.escrowID) {
        const order = await this.orderModel.findById(orderId);
        const orderTransaction = {
          order: order._id,
          escrowId: response.data.escrowID,
          transactionStatus: OrderTransactionStatus.Escrow,
          amount: order.orderAmount,
        };
        await new this.OrderTransactionModel({ ...orderTransaction }).save();
        order.escrowId = response.data.escrowID;
        await order.save();
        return {
          status: true,
          escrowId: order.escrowId,
        };
      }
      return {
        status: false,
      };
    } catch (error) {
      console.log(
        '🚀 ~ file: order.service.ts:154 ~ OrderService ~ error:',
        error,
      );
      logsPayload['exception'] = error?.response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      return {
        status: false,
      };
    }
  };

  releaseAscrow = async (escrowId: string, orderId?: string) => {
    const options = {
      method: 'PATCH',
      url: `${process.env.WALLET_BASE_URL}wallets/internal/escrows/${escrowId}/release`,
    };
    const logsPayload = {
      request: options,
      API: ApiType.PATCH,
      serviceName: 'wallet',
      requestType: RequestType.Outbound,
      functionName: 'releaseAscrow',
      orderId: orderId.toString(),
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    try {
      const response = await axios(options);
      console.log(
        '🚀 ~ file: order.service.ts:183 ~ OrderService ~ releaseAscrow= ~ response:',
        response,
      );
      logsPayload['response'] = 'Escrow released successfully';
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      logsPayload['exception'] = error?.response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      return false;
    }
  };

  refundEscrow = async (order: Order, orderId: string) => {
    const options = {
      method: 'DELETE',
      url: `${process.env.WALLET_BASE_URL}wallets/internal/escrows/${order.escrowId}`,
    };
    const logsPayload = {
      request: options,
      API: ApiType.DELETE,
      serviceName: 'wallet',
      requestType: RequestType.Outbound,
      functionName: 'refundEscrow',
      orderId: orderId,
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    try {
      const response = await axios(options);
      logsPayload['response'] = response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      const orderTransaction = {
        order: order,
        amount: order.orderAmount,
        transactionStatus: OrderTransactionStatus.Refunded,
        escrowId: order.escrowId,
      };
      await new this.OrderTransactionModel({ ...orderTransaction }).save();
      return true;
    } catch (error) {
      logsPayload['exception'] = error?.response?.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      return false;
    }
  };

  async createOrder(model: ORDER_DTOS.CreateOrderDto) {
    const logsPayload = {
      request: model,
      API: ApiType.POST,
      serviceName: 'order',
      requestType: RequestType.Outbound,
      functionName: 'createOrder',
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    try {
      const twoFaSetting = await this.twoFaModel.findOne({ user: user._id });

      if (twoFaSetting && twoFaSetting.offerTwoFa && user.twofaEnabled  ) {
        const payload = {
          token: user._id,
          appSecret: model.twoFa,
          twofaSecret: user.twofaSecret,
        };

        const verified = await verifyTwoFAComan(payload);
        if (!verified) {
          return new RpcException('twoFa verification failed');
        }
      }
    } catch (error) {
      // Handle the error, e.g., log it or perform alternative actions
      console.error('Error fetching twoFaSetting:', error);
    }

    if (
      user?.role?.name !== roleType.Client &&
      user?.role?.name !== roleType.Vendor
    ) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const sellerOffer = await this.sellerOfferModel
      .findById(model.sellerOfferId)
      .populate('attributes');
    if (sellerOffer?.createdBy?.toString() !== user?._id?.toString()) {
      return new RpcException(new ForbiddenException('Invalid Id '));
    }
    const buyerOffer = await this.offerModel
      .findById(model.buyerOfferId)
      .populate('attributes');
    if (!buyerOffer) {
      return new RpcException('Invalid buyerOffer ID');
    }
    const order = await this.orderModel.findOne({
      sellerOffer: new toObjectId(model.sellerOfferId),
      orderType: { $ne: 'voided_orders' },
    });
    if (
      order &&
      (order.orderType === OrderType.ApprovedOrders ||
        order.orderType === OrderType.OpenOrders)
    ) {
      return new RpcException('Order already exits for seller offer');
    }

    const sellerAttributes = sellerOffer.attributes;
    const buyerAttributes = buyerOffer.attributes;

    function compareAttributes(a, b) {
      return a._id.equals(b._id);
    }

    // Will not match attributes if coupon type is eCode
    if (sellerOffer.eCode) {
      if (!buyerOffer.eCode) {
        return new RpcException({
          message: 'Buyer Seller mismatch',
        });
      }
    } else {
      const matchingAttributes = sellerAttributes.filter((sellerAttr) =>
        buyerAttributes.some((buyerAttr) =>
          compareAttributes(sellerAttr, buyerAttr),
        ),
      );
      if (matchingAttributes.length !== buyerAttributes.length) {
        const missingAttributes = buyerAttributes.filter(
          (buyerAttr) =>
            !sellerAttributes.some((sellerAttr) =>
              compareAttributes(buyerAttr, sellerAttr),
            ),
        );
        return new RpcException({
          message: 'Missing attributes',
          missingAttributes,
        });
      }
    }
    const price = await this.CryptoService.getLatestCryptoPrice('BTC');
    const btcPrice = (await getBitcoinPrice()) || price;
    const giftCardAmount = sellerOffer?.amount;
    const giftCardAmountInBTC = giftCardAmount / btcPrice;
    // if using real order price for balance check
    const amountRemaining =
      (sellerOffer.amount * buyerOffer.offerDiscount) / 100;
    const transactionFee = amountRemaining * (4 / 100);
    const orderAmountToCheckBal = amountRemaining + transactionFee;
    const orderAmountInBTC = orderAmountToCheckBal / btcPrice;
    // if not using real order price for balance check
    // const orderAmountInBTC = 0.00000001;
    const isSufficientWalletBalance = await this.validateWalletBalance(
      orderAmountInBTC,
      buyerOffer.vendor,
    );
    if (!isSufficientWalletBalance) {
      const accountToUpdate = buyerOffer.accounts;
      const updatedAccounts = accountToUpdate.map((account) => ({
        ...account,
        isActive: false,
      }));
      buyerOffer.accounts = updatedAccounts;
      buyerOffer.save();
      return new RpcException(
        'This offer is not longer available, please refresh',
      );
    }
    const offerAmount = sellerOffer.amount;
    const accountsToSort = buyerOffer.accounts;
    const accounts = accountsToSort.filter((account) => account.isActive);
    accounts.sort((a, b) => a.priority - b.priority);
    let remainingAmount = (offerAmount * buyerOffer.offerDiscount) / 100;
    let linkedAccount = null;
    let transactionFees = 0;
    let orderAmount = 0;
    for (const account of accounts) {
      if (remainingAmount <= 0) {
        break;
      }
      if (account.amount >= remainingAmount) {
        transactionFees = remainingAmount * (4 / 100);
        orderAmount = transactionFees + remainingAmount;
        account.amount -= offerAmount;
        if (Array.isArray(account.id)) {
          if (account.id.length > 0) {
            linkedAccount = account.id[0];
            const notAccount = await this.linkedAccountModel.findById(
              account.id[0],
            );
            if (!notAccount) {
              const accountIndex = accountsToSort.findIndex(
                (account) => account.id.toString() === linkedAccount,
              );
              if (accountIndex > -1) {
                const update = {
                  $set: {
                    [`accounts.${accountIndex}.isActive`]: false,
                  },
                };
                await this.offerModel.updateOne(
                  { _id: buyerOffer._id },
                  update,
                );
              }
              return new RpcException('offer no longer exist with account id');
            }
          } else {
            console.log('Array is empty');
          }
        } else {
          linkedAccount = account.id;
          const notAccount = await this.linkedAccountModel.findById(account.id);
          if (!notAccount) {
            const accountIndex = accountsToSort.findIndex(
              (account) => account.id.toString() === linkedAccount,
            );
            if (accountIndex > -1) {
              const update = {
                $set: {
                  [`accounts.${accountIndex}.isActive`]: false,
                },
              };
              await this.offerModel.updateOne({ _id: buyerOffer._id }, update);
            }
            return new RpcException('offer no longer exist with account id');
          }
        }

        const accountIndex = accountsToSort.findIndex(
          (account) => account.id.toString() === linkedAccount,
        );
        if (accountIndex > -1) {
          const update = {
            $inc: {
              [`accounts.${accountIndex}.amount`]: -orderAmountToCheckBal,
            },
          };
          await this.offerModel.updateOne({ _id: buyerOffer._id }, update);
        }
        remainingAmount = 0;
      }
    }
    if (!linkedAccount) {
      return new RpcException('Something went wrong');
    }
    const linkedAccountToUpdate = await this.linkedAccountModel.findById(
      linkedAccount,
    );
    linkedAccountToUpdate.consumption =
      linkedAccountToUpdate.consumption + orderAmountToCheckBal;
    linkedAccountToUpdate.save();
    await buyerOffer.save();
    const exchangeRate = buyerOffer.offerDiscount;
    const exchangeRateInBTC = exchangeRate / btcPrice;
    const order_payload = {
      buyerOffer: buyerOffer,
      linkedAccount: linkedAccount,
      sellerOffer: sellerOffer,
      vendor: buyerOffer.vendor,
      btcPrice: btcPrice,
      exchangeRateInBTC: exchangeRateInBTC,
      giftCardAmount: giftCardAmount,
      giftCardAmountInBTC: giftCardAmountInBTC,
      orderAmount,
      checkoutAmount: orderAmount - transactionFees,
      transactionRate: 4,
      transactionFees: Number(transactionFees.toFixed(2)),
      offerRate: buyerOffer.offerDiscount,
      currency: sellerOffer.currency,
      cryptocurrency: buyerOffer.cryptocurrency,
      provider: sellerOffer.paymentMethod,
      client: sellerOffer.createdBy,
      orderNumber: await this.generateRandomOrderNumber(),
    };
    buyerOffer.status = BuyerOfferStatus.matched;
    sellerOffer.status = SellerOfferStatus.matched;
    buyerOffer.save();
    sellerOffer.save();
    const data = await new this.orderModel({ ...order_payload }).save();
    const orderHistory = {
      order: data._id,
      status: data.status,
    };
    await new this.orderHistoryModel({ ...orderHistory }).save();
    // Calling wallet service to perform ascrow
    await this.walletEscrow(
      data._id,
      buyerOffer.vendor,
      sellerOffer.createdBy,
      orderAmountInBTC,
      exchangeRate / 100,
      4 / 100,
    );
    sellerOffer.status = SellerOfferStatus.matched;
    sellerOffer.transactionRate = 4;
    sellerOffer.transactionFees = transactionFees;
    sellerOffer.offerRate = buyerOffer.offerDiscount * 100;
    sellerOffer.checkoutAmount = orderAmount - transactionFees;
    await sellerOffer.save();
    if (sellerOffer.eCode) {
      await this.approveOrder(
        { id: data._id.toString(), token: model.token },
        true,
      );
    }
    logsPayload['responseTimeStamp'] = new Date().toISOString();
    await this.giftXdLogService.createGifXdLogs(logsPayload);
    return { orderNumber: data.orderNumber };
  }

  async getAllOrder(query: ORDER_DTOS.OrderPagingQueryDto) {
    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    let { page_number = '1', page_size = '10' } = query;
    page_number = Number(page_number);
    page_size = Number(page_size);
    let filter: Record<string, any> = {};
    let search: Record<string, any> = {};
    let orderTypeFilter: Record<string, any> = {};
    let providerFilter: Record<string, any> = {};
    const providersArray = Array.isArray(query.provider)
      ? query.provider
      : [query.provider];
    if (query.provider && query.provider.length > 0) {
      const providerIds = [];
      for (const providerValue of providersArray) {
        const provider = await this.providerModel.findOne({
          value: providerValue,
        });
        if (provider) {
          providerIds.push(provider._id);
        }
      }

      if (providerIds.length > 0) {
        providerFilter = { provider: { $in: providerIds } };
      }
    }
    if (!query.orderType) {
      orderTypeFilter = {
        orderType: {
          $in: [OrderType.ApprovedOrders, OrderType.VoidedOrders],
        },
      };
    }
    if (query.search) {
      search = {
        $or: [
          {
            riskScore: {
              $regex: `.*${query.search}.*`,
              $options: 'i',
            },
          },
          {
            offerRate: {
              $regex: `.*${query.search}.*`,
              $options: 'i',
            },
          },
          {
            orderAmount: {
              $regex: `.*${query.search}.*`,
              $options: 'i',
            },
          },
          {
            orderNumber: {
              $regex: `.*${query.search}.*`,
              $options: 'i',
            },
          },
          {
            'vendorinfo.firstname': {
              $regex: `.*${query.search}.*`,
              $options: 'i',
            },
          },
          {
            'clientInfo.firstname': {
              $regex: `.*${query.search}.*`,
              $options: 'i',
            },
          },
        ],
      };
    }
    if (query.status) {
      filter.status = query.status;
    }

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lt: new Date(query.endDate),
      };
    }

    if (query.orderType) {
      filter.orderType = query.orderType;
    }
    if (query.cryptocurrency) {
      filter.cryptocurrency = query.cryptocurrency;
    }

    if (query.minPrice && query.maxPrice) {
      filter.orderAmount = {
        $gte: parseInt(query.minPrice, 10),
        $lte: parseInt(query.maxPrice, 10),
      };
    }
    if (query.currency) {
      filter.currency = query.currency;
    }

    if (query.orderTransactionStatus) {
      filter.orderTransactionStatus = query.orderTransactionStatus;
    }
    const pipeline = [
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employees',
        },
      },

      {
        $project: {
          'employee.password': 0,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'client',
          foreignField: '_id',
          as: 'clientInfo',
        },
      },

      {
        $unwind: {
          path: '$clientInfo',
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          'clientInfo.password': 0,
          'clientInfo.token': 0,
        },
      },

      {
        $lookup: {
          from: 'supervisors',
          localField: 'supervisorId',
          foreignField: '_id',
          as: 'supervisors',
        },
      },

      {
        $project: {
          'supervisors.password': 0,
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorinfo',
        },
      },
      {
        $unwind: {
          path: '$vendorinfo',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          'vendorinfo.password': 0,
          'vendorinfo.token': 0,
        },
      },
      {
        $lookup: {
          from: 'offers',
          localField: 'buyerOffer',
          foreignField: '_id',
          as: 'buyerOfferInfo',
        },
      },
      {
        $lookup: {
          from: 'selleroffers',
          localField: 'sellerOffer',
          foreignField: '_id',
          as: 'sellerOfferInfo',
        },
      },
      {
        $lookup: {
          from: 'usercards',
          localField: 'sellerOffer',
          foreignField: 'sellerOffer',
          as: 'userCardsInfo',
        },
      },
      {
        $lookup: {
          from: 'ordertransactions',
          localField: '_id',
          foreignField: 'order',
          as: 'transactionHistory',
        },
      },
      {
        $lookup: {
          from: 'orderhistories',
          localField: '_id',
          foreignField: 'order',
          as: 'orderHistory',
        },
      },
      {
        $project: {
          'orderHistory._id': 0,
          'orderHistory.__V': 0,
          'transactionHistory._id': 0,
        },
      },
      {
        $match: {
          $and: [search, filter, providerFilter, orderTypeFilter],
        },
      },
      {
        $project: {
          employee: 0,
          supervisor: 0,
        },
      },
    ];
    const skip = page_number > 1 ? (page_number - 1) * page_size : 0;
    const order = await this.orderModel
      .aggregate(pipeline)
      .skip(skip)
      .limit(page_size)
      .sort({ createdAt: -1 });
    const data = order;
    return {
      data,
      items_count: data.length,
      page_number: page_number,
      page_size: page_size,
    };
  }

  async getByIdOrder(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');

    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    if (!id) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: id,
            msg: 'order not found',
            path: 'id',
          },
        ],
      });
    }

    const order = await this.orderModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employees',
        },
      },

      {
        $lookup: {
          from: 'supervisors',
          localField: 'supervisorId',
          foreignField: '_id',
          as: 'supervisors',
        },
      },

      {
        $lookup: {
          from: 'ordertransactions',
          localField: '_id',
          foreignField: 'order',
          as: 'orderTransactionsInfo',
        },
      },

      {
        $lookup: {
          from: 'offers',
          localField: 'buyerOffer',
          foreignField: '_id',
          as: 'buyerOfferInfo',
        },
      },
      {
        $lookup: {
          from: 'selleroffers',
          localField: 'sellerOffer',
          foreignField: '_id',
          as: 'sellerOfferInfo',
        },
      },
      {
        $lookup: {
          from: 'usercards',
          localField: 'sellerOffer',
          foreignField: 'sellerOffer',
          as: 'userCardsInfo',
        },
      },
      {
        $project: {
          employee: 0,
          supervisor: 0,
        },
      },
      {
        $lookup: {
          from: 'ordertransactions',
          localField: '_id',
          foreignField: 'order',
          as: 'transactionHistory',
        },
      },
      {
        $lookup: {
          from: 'orderhistories',
          localField: '_id',
          foreignField: 'order',
          as: 'orderHistory',
        },
      },
      {
        $project: {
          'orderHistory._id': 0,
          'orderHistory.__V': 0,
          'transactionHistory._id': 0,
        },
      },
    ]);
    if (!order) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'order not found',
            path: 'unknown',
          },
        ],
      });
    }

    return order;
  }

  async byIdSellerOrder(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user.role.name !== roleType.Client &&
      user.role.name !== roleType.Vendor
    ) {
      return new RpcException('Invalid user');
    }
    if (!id) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: id,
            msg: 'order not found',
            path: 'id',
          },
        ],
      });
    }
    const order = await this.orderModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          client: new Types.ObjectId(user.id),
        },
      },

      {
        $lookup: {
          from: 'offers',
          localField: 'buyerOffer',
          foreignField: '_id',
          as: 'buyerOfferInfo',
        },
      },
      {
        $unwind: '$buyerOfferInfo',
      },
      {
        $lookup: {
          from: 'selleroffers',
          localField: 'sellerOffer',
          foreignField: '_id',
          as: 'sellerOfferInfo',
        },
      },
      {
        $unwind: '$sellerOfferInfo',
      },
      {
        $project: {
          _id: '$_id',
          offerDiscount: '$buyerOfferInfo.offerDiscount',
          giftCardAmount: '$sellerOfferInfo.amount',
          currency: '$currency',
          offerRate: '$offerRate',
          cryptocurrency: '$buyerOfferInfo.cryptocurrency',
          checkoutAmount: '$checkoutAmount',
          giftCardAmountInBTC: '$giftCardAmountInBTC',
          exchangeRateInBTC: '$exchangeRateInBTC',
          btcPrice: '$btcPrice',
          transactionFees: '$transactionFees',
          transactionFeesBTC: { $divide: ['$transactionFees', '$btcPrice'] },
          checkoutAmountBTC: { $divide: ['$checkoutAmount', '$btcPrice'] },
        },
      },
    ]);

    if (!order || order.length === 0) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'order not found',
            path: 'unknown',
          },
        ],
      });
    }
    return order[0];
  }

  async updateOrder(model: ORDER_DTOS.OrderUpdateDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    const order = await this.orderModel.findById({ _id: model.id });

    if (!order || order.orderType !== OrderType.OpenOrders) {
      return new RpcException('Invalid Order ID');
    }
    const sellerOffer = await this.sellerOfferModel.findById(order.sellerOffer);
    const buyerOffer = await this.offerModel.findById(order.buyerOffer);
    if (!buyerOffer || !sellerOffer) {
      return new RpcException('Something went wrong');
    }
    const sellerUserCard = await this.userCardModel
      .findOne({ sellerOffer: sellerOffer._id })
      .exec();
    if (!sellerUserCard) {
      return new RpcException('Something went wrong');
    }
    const account = await this.linkedAccountModel.findOne({
      _id: order.linkedAccount,
    });
    const gift_card_number = sellerUserCard.card_number;
    order.status = model.status;
    order.updatedBy = user;
    if (order.status == ORDER_MODELS.StatusType.imageReviewed) {
      const payload = {
        account_id: account.externalId,
        gift_card_number: gift_card_number,
        order_id: order._id.toString(),
      };
      const base_url = process.env.BASE_URL_GCRS;
      const apiEndpoint = `${base_url}/gcrs/api/v1/redeem`;
      const options = {
        method: 'POST',
        url: apiEndpoint,
        data: payload,
      };
      try {
        const response = await axios(options);
        console.log(
          '🚀 ~ file: order.service.ts:885 ~ OrderService ~ updateOrder ~ response:',
          response,
        );
      } catch (error) {
        console.log(
          '🚀 ~ file: order.service.ts:888 ~ OrderService ~ updateOrder ~ error:',
          error,
        );
      }
    }
    if (order.status == ORDER_MODELS.StatusType.redeemed) {
      order.orderTransactionStatus =
        ORDER_MODELS.OrderTransactionStatus.Completed;
      order.orderType = OrderType.ApprovedOrders;
      const orderTransaction = {
        order: order._id,
        amount: order.orderAmount,
        transactionStatus: order.orderTransactionStatus,
      };
      await new this.OrderTransactionModel({ ...orderTransaction }).save();
    }
    const orderHistory = {
      order: order._id,
      status: order.status,
    };
    await new this.orderHistoryModel({ ...orderHistory }).save();
    await order.save();
    return order;
  }

  async cancelOrder(model: ORDER_DTOS.OrderCancelDto & { id: string }) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    const order = await this.orderModel.findById({ _id: model.id });

    if (!order || order.orderType !== OrderType.OpenOrders) {
      return new RpcException('Invalid Order ID');
    }
    const sellerOffer = await this.sellerOfferModel.findById(order.sellerOffer);
    const buyerOffer = await this.offerModel.findById(order.buyerOffer);
    if (!buyerOffer || !sellerOffer) {
      return new RpcException('Something went wrong');
    }

    order.notes = model.notes;
    order.orderType = OrderType.VoidedOrders;
    order.status = StatusType.reject;
    order.orderTransactionStatus = ORDER_MODELS.OrderTransactionStatus.Refunded;
    buyerOffer.status = BuyerOfferStatus.cancelled;
    sellerOffer.status = SellerOfferStatus.cancelled;
    buyerOffer.save();
    sellerOffer.save();
    order.updatedBy = user;
    const accountsList = [...buyerOffer.accounts];
    const accountIndex = accountsList.findIndex(
      (account) => account.id.toString() === order.linkedAccount.toString(),
    );
    if (accountIndex > -1) {
      const update = {
        $inc: { [`accounts.${accountIndex}.amount`]: order.orderAmount },
      };
      await this.offerModel.updateOne({ _id: order.buyerOffer }, update);
      const linkedAccountToUpdate = await this.linkedAccountModel.findById(
        new toObjectId(order.linkedAccount),
      );
      console.log(linkedAccountToUpdate, 'linkedAccountToUpdate');
      linkedAccountToUpdate.consumption -= order.orderAmount;
      linkedAccountToUpdate.save();
    }
    await this.refundEscrow(order, order._id.toString());
    await order.save();
    const orderHistory = {
      order: order._id,
      status: order.status,
    };
    console.log(orderHistory, 'orderHistory');
    await new this.orderHistoryModel({ ...orderHistory }).save();
    return order;
  }

  async deleteOrder(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin &&
      user?.role?.name !== roleType.Client
    ) {
      throw new RpcException('Invalid user');
    }

    const orderToDelete = await this.orderModel.findById(id);

    if (user.role.name == roleType.Client) {
      if (orderToDelete.client.toString() !== user._id.toString())
        return new RpcException('Order not found');
    }

    try {
      const order = await this.orderModel.findByIdAndDelete(id);
      if (!order) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'order not found',
              path: 'id',
            },
          ],
        });
      }
      return 'Deleted successfully';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async filter_order({
    order_type,
    page_number,
    page_size,
    token,
  }: ORDER_DTOS.FilterOrderDto) {
    const parsedPageNumber = Number(page_number || '1');
    const parsedPageSize = Number(page_size || '50');
    const skip = (parsedPageNumber - 1) * parsedPageSize;
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    try {
      const order = await this.orderModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'client',
            foreignField: '_id',
            as: 'client',
          },
        },
        {
          $unwind: {
            path: '$client',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employee',
          },
        },
        {
          $lookup: {
            from: 'supervisors',
            localField: 'supervisorId',
            foreignField: '_id',
            as: 'supervisors',
          },
        },
        {
          $match: {
            $and: [
              // {
              //   $or: [
              //     {
              //       order_number: {
              //         $regex: `.*${search}.*`,
              //         $options: 'i',
              //       },
              //     },
              //     {
              //       "supervisors.full_name": {
              //         $regex: `.*${search}.*`,
              //         $options: 'i',
              //       },
              //     },
              // {
              //   "employee.full_name": {
              //     $regex: `.*${search}.*`,
              //     $options: 'i',
              //   },
              // },
              //   ],
              // },
              {
                status: order_type,
              },
            ],
          },
        },
        {
          $facet: {
            result: [
              { $skip: skip },
              { $limit: parsedPageSize },
              { $sort: { created_at: -1 } },
              {
                $project: {
                  'client._id': '$client._id',
                  'client.firstname': '$client.firstname',
                  'client.lastname': '$client.lastname',
                  'client.email': '$client.email',
                  'client.avatar': '$client.avatar',
                  employees: {
                    $map: {
                      input: '$employee',
                      as: 'emp',
                      in: {
                        full_name: '$$emp.full_name',
                        _id: '$$emp._id',
                        email: '$$emp.email',
                        avatar: { $ifNull: ['$$emp.avatar', ''] },
                      },
                    },
                  },
                  supervisors: {
                    $map: {
                      input: '$supervisors',
                      as: 'supv',
                      in: {
                        full_name: '$$supv.full_name',
                        _id: '$$supv._id',
                        email: '$$supv.email',
                        avatar: { $ifNull: ['$$supv.avatar', ''] },
                      },
                    },
                  },
                  status: '$status',
                  order_amount: '$order_amount',
                  risk_score: '$risk_score',
                  limit: '$limit',
                  order_type: '$order_type',
                  order_number: '$order_number',
                  checkout_type: '$checkout_type',
                  updated_at: '$updated_at',
                  created_at: '$created_at',
                },
              },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      if (!order || !order[0] || !order[0].result) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'Order data not found',
              path: 'unknown',
            },
          ],
        });
      }
      const totalCount = order[0].totalCount[0]
        ? order[0].totalCount[0].count
        : 0;
      const data = order[0].result;
      console.log('data=-==>', data);

      return {
        data,
        totalCount,
        items_count: data.length,
        page_number: parsedPageNumber,
        page_size: parsedPageSize,
      };
    } catch (err) {
      throw new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async updateOrderGrc(
    model: ORDER_DTOS.OrderUpdateGcrsDto & { message?: string },
  ) {
    //store webhook on giftXD call
    const logsPayload = {
      orderId: model.orderId,
      request: model,
      requestType: RequestType.Inbound,
      API: ApiType.PUT,
      serviceName: 'gcrs',
      accountId: model.accountId,
      functionName: 'updateOrderGcrs',
      flow: 'updateOrderGcrs',
      response: 'Order updated',
    };
    this.giftXdLogService.createGifXdLogs(logsPayload);
    if (model.secretKey !== process.env.GCRS_KEY) {
      return new RpcException('Invalid secret key');
    }
    const order = await this.orderModel.findById({
      _id: new toObjectId(model.orderId),
    });
    if (!order) {
      return new RpcException('Invalid Order ID');
    }
    const sellerOffer = await this.sellerOfferModel.findById(order.sellerOffer);
    const buyerOffer = await this.offerModel.findById(order.buyerOffer);

    if (!buyerOffer || !sellerOffer) {
      return new RpcException('Something went wrong');
    }
    if (order.status == StatusType.redeemed) {
      return new RpcException('Already Redeemed');
    }
    if (model.status == StatusType.failure) {
      order.gcrsStatus = model.status;
      order.orderType = OrderType.RedeemptionFailure;
      order.gcrsFailure = model.message;
    } else {
      order.status = model.status;
      const orderHistory = {
        order: order._id,
        status: order.status,
      };
      order.gcrsStatus = model.status;
      order.orderType = OrderType.ApprovedOrders;
      await new this.orderHistoryModel({ ...orderHistory }).save();
    }
    if (order.status == ORDER_MODELS.StatusType.redeemed) {
      buyerOffer.status = BuyerOfferStatus.completed;
      sellerOffer.status = SellerOfferStatus.completed;
      buyerOffer.save();
      sellerOffer.save();
      console.log(
        '🚀 ~ file: order.service.ts:1147 ~ OrderService ~ updateOrderGrc ~ order.escrowId:',
        order.escrowId,
      );
      console.log(
        '🚀 ~ file: order.service.ts:1225 ~ OrderService ~ updateOrderGrc ~ order:',
        order,
      );
      if (order.giftCardAmount > model.amountInUsd) {
        await this.refundEscrow(order, order._id.toString());
        const giftCardAmount = model.amountInUsd;
        const giftCardAmountInBTC = giftCardAmount / order.btcPrice;
        const payableAmount = (giftCardAmount * buyerOffer.offerDiscount) / 100;
        const transactionFees = payableAmount * (4 / 100);
        const orderAmount = transactionFees + payableAmount;
        const orderAmountInBTC = orderAmount / order.btcPrice;

        const accountsList = [...buyerOffer.accounts];
        const accountIndex = accountsList.findIndex(
          (account) => account.id.toString() === order.linkedAccount.toString(),
        );
        if (accountIndex > -1) {
          const update = {
            $inc: {
              [`accounts.${accountIndex}.amount`]:
                order.orderAmount - payableAmount,
            },
          };
          await this.offerModel.updateOne({ _id: order.buyerOffer }, update);
          const linkedAccountToUpdate = await this.linkedAccountModel.findById(
            new toObjectId(order.linkedAccount),
          );
          linkedAccountToUpdate.consumption -=
            order.orderAmount - payableAmount;
          linkedAccountToUpdate.save();
        }
        order.giftCardAmount = giftCardAmount;
        order.giftCardAmountInBTC = giftCardAmountInBTC;
        order.orderAmount = orderAmount;
        order.amountInFiat = model.amountInFiat;
        order.gcrsCurrency = model.currency;
        order.checkoutAmount = payableAmount;
        order.transactionFees = Number(transactionFees.toFixed(2));
        await order.save();

        const isEscrow = await this.walletEscrow(
          order._id,
          buyerOffer.vendor,
          sellerOffer.createdBy,
          orderAmountInBTC,
          buyerOffer.offerDiscount / 100,
          4 / 100,
        );
        console.log(
          '🚀 ~ file: order.service.ts:1266 ~ OrderService ~ updateOrderGrc ~ isEscrow:',
          isEscrow,
        );
        if (isEscrow.status) {
          await this.releaseAscrow(isEscrow.escrowId, order._id.toString());
          order.orderTransactionStatus =
            ORDER_MODELS.OrderTransactionStatus.Completed;
          order.orderType = OrderType.ApprovedOrders;
          const orderTransaction = {
            order: order._id,
            amount: order.orderAmount,
            transactionStatus: order.orderTransactionStatus,
          };
          await new this.OrderTransactionModel({ ...orderTransaction }).save();
        }
      } else {
        await this.releaseAscrow(order.escrowId, order._id.toString());
        order.orderTransactionStatus =
          ORDER_MODELS.OrderTransactionStatus.Completed;
        order.orderType = OrderType.ApprovedOrders;
        const orderTransaction = {
          order: order._id,
          amount: order.orderAmount,
          transactionStatus: order.orderTransactionStatus,
        };
        await new this.OrderTransactionModel({ ...orderTransaction }).save();
      }
      console.log(
        '🚀 ~ file: order.service.ts:1147 ~ OrderService ~ updateOrderGrc ~ order.escrowId:',
        order.escrowId,
      );
    }
    logsPayload['response'] = 'Order updated successfully';
    await order.save();
    return 'Order updated successfully';
  }
  async approveOrder(model: ORDER_DTOS.OrderApproveDto, isAutoApprove = false) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      !isAutoApprove &&
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.childAdmin
    ) {
      throw new RpcException('Invalid user');
    }

    const order = await this.orderModel.findById({ _id: model.id });

    if (
      !order ||
      order?.orderType !== OrderType.OpenOrders ||
      order.status != StatusType.initiated
    ) {
      return new RpcException('Invalid Order ID');
    }
    const sellerOffer = await this.sellerOfferModel.findById(order.sellerOffer);
    const buyerOffer = await this.offerModel.findById(order.buyerOffer);
    if (!buyerOffer || !sellerOffer) {
      return new RpcException('Something went wrong');
    }
    const sellerUserCard = await this.userCardModel
      .findOne({ sellerOffer: sellerOffer._id })
      .exec();
    if (!sellerUserCard && !isAutoApprove) {
      return new RpcException('Gift card not uploaded');
    }
    const account = await this.linkedAccountModel.findOne({
      _id: order.linkedAccount,
    });

    // if offer type is eCode then use that as a gift card number
    const gift_card_number = sellerOffer.eCode
      ? sellerOffer.eCodeValue
      : sellerUserCard.card_number;
    order.updatedBy = user;
    order.status = ORDER_MODELS.StatusType.imageReviewed;
    order.orderType = ORDER_MODELS.OrderType.ApprovedOrders;
    buyerOffer.status = BuyerOfferStatus.processing;
    sellerOffer.status = SellerOfferStatus.processing;
    buyerOffer.save();
    sellerOffer.save();
    const orderHistory = {
      order: order._id,
      status: order.status,
    };
    await new this.orderHistoryModel({ ...orderHistory }).save();
    const payload = {
      account_id: account.externalId,
      gift_card_number: gift_card_number,
      order_id: order._id.toString(),
    };
    const base_url = process.env.BASE_URL_GCRS;
    console.log('payload', payload);
    const apiEndpoint = `${base_url}/gcrs/api/v1/redeem`;
    const options = {
      method: 'POST',
      url: apiEndpoint,
      data: payload,
    };
    const logsPayload = {
      request: options,
      API: ApiType.POST,
      serviceName: 'gcrs',
      requestType: RequestType.Outbound,
      orderId: order._id,
      functionName: 'approveOrder',
    };
    logsPayload['requestTimeStamp'] = new Date().toISOString();
    try {
      const response = await axios(options);
      console.log(
        '🚀 ~ file: order.service.ts:1358 ~ OrderService ~ approveOrder ~ response:',
        response,
      );
      logsPayload['response'] = response.data;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      if (response.data.status == 'failure') {
        // order.gcrsStatus = 'Redemption-failed';
        // order.save();
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: order.service.ts:1366 ~ OrderService ~ approveOrder ~ error:',
        error,
      );
      logsPayload['exception'] = error.response.data;
      order.gcrsStatus = 'Redemption-failed';
      order.gcrsFailure = error.response?.data?.message;
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      this.giftXdLogService.createGifXdLogs(logsPayload);
      if (error.response.data.status == 'failure') {
        // order.gcrsStatus = 'Redemption-failed';
        // order.save();
      }
    }
    await order.save();
    delete order.createdBy;
    return order;
  }
}
