import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Injectable()
export class AffiliatesService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  createAffiliate(model: USER_DTOS.CreateAffiliateDto) {
    return this.authClientService.send('affiliate.create', model);
  }
  getAllAffiliate(query: USER_DTOS.AffiliatePagingQueryDto) {
    return this.authClientService.send('affiliate.getAll', query);
  }
  getByIdAffiliate(id: string) {
    return this.authClientService.send('affiliate.getById', id);
  }
  updateAffiliate<T>(id: T, model: USER_DTOS.UpdateAffiliateDto) {
    return this.authClientService.send('affiliate.upadte', id);
  }
  deleteAffiliate(id: string) {
    return this.authClientService.send('affiliate.deleteById', id);
  }
}
