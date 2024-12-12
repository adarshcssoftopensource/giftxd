import { MessagePattern } from '@nestjs/microservices';
import { ClientService } from './client.service';
import { Controller } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @MessagePattern('client.create')
  createClient(model: USER_DTOS.ClientCreateDto) {
    const data = this.clientService.createClient(model);
    return data;
  }
  @MessagePattern('client.getAll')
  async getAllClient(query: USER_DTOS.ClientPagingQueryDto) {
    const data = await this.clientService.getAllClient(query);
    return data;
  }

  @MessagePattern('client.updateById')
  async updateClient(data: {
    id: string;
    updateDto: USER_DTOS.ClientUpdateDto;
  }) {
    const { id, updateDto } = data;

    return await this.clientService.updateClient(id, updateDto);
  }

  @MessagePattern('client.getById')
  async getBYIdClient(id: string) {
    const data = await this.clientService.getBYIdClient(id);
    return data;
  }
  @MessagePattern('client.deleteById')
  async deleteclient(id: string) {
    const data = await this.clientService.deleteClient(id);
    return data;
  }

  @MessagePattern('client.search')
  async searchClient(searchValue: USER_DTOS.ClientSearchQuery) {
    const data = await this.clientService.searchClient(searchValue);
    return data;
  }

  @MessagePattern('client.enable2FA')
  async enable2FA(id: string) {
    return await this.clientService.enable2FA(id);
  }

  @MessagePattern('client.disable2FA')
  async disable2FA(payload) {
    return await this.clientService.disable2FA(payload);
  }

  @MessagePattern('client.verify2FA')
  async verify2FA(payload) {
    return await this.clientService.verify2FA(payload);
  }

  @MessagePattern('client.verifyIdDocument')
  async verifyIdDocument(payload: { token: string }) {
    return await this.clientService.verifyIdDocument(payload);
  }

  @MessagePattern('client.send-verif-email')
  sendVerificationEmail(payload: { token: string }) {
    return this.clientService.sendOtpEmail(payload);
  }
  @MessagePattern('client.verifyResidency')
  async verifyResidency(payload: { token: string }) {
    return await this.clientService.verifyResidency(payload);
  }

  @MessagePattern('client.updateKycStatus')
  async updateKycStatus(webhook_payload: USER_DTOS.ClientKycStatusUpdateDto) {
    return await this.clientService.updateClientKyc(webhook_payload);
  }

  @MessagePattern('client.getAllVerificationStatus')
  async getAllVerificationStatus(payload: { token: string }) {
    return await this.clientService.getAllVerificationStatus(payload);
  }
}
