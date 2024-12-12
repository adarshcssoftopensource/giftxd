import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OFFER_DTOS, ORDER_DTOS } from '@app/dto';
import {
  ATTRIBUTE_MODEL,
  OFFER_MODELS,
  PROVIDER_MODEL,
  LINKED_ACCOUNT_MODEL,
  USER_MODELS,
  SELLER_MODEL,
  ORDER_MODELS,
  ORDER_TRANSACTION_MODEL,
  HOME_MODELS,
  ORDER_HISTORY_MODELS,
  TWO_FA_SETTINGS_MODEL,
} from '@app/schemas';
import { Document, Model, Types } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { roleType } from '@app/schemas/users/role.schema';
import { JwtService } from '@nestjs/jwt';
import {
  ApiType,
  OrderType,
  RequestType,
  StatusType,
} from '@app/schemas/orders';
import { getBitcoinPrice } from 'apps/order-service/helper/btc-price';
import { CryptoService } from 'apps/gateway/src/modules/cryptos/cryptos.service';
import { GiftXdLogsService } from '../gifXd-logs/gifXd-logs.service';
import { BuyerOfferStatus } from '@app/schemas/offer/offer.schema';
import { SellerOfferStatus } from '@app/schemas/seller/sellerOffer.schema';
import { decryptData, obfuscateEmail } from '@app/common/encryption';
import { KycVerificationStatus } from '@app/schemas/users/client.schema';
import { sortTypeOffer, sortTypeOrder } from '@app/dto/offers';
import { verifyTwoFAComan } from '@app/common/twoFa/twoFa';

const toObjectId = Types.ObjectId;
@Injectable()
export class OfferService {
  constructor(
    @InjectModel(OFFER_MODELS.Offer.name)
    private offerModel: Model<OFFER_MODELS.Offer>,
    @InjectModel(ORDER_MODELS.Order.name)
    private orderModel: Model<ORDER_MODELS.Order>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(ATTRIBUTE_MODEL.Attribute.name)
    private attributeModel: Model<ATTRIBUTE_MODEL.Attribute>,
    @InjectModel(PROVIDER_MODEL.Provider.name)
    private providerModel: Model<PROVIDER_MODEL.Provider>,
    @InjectModel(LINKED_ACCOUNT_MODEL.LinkedAccount.name)
    private linkedAccountModel: Model<LINKED_ACCOUNT_MODEL.LinkedAccount>,
    @InjectModel(HOME_MODELS.Crypto.name)
    private cryptoModel: Model<HOME_MODELS.Crypto>,
    @InjectModel(SELLER_MODEL.SellerOffer.name)
    private SellerOfferModel: Model<SELLER_MODEL.SellerOffer>,
    @InjectModel(ORDER_TRANSACTION_MODEL.OrderTransaction.name)
    private OrderTransactionModel: Model<ORDER_TRANSACTION_MODEL.OrderTransaction>,
    @InjectModel(ORDER_HISTORY_MODELS.OrderHistory.name)
    private orderHistoryModel: Model<ORDER_HISTORY_MODELS.OrderHistory>,
    @InjectModel(USER_MODELS.Client.name)
    private clientModel: Model<USER_MODELS.Client>,
    @InjectModel(HOME_MODELS.PhoneNumber.name)
    private phoneNumberModel: Model<HOME_MODELS.PhoneNumber>,
    @InjectModel(TWO_FA_SETTINGS_MODEL.TwoFa.name)
    private twoFaModel: Model<TWO_FA_SETTINGS_MODEL.TwoFa>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private jwt: JwtService,
    private giftXdLogService: GiftXdLogsService,
    private cryptoService: CryptoService,
  ) {}

  async cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const order = await this.orderModel.findById({ _id: model.id });

    if (!order || order.vendor.toString() !== user.id.toString()) {
      return new RpcException('order not found');
    }
    if (!order || order.orderType !== OrderType.OpenOrders) {
      return new RpcException('Invalid Order ID');
    }
    const sellerOffer = await this.SellerOfferModel.findById(order.sellerOffer);
    const buyerOffer = await this.offerModel.findById(order.buyerOffer);

    if (!buyerOffer || !sellerOffer) {
      return new RpcException('Something went wrong');
    }

