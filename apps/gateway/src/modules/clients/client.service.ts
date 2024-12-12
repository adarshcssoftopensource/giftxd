import { ClientProxy } from '@nestjs/microservices';
import { Injectable, Inject } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';
@Injectable()
export class ClientService {

  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) { }

  createClient(model: USER_DTOS.ClientCreateDto) {
    return this.authClientService.send('client.create', model);
  }
  getAllClient(query: USER_DTOS.ClientPagingQueryDto) {
    return this.authClientService.send('client.getAll', query);
  }

  updateClient(id: string, updateDto: USER_DTOS.ClientUpdateDto) {
    return this.authClientService.send('client.updateById', { id, updateDto });
  }

  getByIdClient(id: string) {
    return this.authClientService.send('client.getById', id);
  }

  deleteClient(id: string) {
    return this.authClientService.send('client.deleteById', id);
  }
  searchClient(searchValue: USER_DTOS.ClientSearchQuery) {
    return this.authClientService.send('client.search', searchValue);
  }
  verifyIdDocument() {
    this.request.headers['x-access-token']
    return this.authClientService.send(
      'client.verifyIdDocument', 
      {
        "token": this.request.headers['x-access-token']
      }
    );
  }
  
  getAllVerificationStatus() {
    return this.authClientService.send(
      'client.getAllVerificationStatus', 
      {
        "token": this.request.headers['x-access-token']
      }
    );
  }

  sendEmailVerification(){
    return this.authClientService.send(
      'client.send-verif-email', 
      {
        "token": this.request.headers['x-access-token']
      }
    );
  }

  verifyResidency() {
    this.request.headers['x-access-token']
    return this.authClientService.send(
      'client.verifyResidency', 
      {
        "token": this.request.headers['x-access-token']
      }
    );
  }

  updateKycStatus(webhook_payload: USER_DTOS.ClientKycStatusUpdateDto) {
    return this.authClientService.send(
      'client.updateKycStatus',
      webhook_payload,
    );
  }
}
