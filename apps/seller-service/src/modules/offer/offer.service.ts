import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OFFER_DTOS, ORDER_DTOS, SELLER_DTOS } from '@app/dto';
import {
  ATTRIBUTE_MODEL,
  LINKED_ACCOUNT_MODEL,
  OFFER_MODELS,
  ORDER_HISTORY_MODELS,
  ORDER_MODELS,
  ORDER_TRANSACTION_MODEL,
  PROVIDER_MODEL,
  SELLER_MODEL,
  USER_MODELS,
} from '@app/schemas';
import { Model, Types } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
import { OrderType, StatusType } from '@app/schemas/orders';
import { BuyerOfferStatus } from '@app/schemas/offer/offer.schema';
import { SellerOfferStatus } from '@app/schemas/seller/sellerOffer.schema';
import { getBitcoinPrice } from 'apps/order-service/helper/btc-price';
import { CryptoService } from 'apps/gateway/src/modules/cryptos/cryptos.service';
import { StatusTypeOffer, sortTypeOrder } from '@app/dto/offers';

const toObjectId = Types.ObjectId;
@Injectable()
export class OfferService {
  constructor(
    @InjectModel(SELLER_MODEL.SellerOffer.name)
    private sellerModel: Model<SELLER_MODEL.SellerOffer>,
    @InjectModel(ORDER_MODELS.Order.name)
    private orderModel: Model<ORDER_MODELS.Order>,
    @InjectModel(OFFER_MODELS.Offer.name)
    private offerModel: Model<OFFER_MODELS.Offer>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Client.name)
    private clientModel: Model<USER_MODELS.Client>,
    @InjectModel(ATTRIBUTE_MODEL.Attribute.name)
    private attributeModel: Model<ATTRIBUTE_MODEL.Attribute>,
    @InjectModel(PROVIDER_MODEL.Provider.name)
    private providerModel: Model<PROVIDER_MODEL.Provider>,
    @InjectModel(ORDER_TRANSACTION_MODEL.OrderTransaction.name)
    private OrderTransactionModel: Model<ORDER_TRANSACTION_MODEL.OrderTransaction>,
    @InjectModel(ORDER_HISTORY_MODELS.OrderHistory.name)
    private orderHistoryModel: Model<ORDER_HISTORY_MODELS.OrderHistory>,
    @InjectModel(LINKED_ACCOUNT_MODEL.LinkedAccount.name)
    private linkedAccountModel: Model<LINKED_ACCOUNT_MODEL.LinkedAccount>,
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    private cryptoService: CryptoService,
    private jwt: JwtService,
  ) {}

  async createOffer(model: SELLER_DTOS.CreateOfferDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const client = await this.clientModel.findOne({ user: user._id });
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
      return new RpcException('Provider not found');
    }
    model.paymentMethod = provider._id.toString();
    if (!client.isUnlimited) {
      const remainingLimit = client.limit - client.consumption;
      {
        if (remainingLimit < model.amount) {
          return new RpcException('User have no limit');
        }
        client.consumption = client.consumption + model.amount;
        client.save();
      }
    }
    try {
      const newOffer = await new this.sellerModel({
        ...model,
        createdBy: user._id,
      }).save();
      return { offerId: newOffer._id };
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

  async getRecommdation(
    query: OFFER_DTOS.OfferPagingQueryDto & { id: string },
  ) {
    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }

    const sellerOffer = await this.sellerModel.findById(query.id).lean();
    if (!sellerOffer || sellerOffer.createdBy !== decode._id) {
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
    const sellerAttributes = sellerOffer.attributes;
    const sellerCurrency = sellerOffer.currency;

    let highestOffer = null;
    const recommendedOffers = [];
    let offerId = null;
    const buyerOffers = await this.offerModel
      .find({
        $and: [
          { currency: sellerCurrency },
          { minPrice: { $lte: sellerOffer.amount } },
          { maxPrice: { $gte: sellerOffer.amount } },
        ],
      })
      .lean();

    buyerOffers.forEach((offers) => {
      const buyerAttributes = offers.attributes;
      const matchingAttributes = sellerAttributes.filter((attr) =>
        buyerAttributes.includes(attr),
      );
      const missingAttributes = buyerAttributes.filter(
        (attr) => !sellerAttributes.includes(attr),
      );

      if (
        sellerCurrency === offers.currency &&
        missingAttributes.length === 0
      ) {
        if (
          !highestOffer ||
          offers.offerDiscount < highestOffer.discount_rate
        ) {
          offerId = offers._id;
          highestOffer = {
            matchingAttributes: buyerAttributes,
            discount_rate: offers.offerDiscount,
          };
        }
      } else {
        recommendedOffers.push({
          matchingAttributes,
          missingAttributes,
          discount_rate: offers.offerDiscount,
          offerId,
        });
      }
    });

    recommendedOffers.sort((a, b) => a.discount_rate - b.discount_rate);

    return {
      sellerAttributes: sellerAttributes,
      highestOffer: highestOffer,
      recommendedOffers: recommendedOffers,
    };
  }

  async getAllOffer(query: OFFER_DTOS.OfferSellerPagingQueryDto) {
    let { page_number = '1', page_size = '10' } = query;
    page_number = Number(page_number);
    page_size = Number(page_size);

    const skip = (page_number - 1) * page_size;

    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');

    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }

    try {
      const queryBuilder = this.sellerModel
        .find({ createdBy: new toObjectId(user._id) })
        .select({ exchangeRateInBTC: 0, giftCardAmountInBTC: 0, btcPrice: 0 })
        .skip(skip)
        .sort({ created_at: -1 })
        .limit(page_size)
        .populate('attributes', { name: 1, parent: 1 });

      if (query.status) {
        queryBuilder.where({ status: query.status });
      }
      const offers = await queryBuilder.exec();
      return offers;
    } catch (error) {
      throw new Error('Failed to retrieve offers.');
    }
  }

  async cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const order = await this.orderModel.findById({ _id: model.id });

    if (!order || order.client.toString() !== user.id.toString()) {
      return new RpcException('order not found');
    }
    if (!order || order.orderType !== OrderType.OpenOrders) {
      return new RpcException('Invalid Order ID');
    }
    const sellerOffer = await this.sellerModel.findById(order.sellerOffer);
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
    }
    const linkedAccountToUpdate = await this.linkedAccountModel.findById(
      new toObjectId(order.linkedAccount),
    );
    linkedAccountToUpdate.consumption -= order.orderAmount;
    linkedAccountToUpdate.save();
    await order.save();
    const orderTransaction = {
      order: order._id,
      amount: order.orderAmount,
      transactionStatus: order.orderTransactionStatus,
    };
    await new this.OrderTransactionModel({ ...orderTransaction }).save();
    const orderHistory = {
      order: order._id,
      status: order.status,
    };
    await new this.orderHistoryModel({ ...orderHistory }).save();
    return 'Attempt to cancel';
  }

  async getSellerOrders(query: OFFER_DTOS.orderQueryDtoWithFilter) {
    let { page_number = '1', page_size = '10' } = query;
    page_number = Number(page_number);
    page_size = Number(page_size);

    const skip = (page_number - 1) * page_size;

    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    try {
      let filter: Record<string, any> = {};
      if (!query.status) {
        filter.status = {
          $in: [StatusTypeOffer.cancelled, StatusTypeOffer.redeemed],
        };
      }
      if (query.status) {
        filter.status = query.status;
      }
      filter.client = user._id;
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
              userCardsInfo: '$userCardsInfo',
              _id: 1,
              orderNumber: 1,
              providerName: '$providerInfo.name',
              sellerUsername: '$sellerInfo.username',
              buyerUsername: '$buyerInfo.username',
              orderAmount: 1,
              OrderType: 1,
              checkoutAmount: 1,
              orderTransactionStatus: 1,
              sellerOffer: 1,
              status: 1,
              giftCardAmountInBTC: 1,
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
    if (user?.role?.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const offer = await this.sellerModel
      .findById({
        _id: new toObjectId(id),
      })
      .select({ exchangeRateInBTC: 0, giftCardAmountInBTC: 0, btcPrice: 0 })
      .populate('attributes', { name: 1, parent: 1 });
    if (!offer || offer.createdBy.toString() !== user.id.toString()) {
      return new RpcException('Offer not found');
    }
    return offer;
  }

  async updateOffer(model: SELLER_DTOS.UpdateOfferDto) {
    try {
      const decode: any = this.jwt.decode(model.token);
      const user = await this.userModel.findById(decode._id).populate('role');
      if (user?.role?.name !== roleType.Client) {
        return new RpcException('Invalid user');
      }
      if (user.email_verified !== true) {
        return new RpcException('User is not verified.');
      }
      const offer = await this.sellerModel.findById(model.id).lean();
      if (!offer || offer.createdBy.toString() !== user.id.toString()) {
        return new RpcException('Offer not found');
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
      if (model.amount) {
        offer.amount = model.amount;
      }
      if (model.eCodeValue) {
        offer.eCodeValue = model.eCodeValue;
      }
      if (model.eCode !== undefined) {
        offer.eCode = model.eCode;
      }
      if (model.attributes && model.attributes.length > 0) {
        try {
          const attributes: ATTRIBUTE_MODEL.Attribute[] = [];

          for (const attributeId of model.attributes) {
            const attribute = await this.attributeModel.findById({
              _id: new toObjectId(attributeId),
            });

            if (attribute) {
              attributes.push(attribute);
            } else {
              return new RpcException('Invalid Attribute ID');
            }
          }
          offer.attributes = attributes;
        } catch (error) {
          return new RpcException('Error while fetching attributes');
        }
      }
      delete offer._id;
      await this.sellerModel.updateOne(
        { _id: new toObjectId(model.id) },
        { ...offer },
      );
      if (model?.offerId) {
        this.offerClientService.send('offer.update', {
          id: model.offerId,
          status: 'MATCHED',
        });
      }
      return offer;
    } catch (err) {
      console.log(err);
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

  async deleteOffer(id: string, token: string) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const offer = await this.sellerModel.findById(id);
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
    if (!offer || offer.createdBy.toString() !== user.id.toString()) {
      return new RpcException('Offer not found');
    }
    try {
      const offer = await this.sellerModel.findByIdAndDelete(id);
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
    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    const order = await this.orderModel.findById(id);
    if (!order) {
      return new RpcException('Order not Found');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }

    if (!order || order.client.toString() !== user.id.toString()) {
      return new RpcException('Order not found');
    }

    try {
      const order = await this.orderModel
        .aggregate([
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
              userCardsInfo: '$userCardsInfo',
              _id: 0,
              sellerUsername: '$sellerInfo.username',
              buyerUsername: '$buyerInfo.username',
              orderNumber: 1,
              orderAmount: 1,
              orderTransactionStatus: 1,
              sellerOffer: 1,
              status: 1,
              giftCardAmountInBTC: 1,
              createdAt: 1,
              updatedAt: 1,
              currency: 1,
              transactionHistory: {
                status: 1,
                transactionStatus: 1,
                amount: 1,
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
        ])
        .exec();

      return order;
    } catch (error) {
      throw new Error('Failed to retrieve order.');
    }
  }

  async sellerGetReview(query: OFFER_DTOS.sellerGetReview) {
    const decode: any = this.jwt.decode(query.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user.role.name !== roleType.Client) {
      return new RpcException('Invalid user');
    }
    if (user.email_verified !== true) {
      return new RpcException('User is not verified.');
    }
    const sellerOffer = await this.sellerModel.findById(query.sellerOfferId);
    if (!sellerOffer) {
      return new RpcException('offer not found');
    }
    const buyerOffer = await this.offerModel.findById(query.buyerOfferId);
    if (!buyerOffer) {
      return new RpcException('offer not found');
    }
    const price = await this.cryptoService.getLatestCryptoPrice('BTC');
    const btcPrice = (await getBitcoinPrice()) || price;
    const amount = (sellerOffer.amount * buyerOffer.offerDiscount) / 100;
    const data = {
      offerRate: buyerOffer.offerDiscount,
      giftCardAmount: sellerOffer.amount,
      finalAmount: amount,
      finalAmountBTC: amount / btcPrice,
    };

    return data;
  }
}
