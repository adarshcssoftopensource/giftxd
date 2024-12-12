import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LINKED_ACCOUNT_DTOS, LINKED_ACCOUNT_LIMIT_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class LinkedAccountService {
  constructor(
    @Inject('ORDER_CLIENT_SERVICE')
    private readonly offerClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createLinkedAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountCreateDto) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('linkedAccount.create', model);
  }
  getAllLinkedAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountPagingQueryDto) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send('linkedAccount.getAll', model);
  }
  getByIdLinkedAccount(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('linkedAccount.getById', { id, token });
  }
  updateLinkedAccount(
    id: string,
    model: LINKED_ACCOUNT_DTOS.linkedAccountUpdateDto,
  ) {
    model.token = this.request.headers['x-access-token'];
    const LinkedAccount_update_payload = class {
      id: string;
      website: string;
      email: string;
      password: string;
      proxies: Object;
      token: string;
      twoFA: string;
      currency: string;
      constructor(
        a_args: LINKED_ACCOUNT_DTOS.linkedAccountUpdateDto & { id: string },
      ) {
        this.id = a_args.id;
        this.password = a_args.password;
        this.email = a_args.email;
        this.website = a_args.website;
        this.proxies = a_args.proxies;
        this.token = a_args.token;
        this.twoFA = a_args.twoFA;
        this.currency = a_args.currency;
      }
    };
    return this.offerClientService.send(
      'linkedAccount.update',
      new LinkedAccount_update_payload({ id, ...model }),
    );
  }
  deleteLinkedAccount(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('linkedAccount.deleteById', {
      id,
      token,
    });
  }

  verifyAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountVerify) {
    return this.offerClientService.send('linkedAccount.verifyAccount', model);
  }

  retrieveAccountGcrs(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('linkedAccount.retrieveAccountGcrs', {
      id,
      token,
    });
  }

  getAccountsGcrs(id: string) {
    const token = this.request.headers['x-access-token'];
    return this.offerClientService.send('linkedAccount.getAccountsGcrs', {
      id,
      token,
    });
  }

  createLinkedAccountLimit(
    model: LINKED_ACCOUNT_LIMIT_DTOS.createLinkedAccountLimit,
  ) {
    model.token = this.request.headers['x-access-token'];
    return this.offerClientService.send(
      'linkedAccount.createLinkedAccountLimit',
      model,
    );
  }
}
