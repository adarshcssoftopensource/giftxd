import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OFFER_DTOS, ORDER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class OfferService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createOffer(model: OFFER_DTOS.OfferCreateDto) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.create', model);
  }

  getAllOffer(query: OFFER_DTOS.OfferPagingQueryDto) {
    query.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.getAll', query);
  }

  getAllOrders(query: OFFER_DTOS.orderQueryDtoWithFilter) {
    query.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.getOrders', query);
  }

  getRecommdation(query: OFFER_DTOS.getRecommdationDto) {
    query.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.getRecommdation', query);
  }
  getByIdOffer(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.getById', { id, token });
  }
  updateOffer(model: OFFER_DTOS.OfferUpdateDto) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.update', model);
  }
  deleteOffer(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.deleteById', { id, token });
  }

  cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.cancelOrder', model);
  }
  getByIdOrder(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.getByIdOrder', { id, token });
  }

  duplicateOffer(model: OFFER_DTOS.duplicateOfferCreateDto) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('offer.duplicateOffer', model);
  }
}
