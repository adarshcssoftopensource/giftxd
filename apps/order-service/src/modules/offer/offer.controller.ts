import { MessagePattern } from '@nestjs/microservices';
import { OfferService } from './offer.service';
import { Controller } from '@nestjs/common';
import { OFFER_DTOS, ORDER_DTOS } from '@app/dto';

@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @MessagePattern('offer.create')
  async createoffer(model: OFFER_DTOS.OfferCreateDto) {
    const offer = await this.offerService.createOffer(model);
    return offer;
  }

  @MessagePattern('offer.getAll')
  async offergetAll(query: OFFER_DTOS.OfferPagingQueryDto) {
    const offer = await this.offerService.getAllOffer(query);
    return offer;
  }

  @MessagePattern('offer.getOrders')
  async ordergetAll(query: OFFER_DTOS.orderQueryDtoWithFilter) {
    const orders = await this.offerService.getBuyerOrders(query);
    return orders;
  }

  @MessagePattern('offer.getById')
  async getByIdOffer({ id, token }) {
    const offer = await this.offerService.getByIdOffer(id, token);
    return offer;
  }

  @MessagePattern('offer.update')
  async updateOffer(model: OFFER_DTOS.OfferUpdateDto) {
    const offer = await this.offerService.updateOffer(model);
    return offer;
  }

  @MessagePattern('offer.deleteById')
  async deleteOffer({ id, token }) {
    const offer = await this.offerService.deleteOffer(id, token);
    return offer;
  }

  @MessagePattern('offer.getRecommdation')
  async getRecommdation(query: OFFER_DTOS.getRecommdationDto) {
    const data = await this.offerService.getRecommdation(query);
    return data;
  }

  @MessagePattern('offer.cancelOrder')
  async cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    const orders = await this.offerService.cancelOrder(model);
    return orders;
  }

  @MessagePattern('offer.getByIdOrder')
  async getByIdOrder({ id, token }) {
    const order = await this.offerService.getByIdOrder(id, token);
    return order;
  }
  @MessagePattern('offer.duplicateOffer')
  async duplicateOffer(model: OFFER_DTOS.duplicateOfferCreateDto) {
    const offer = await this.offerService.duplicateOffer(model);
    return offer;
  }
}
