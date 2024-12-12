import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PROVIDER_DTOS } from '@app/dto';
import { PROVIDER_MODEL } from '@app/schemas';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class ProviderService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly providerService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createProvider(model: PROVIDER_DTOS.CreateProviderDto) {
    model.token = this.request.headers['x-access-token'];
    return this.providerService.send('provider.create', model);
  }

  getAllProvider() {
    const token = this.request.headers['x-access-token'];
    return this.providerService.send('provider.getAll', token);
  }

  updateByNameProvider(model: PROVIDER_DTOS.UpdateProviderDto) {
    model.token = this.request.headers['x-access-token'];
    return this.providerService.send('provider.update', model);
  }
  getByNameProvider(providerName: string) {
    const token = this.request.headers['x-access-token'];
    return this.providerService.send('provider.getByName', {
      providerName,
      token,
    });
  }

  deleteByNameProvider(name: string) {
    const token = this.request.headers['x-access-token'];
    return this.providerService.send('provider.deleteByName', { name, token });
  }

  providerDetails() {
    const token = this.request.headers['x-access-token'];
    return this.providerService.send('provider.providerDetails', token);
  }
}
