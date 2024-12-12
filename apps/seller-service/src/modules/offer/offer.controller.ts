import { MessagePattern } from '@nestjs/microservices';
import { OfferService } from './offer.service';
import { Controller, Param } from '@nestjs/common';
import { OFFER_DTOS, ORDER_DTOS, SELLER_DTOS } from '@app/dto';

@Controller('seller')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @MessagePattern('seller.create')
  async createoffer(model: SELLER_DTOS.CreateOfferDto) {
    return this.offerService.createOffer(model);
  }

  @MessagePattern('seller.recommdation')
  async getRecommdation(
    query: OFFER_DTOS.OfferPagingQueryDto & { id: string },
  ) {
    const offer = await this.offerService.getRecommdation(query);
    return offer;
  }

  @MessagePattern('seller.getAll')
  async offergetAll(query: OFFER_DTOS.OfferSellerPagingQueryDto) {
    const offer = await this.offerService.getAllOffer(query);
    return offer;
  }

  @MessagePattern('seller.getAllOrders')
  async getAllOrders(query: OFFER_DTOS.orderQueryDtoWithFilter) {
    const orders = await this.offerService.getSellerOrders(query);
    return orders;
  }

  @MessagePattern('seller.cancelOrder')
  async cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    const orders = await this.offerService.cancelOrder(model);
    return orders;
  }

  @MessagePattern('seller.getById')
  async getByIdOffer({ id, token }) {
    const offer = await this.offerService.getByIdOffer(id, token);
    return offer;
  }

  @MessagePattern('seller.update')
  async updateOffer(model: SELLER_DTOS.UpdateOfferDto) {
    const offer = await this.offerService.updateOffer(model);
    return offer;
  }

  @MessagePattern('seller.deleteById')
  async deleteOffer({ id, token }) {
    const offer = await this.offerService.deleteOffer(id, token);
    return offer;
  }
  @MessagePattern('seller.getByIdOrder')
  async getByIdOrder({ id, token }) {
    const order = await this.offerService.getByIdOrder(id, token);
    return order;
  }

  @MessagePattern('seller.sellerGetReview')
  async sellerGetReview(query: OFFER_DTOS.sellerGetReview) {
    const orders = await this.offerService.sellerGetReview(query);
    return orders;
  }
}
