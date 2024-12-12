import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ATTRIBUTE_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AttributeService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly attributeService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createAttribute(model: ATTRIBUTE_DTOS.CreateAttribueDto) {
    model.token = this.request.headers['x-access-token'];
    return this.attributeService.send('attribute.create', model);
  }

  getAllAttribute(query: ATTRIBUTE_DTOS.queryatributeDto) {
    query.token = this.request.headers['x-access-token'];
    return this.attributeService.send('attribute.getAll', query);
  }

  deleteAttribute(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.attributeService.send('attribute.deleteById', {id, token});
  }
}
