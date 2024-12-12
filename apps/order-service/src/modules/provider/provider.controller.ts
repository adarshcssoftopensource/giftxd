import { MessagePattern } from '@nestjs/microservices';
import { ProviderService } from './provider.service';
import { Controller } from '@nestjs/common';
import { PROVIDER_DTOS } from '@app/dto';

@Controller('provider')
export class ProviderController {
  constructor(private providerService: ProviderService) {}
  @MessagePattern('provider.create')
  async createProvider(model: PROVIDER_DTOS.CreateProviderDto) {
    const data = await this.providerService.createProvider(model);
    return data;
  }
  @MessagePattern('provider.getAll')
  async providergetAll(token: string) {
    const data = await this.providerService.getAllProvider(token);
    return data;
  }
  @MessagePattern('provider.getByName')
  async getByNameProvider({ providerName, token }) {
    const provider = await this.providerService.getByNameProvider(
      providerName,
      token,
    );
    return provider;
  }

  @MessagePattern('provider.update')
  async updateProvider(model: PROVIDER_DTOS.UpdateProviderDto) {
    const provider = await this.providerService.updateprovider(model);
    return provider;
  }
  @MessagePattern('provider.deleteByName')
  async deleteProvider({ name, token }) {
    const provider = await this.providerService.deleteProvider(name, token);
    return provider;
  }
  @MessagePattern('provider.providerDetails')
  async providerDetails(token) {
    const AccountInfo = await this.providerService.providerDetails(token);
    return AccountInfo;
  }
}
