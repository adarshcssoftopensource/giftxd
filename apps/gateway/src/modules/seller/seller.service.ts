import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { OFFER_DTOS, ORDER_DTOS, SELLER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class SellerService {
  constructor(
    @Inject('SELLER_CLIENT_SERVICE')
    private readonly sellerService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createSeller(model: SELLER_DTOS.CreateOfferDto) {
    model.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.create', model);
  }

  getRecommdation(query: OFFER_DTOS.OfferPagingQueryDto, id) {
    query.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.recommdation', { ...query, id });
  }

  getAllOffer(query: OFFER_DTOS.OfferSellerPagingQueryDto) {
    query.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.getAll', query);
  }

  getOrders(query: OFFER_DTOS.orderQueryDtoWithFilter) {
    query.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.getAllOrders', query);
  }

  cancelOrder(model: ORDER_DTOS.OrderCancelDto) {
    model.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.cancelOrder', model);
  }

  getByIdOffer(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.getById', { id, token });
  }
  updateOffer(model: SELLER_DTOS.UpdateOfferDto) {
    model.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.update', model);
  }
  deleteOffer(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.deleteById', { id, token });
  }

  uploadCard(files: any, model: any) {
    model.token = this.request.headers['x-access-token'];
    return this.sellerService.send('gift_card.uploads', {
      ...files,
      ...model,
    });
  }

  getUserCards(query: ORDER_DTOS.GetUserCardDto) {
    query.token = this.request.headers['x-access-token'];
    return this.sellerService.send('gift_card.getByOffer', { ...query });
  }

  getByIdOrder(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.getByIdOrder', { id, token });
  }

  sellerGetReview(query: OFFER_DTOS.sellerGetReview) {
    query.token = this.request.headers['x-access-token'];
    return this.sellerService.send('seller.sellerGetReview', { ...query });
  }
}