    order.notes = model.notes;
    order.orderType = OrderType.VoidedOrders;
    order.status = StatusType.cancelled;
    buyerOffer.status = BuyerOfferStatus.cancelled;
    sellerOffer.status = SellerOfferStatus.cancelled;
    buyerOffer.save();
    sellerOffer.save();
    order.orderTransactionStatus = ORDER_MODELS.OrderTransactionStatus.Refunded;
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
      linkedAccountToUpdate.consumption -= order.orderAmount;
      linkedAccountToUpdate.save();
    }
    await order.save();
    const orderHistory = {
      order: order._id,
      status: order.status,
    };
    await new this.orderHistoryModel({ ...orderHistory }).save();
    const orderTransaction = {
      order: order._id,
      amount: order.orderAmount,
      transactionStatus: order.orderTransactionStatus,
    };
    await new this.OrderTransactionModel({ ...orderTransaction }).save();
    return 'Attempt to cancel';
  }

  async findBestOffers(
    sellerOffer: Document<unknown, {}, SELLER_MODEL.SellerOffer> &
      SELLER_MODEL.SellerOffer & {
        _id: Types.ObjectId;
      },
    offers: Omit<
      Document<unknown, {}, OFFER_MODELS.Offer> &
        OFFER_MODELS.Offer & {
          _id: Types.ObjectId;
        },
      never
    >[],
  ) {
    const sellerAttributes = sellerOffer.attributes;
    let highestOffer: {
      matchingAttributes: ATTRIBUTE_MODEL.Attribute[];
      offer: OFFER_MODELS.Offer;
    } = null;
    let recommendedOffers: {
      matchingAttributes: ATTRIBUTE_MODEL.Attribute[];
      missingAttributes: ATTRIBUTE_MODEL.Attribute[];
      offer: OFFER_MODELS.Offer;
    }[] = [];
    for (const offer of offers) {
      const buyerAttributes = offer.attributes;
      if (buyerAttributes.length < 1) {
        continue;
      }

      function compareAttributes(a, b) {
        return a._id.equals(b._id);
      }
      const matchingAttributes = sellerAttributes.filter((sellerAttr) =>
        buyerAttributes.some((buyerAttr) =>
          compareAttributes(sellerAttr, buyerAttr),
        ),
      );
      const missingAttributes = buyerAttributes.filter(
        (buyerAttr) =>
          !sellerAttributes.some((sellerAttr) =>
            compareAttributes(buyerAttr, sellerAttr),
          ),
      );

      if (missingAttributes.length === 0) {
        offer.attributes = [];
        if (
          !highestOffer ||
          highestOffer.offer.offerDiscount < offer.offerDiscount
        ) {
          // If highest offer exist and we are going to replace it with new
          // highest offer than we should push older highest offer for recommended offer
          if (highestOffer) {
            recommendedOffers.push({
              matchingAttributes: highestOffer.matchingAttributes,
              missingAttributes: [],
              offer: highestOffer.offer,
            });
          }
          highestOffer = {
            matchingAttributes: buyerAttributes,
            offer,
          };
        } else if (matchingAttributes.length > 0) {
          recommendedOffers.push({
            matchingAttributes,
            missingAttributes,
            offer,
          });
        }
      } else {
        recommendedOffers.push({
          matchingAttributes,
          missingAttributes,
          offer,
        });
      }
    }
    // Remove any recommended offer less than highest offer discount.
    // This way we can show more offers with less matching attributes.
    recommendedOffers = recommendedOffers.map((ro) => {
      ro.offer.attributes = [];
      return ro;
    });
    if (highestOffer) {
      recommendedOffers = recommendedOffers.filter(
        (ro) => highestOffer?.offer?.offerDiscount < ro?.offer?.offerDiscount,
      );
    }
    recommendedOffers = recommendedOffers.sort(
      (a, b) => b.offer.offerDiscount - a.offer.offerDiscount,
    );
    try {
      const logsPayload = {
        API: ApiType.GET,
        serviceName: 'offer',
        requestType: RequestType.Outbound,
        functionName: 'getRecommendation-offer',
      };
      logsPayload['requestTimeStamp'] = new Date().toISOString();
      if (highestOffer) {
        const price = await this.cryptoService.getLatestCryptoPrice('BTC');
        const btcPrice = (await getBitcoinPrice()) || price;
        const giftCardAmount = sellerOffer?.amount;
        const giftCardAmountInBTC = giftCardAmount / btcPrice;
        const exchangeRateInBTC = highestOffer?.offer.offerDiscount / btcPrice;
        sellerOffer.giftCardAmountInBTC = giftCardAmountInBTC;
        sellerOffer.btcPrice = btcPrice;
        sellerOffer.exchangeRateInBTC = exchangeRateInBTC;
        sellerOffer.save();
      }
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      await this.giftXdLogService.createGifXdLogs(logsPayload);
    } catch (error) {
      const logsPayload = {
        API: ApiType.GET,
        serviceName: 'offer',
        requestType: RequestType.Outbound,
        functionName: 'getRecommendation-offer',
      };
      logsPayload['responseTimeStamp'] = new Date().toISOString();
      logsPayload['exception'] = error?.response?.data;
      console.error('Error processing the offer:', error);
      await this.giftXdLogService.createGifXdLogs(logsPayload);
      this.giftXdLogService.createGifXdLogs(logsPayload);
    }

    return {
      highestOffer: highestOffer,
      recommendedOffers: recommendedOffers,
    };
  }

  async getRecommdation(query: OFFER_DTOS.getRecommdationDto) {
    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const sellerOffer = await this.SellerOfferModel.findById(query.sellerId, {
      currency: 1,
      amount: 1,
      paymentMethod: 1,
      rateType: 1,
      walletAddress: 1,
      eCode: 1,
      createdBy: 1,
    }).populate('attributes', { name: 1 });
    if (!sellerOffer) {
      return new RpcException('Invalid sellerOffer ID');
    }
    const sellerUser = await this.userModel.findById(sellerOffer.createdBy);
    if (!sellerUser) {
      return new RpcException('Seller not found ');
    }
    if (sellerOffer.createdBy.toString() !== user._id.toString()) {
      return new RpcException(
        'Permission Denied: Offer does not belong to the user',
      );
    }
    const offerQuery = {
      currency: sellerOffer.currency,
      minPrice: { $lte: sellerOffer.amount },
      maxPrice: { $gte: sellerOffer.amount },
      paymentMethod: sellerOffer.paymentMethod,
      'accounts.amount': { $gte: sellerOffer.amount },
      'accounts.isActive': true,
      isPaused: false,
      eCode: false,
    };
    if (sellerOffer.eCode) {
      offerQuery.eCode = true;
    }
    const recommendedOffers = await this.offerModel
      .find(offerQuery, {
        offerDiscount: 1,
        currency: 1,
        rateType: 1,
        status: 1,
        fundingSource: 1,
        maxPrice: 1,
        minPrice: 1,
        limitationByCountries: 1,
        allowedCountries: 1,
        blockedCountries: 1,
        verifiedSeller: 1,
      })
      .populate('attributes', { name: 1 })
      .sort({ offerDiscount: -1 });
    console.log(recommendedOffers, 'recommendedOffers');
    const client = await this.clientModel.findOne({ user: decode['_id'] });
    const phone_number = await this.phoneNumberModel.findOne({
      phoneNumber: user.phone_number,
    });
    const sellerCountry = sellerUser.country || sellerUser.country_code;
    const isSellerVerified =
      phone_number?.isVerified &&
      client.identity_verif_status == KycVerificationStatus.COMPLETED &&
      client.residency_verif_status == KycVerificationStatus.COMPLETED;
    console.log(isSellerVerified, 'isSellerVerified');
    const filteredOffers = recommendedOffers.filter((offer) => {
      if (offer.verifiedSeller && !isSellerVerified) {
        return false;
      } else if (offer.limitationByCountries) {
        if (offer.allowedCountries?.length) {
          return offer.allowedCountries.indexOf(sellerCountry) > -1;
        } else if (offer.blockedCountries?.length) {
          return offer.blockedCountries.indexOf(sellerCountry) === -1;
        }
      }
      return true;
    });
    // Will not match attributes if coupon type is eCode
    if (sellerOffer.eCode) {
      return {
        highestOffer: { offer: recommendedOffers[0] },
        recommendedOffers: [],
      };
    }
    return this.findBestOffers(sellerOffer, filteredOffers);
  }
  async createOffer(model: OFFER_DTOS.OfferCreateDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    try {
      const twoFaSetting = await this.twoFaModel.findOne({ user: user._id });

      if (twoFaSetting && twoFaSetting.offerTwoFa && user.twofaEnabled) {
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
      console.error('Error fetching twoFaSetting:', error);
    }

    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    if (model.attributes && model.attributes.length > 0) {
      try {
        for (const attribute of model.attributes) {
          await this.attributeModel.findById({
            _id: new toObjectId(attribute),
          });
        }
      } catch (error) {
        return new RpcException('Invalid Attributes ID');
      }
    }
    const provider = await this.providerModel.findOne({
      value: model.paymentMethod,
    });
    if (!provider) {
      return new RpcException('Payment method not found');
    }
    if (model.offerDiscount) {
      if (model.offerDiscount < 50)
        return new RpcException('Minimum discount rate 50%');
    }
    try {
      const offer_payload = {
        vendor: user.id,
        cryptocurrency: model.cryptocurrency,
        currency: model.currency,
        eCode: model.eCode,
        limitationByCountries: model.limitationByCountries,
        allowedCountries: model.allowedCountries,
        blockedCountries: model.blockedCountries,
        paymentMethod: provider._id,
        isPaused: model.isPaused,
        minPrice: model.minPrice,
        verifiedSeller: model.verifiedSeller,
        maxPrice: model.maxPrice,
        attributes: model.attributes,
        offerDiscount: model.offerDiscount,
      };
      if (model.accounts) {
        try {
          const accounts = [];
          for (const a of model.accounts) {
            const accountId = a.id;
            const account = await this.linkedAccountModel.findById(accountId);
            a.isActive = true;
            if (account) {
              const remainingLimit = account.giftXD_limit - account.consumption;
              if (a.amount > remainingLimit) {
                a.isActive = false;
              }
              if (user._id.toString() !== account.vendor.toString()) {
                return new RpcException('Mismatched Vendor');
              }
              if (!account.externalId) {
                return new RpcException('Account not verified.');
              }
              if (account.giftXD_limit < account.consumption) {
                return new RpcException('Account limit exceeded');
              }
              a.amount = Number(a.amount);
              a.priority = Number(a.priority);
              accounts.push(a);
              a.originalAmount = a.amount;
              offer_payload['accounts'] = accounts;
            } else {
              return new RpcException('Invalid Account ID');
            }
          }
        } catch (error) {
          return new RpcException('Error occurred while processing accounts');
        }
      }
      const data = await new this.offerModel({ ...offer_payload }).save();
      const accountsCount = data.accounts.length;
      const tagsCount = data.attributes.length;
      return {
        provider: provider.name,
        status: data.status,
        tagsCount: tagsCount,
        accountsCount: accountsCount,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      };
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
  async getAllOffer(query: OFFER_DTOS.OfferPagingQueryDto) {
    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    let { page_number = '1', page_size = '10' } = query;
    page_number = Number(page_number);
    page_size = Number(page_size);

    const skip = (page_number - 1) * page_size;

    let queryBuilder = this.offerModel.find({ vendor: user }).select({
      blockedCountries: 0,
      limitationByCountries: 0,
      verified: 0,
      allowedCountries: 0,
    });
    let whereClause = {};
    if (query.status) {
      if (query.status == BuyerOfferStatus.paused) {
        whereClause = {
          isPaused: {
            $eq: true,
          },
        };
      } else {
        whereClause = {
          isPaused: {
            $eq: false,
          },
          status: query.status,
        };
      }
    } else {
      whereClause = {
        isPaused: {
          $eq: false,
        },
      };
    }
    if (Object.keys(whereClause).length) {
      queryBuilder = queryBuilder.where(whereClause);
    }
    try {
      const offers = await queryBuilder
        .select({ userType: 0, updated_at: 0 })
        .populate('paymentMethod', { name: 1, value: 1, active: 1, _id: 0 })
        .skip(skip)
        .sort({ created_at: query.sortBy === sortTypeOffer.ascending ? 1 : -1 })
        .limit(page_size)
        .exec();
      for (const offer of offers) {
        try {
          const { accounts } = offer;

          const modifiedAccounts = await Promise.all(
            accounts.map(async (account) => {
              try {
                const { id } = account;
                const linkedAccount = await this.linkedAccountModel
                  .findById(id)
                  .select({
                    email: 1,
                    giftXD_limit: 1,
                    consumption: 1,
                    created_at: 1,
                    emailIv: 1,
                    _id: 0,
                    externalId: 1,
                  });

                if (!linkedAccount) {
                  for (const account of offer.accounts) {
                    account.isActive = false;
                  }
                }
                const email = linkedAccount.email;
                const encryptedData = {
                  iv: linkedAccount.emailIv,
                  encryptedData: email,
                };
                const decryptedEmail = await decryptData(encryptedData);
                const hiddenEmail = obfuscateEmail(decryptedEmail);
                const externalId = linkedAccount.externalId;
                const hasExternalId = !!externalId;

                return {
                  email: hiddenEmail,
                  giftXD_limit: linkedAccount.giftXD_limit,
                  consumption: linkedAccount.consumption,
                  created_at: linkedAccount.created_at,
                  externalId: hasExternalId,
                };
              } catch (error) {
                console.error(`Error processing account: ${error.message}`);
                return account;
              }
            }),
          );
          offer.accounts = modifiedAccounts as any;
        } catch (error) {
          console.error(`Error processing offer: ${error.message}`);
        }
      }
      return offers;
    } catch (error) {
      return new Error('Failed to retrieve offers.');
    }
  }

  async getBuyerOrders(query: OFFER_DTOS.orderQueryDtoWithFilter) {
    let { page_number = '1', page_size = '10' } = query;
    page_number = Number(page_number);
    page_size = Number(page_size);

    const skip = (page_number - 1) * page_size;

    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    try {
      let filter: Record<string, any> = {};
      if (query.status) {
        filter.status = query.status;
      }
      // if (query.sortBy) {
      //   if (query.sortBy == sortTypeOrder.recentlyInitiated) {
      //     filter.sort
      //   }
      // }
      filter.vendor = user._id;
      const orders = await this.orderModel
        .aggregate([
          {
            $match: {
              $and: [filter],
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
            $lookup: {
              from: 'usercards',
              localField: 'sellerOffer',
              foreignField: 'sellerOffer',
              as: 'userCardsInfo',
            },
          },
          {
            $unwind: {
              path: '$userCardsInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'client',
              foreignField: '_id',
              as: 'sellerInfo',
            },
          },
          {
            $unwind: {
              path: '$sellerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'vendor',
              foreignField: '_id',
              as: 'buyerInfo',
            },
          },
          {
            $unwind: {
              path: '$buyerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'providers',
              localField: 'provider',
              foreignField: '_id',
              as: 'providerInfo',
            },
          },
          {
            $unwind: {
              path: '$providerInfo',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              userCardsInfo: {
                $cond: {
                  if: { $eq: ['$status', StatusType.redeemed] },
                  then: '$userCardsInfo',
                  else: null,
                },
              },
              orderNumber: 1,
              orderAmount: 1,
              providerName: '$providerInfo.name',
              sellerUsername: '$sellerInfo.username',
              buyerInfo: '$buyerInfo.username',
              offerAmount: '$sellerOfferInfo.amount',
              orderTransactionStatus: 1,
              giftCardAmountInBTC: 1,
              transactionRate: 1,
              transactionFees: 1,
              offerRate: 1,
              orderType: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
              currency: 1,
              transactionHistory: {
                status: 1,
                amount: 1,
                transactionStatus: 1,
                createdAt: 1,
                updatedAt: 1,
              },
              orderHistory: {
                status: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          },
          {
            $sort:
              query.sortBy === sortTypeOrder.cardType
                ? { providerName: 1 }
                : { createdAt: -1 },
          },
          {
            $skip: skip,
          },
          {
            $limit: page_size,
          },
        ])
        .exec();

      return orders;
    } catch (error) {
      throw new Error('Failed to retrieve orders.');
    }
  }

  async getByIdOffer(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const offer = await this.offerModel.findById({
      _id: new toObjectId(id),
    });
    if (!offer) {
      return new RpcException('Offer not found');
    }
    if (!offer || offer.vendor.toString() !== user.id.toString()) {
      return new RpcException('Offer  not found');
    }
    return offer;
  }

  async updateOffer(model: OFFER_DTOS.OfferUpdateDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    try {
      const twoFaSetting = await this.twoFaModel.findOne({ user: user._id });

      if (twoFaSetting && twoFaSetting.offerTwoFa) {
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
      console.error('Error fetching twoFaSetting:', error);
    }
    try {
      const offer = await this.offerModel.findById(model.id);
      if (!offer) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'internal',
              value: 'unknown',
              msg: 'offer not found',
              path: 'unknown',
            },
          ],
        });
      }
      if (!offer || offer.vendor.toString() !== user.id.toString()) {
        return new RpcException('Offer not found');
      }
      if (model.currency) {
        offer.currency = model.currency;
      }

      if (model.paymentMethod) {
        const provider = await this.providerModel.findOne({
          value: model.paymentMethod,
        });
        if (!provider) {
          return new RpcException({
            errorCode: 400,
            message: [
              {
                type: 'internal',
                value: 'unknown',
                msg: 'Payment method not found',
                path: 'unknown',
              },
            ],
          });
        }
        offer.paymentMethod = provider;
      }
      if (model.minPrice) {
        offer.minPrice = model.minPrice;
      }
      if (model.verifiedSeller !== undefined) {
        offer.verifiedSeller = model.verifiedSeller;
      }
      if (model.isPaused !== undefined) {
        offer.isPaused = model.isPaused;
      }
      if (model.eCode !== undefined) {
        offer.eCode = model.eCode;
      }
      if (model.limitForNewUser) {
        offer.limitForNewUser = model.limitForNewUser;
      }
      if (model.minimumTrade) {
        offer.minimumTrade = model.minimumTrade;
      }
      if (model.limitationByCountries !== undefined) {
        offer.limitationByCountries = model.limitationByCountries;
      }
      if (model.allowedCountries) {
        offer.allowedCountries = model.allowedCountries;
      }
      if (model.blockedCountries) {
        offer.blockedCountries = model.blockedCountries;
      }
      if (model.algorithmDetection) {
        offer.algorithmDetection = model.algorithmDetection;
      }
      if (model.proxyOrVpn) {
        offer.proxyOrVpn = model.proxyOrVpn;
      }
      if (model.userType) {
        offer.userType = model.userType;
      }
      if (model.label) {
        offer.label = model.label;
      }
      if (model.terms) {
        offer.terms = model.terms;
      }
      if (model.tradeInstructions) {
        offer.tradeInstructions = model.tradeInstructions;
      }
      if (model.notes) {
        offer.notes = model.notes;
      }
      if (model.cryptocurrency) {
        offer.cryptocurrency = model.cryptocurrency;
      }
      if (model.maxPrice) {
        offer.maxPrice = model.maxPrice;
      }
      if (model.offerDiscount) {
        if (model.offerDiscount < 50)
          return new RpcException('Minimum discount rate 50%');
        offer.offerDiscount = model.offerDiscount;
      }
      if (model.attributes && model.attributes.length > 0) {
        try {
          const attributes: ATTRIBUTE_MODEL.Attribute[] = [];
          for (const attributeId of model.attributes) {
            const attribute = await this.attributeModel.findById(attributeId);
            if (attribute) {
              attributes.push(attribute);
            }
          }
          offer.attributes = attributes;
        } catch (error) {
          return new RpcException('Invalid Attribute ID');
        }
      }
      if (model.accounts) {
        try {
          const accounts = [];
          for (const a of model.accounts) {
            const accountId = a.id;
            const account = await this.linkedAccountModel.findById(accountId);
            a.isActive = true;
            if (account) {
              const remainingLimit = account.giftXD_limit - account.consumption;
              if (a.amount > remainingLimit) {
                a.isActive = false;
              }
              if (offer.vendor.toString() !== account.vendor.toString()) {
                return new RpcException('Mismatched Vendor');
              }
              if (!account.externalId) {
                return new RpcException('Account not verified.');
              }
              if (account.giftXD_limit < account.consumption) {
                return new RpcException('Account limit exceeded');
              }
              a.amount = Number(a.amount);
              a.priority = Number(a.priority);
              accounts.push(a);
              a.originalAmount = a.amount;
            } else {
              return new RpcException('Invalid Account ID');
            }
          }
          offer.accounts = accounts;
        } catch (error) {
          return new RpcException('Error occurred while processing accounts');
        }
      }
      await offer.save();
      return 'Updated Successfully';
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

  async deleteOffer(id, token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const offer = await this.offerModel.findById(id);
    if (!offer) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: 'offer not found',
            path: 'unknown',
          },
        ],
      });
    }
    if (!offer || offer.vendor.toString() !== user.id.toString()) {
      return new RpcException('Offer not found');
    }
    try {
      const offer = await this.offerModel.findByIdAndDelete(id);
      if (!offer) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'offer not found',
              path: 'id',
            },
          ],
        });
      }
      return offer;
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

  async getByIdOrder(id, token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const order = await this.orderModel.findById(id);
    if (!order) {
      return new RpcException('Order not  found');
    }
    if (!order || order.vendor.toString() !== user.id.toString()) {
      return new RpcException('Order not found');
    }
    try {
      const order = await this.orderModel.aggregate([
        {
          $match: {
            _id: new toObjectId(id),
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
          $lookup: {
            from: 'usercards',
            localField: 'sellerOffer',
            foreignField: 'sellerOffer',
            as: 'userCardsInfo',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'client',
            foreignField: '_id',
            as: 'sellerInfo',
          },
        },
        {
          $unwind: {
            path: '$sellerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'vendor',
            foreignField: '_id',
            as: 'buyerInfo',
          },
        },
        {
          $unwind: {
            path: '$buyerInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            userCardsInfo: {
              $cond: {
                if: { $eq: ['$status', StatusType.redeemed] },
                then: '$userCardsInfo',
                else: null,
              },
            },
            orderNumber: 1,
            orderAmount: 1,
            sellerUsername: '$sellerInfo.username',
            buyerUsername: '$buyerInfo.username',
            offerAmount: '$sellerOfferInfo.amount',
            orderTransactionStatus: 1,
            transactionRate: 1,
            transactionFees: 1,
            offerRate: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            currency: 1,
            transactionHistory: {
              status: 1,
              amount: 1,
              createdAt: 1,
              transactionStatus: 1,
              updatedAt: 1,
            },
            orderHistory: {
              status: 1,
              amount: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        },
      ]);
      return order;
    } catch (error) {
      throw new Error('Failed to retrieve order.');
    }
  }

  async duplicateOffer(model: OFFER_DTOS.duplicateOfferCreateDto) {
    const decodedToken: any = this.jwt.decode(model.token);
    const user = await this.userModel
      .findById(decodedToken._id)
      .populate('role');

    if (user.role.name !== roleType.Vendor) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const offer = await this.offerModel.findById(model.id);

    if (!offer || offer.vendor.toString() !== user._id.toString()) {
      return new RpcException('Offer not found');
    }

    const createOfferPayload = {
      cryptocurrency: offer.cryptocurrency,
      currency: offer.currency,
      offerDiscount: offer.offerDiscount,
      minPrice: offer.minPrice,
      maxPrice: offer.maxPrice,
      attributes: offer.attributes,
      paymentMethod: offer.paymentMethod,
      vendor: offer.vendor,
      status: BuyerOfferStatus.pending,
    };

    if (offer.accounts) {
      try {
        const accounts = [];

        for (const accountInfo of offer.accounts) {
          const accountId = accountInfo.id;
          const account = await this.linkedAccountModel.findById(accountId);

          accountInfo.isActive = true;

          if (account) {
            if (accountInfo.amount > account.giftXD_limit) {
              accountInfo.isActive = false;
            }
            if (offer.vendor.toString() !== account.vendor.toString()) {
              return new RpcException('Mismatched Vendor');
            }

            if (!account.externalId) {
              return new RpcException('Account not verified.');
            }

            if (account.giftXD_limit < account.consumption) {
              return new RpcException('Account limit exceeded');
            }

            accountInfo.amount = Number(accountInfo.amount);
            accountInfo.priority = Number(accountInfo.priority);
            accounts.push(accountInfo);
            accountInfo.originalAmount = accountInfo.amount;
          } else {
            return new RpcException('Invalid Account ID');
          }
        }
        createOfferPayload['accounts'] = accounts;

        const extraFields = [
          'verified',
          'limitForNewUser',
          'minimumTrade',
          'limitationByCountries',
          'allowedCountries',
          'blockedCountries',
          'algorithmDetection',
          'proxyOrVpn',
          'userType',
          'label',
          'terms',
          'tradeInstructions',
          'notes',
          'eCode',
        ];

        for (const field of extraFields) {
          if (offer[field] !== undefined) {
            createOfferPayload[field] = offer[field];
          }
        }
      } catch (error) {
        return new RpcException('Error occurred while processing accounts');
      }
    }

    const data = await new this.offerModel({ ...createOfferPayload }).save();
    return { _id: data._id };
  }
}
