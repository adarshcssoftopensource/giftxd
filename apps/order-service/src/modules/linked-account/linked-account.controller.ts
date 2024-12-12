import { MessagePattern } from '@nestjs/microservices';
import { LinkedAccountService } from './linked-account.service';
import { Controller } from '@nestjs/common';
import { LINKED_ACCOUNT_DTOS, LINKED_ACCOUNT_LIMIT_DTOS } from '@app/dto';

@Controller('linkedAccount')
export class LinkedAccountController {
  constructor(private linkedAccountService: LinkedAccountService) {}

  @MessagePattern('linkedAccount.create')
  async createLinkedAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountCreateDto) {
    const LinkedAccount = await this.linkedAccountService.createLinkedAccount(
      model,
    );
    return LinkedAccount;
  }

  @MessagePattern('linkedAccount.getAll')
  async LinkedAccountgetAll(
    query: LINKED_ACCOUNT_DTOS.linkedAccountPagingQueryDto,
  ) {
    const LinkedAccount = await this.linkedAccountService.getAllLinkedAccount(
      query,
    );
    return LinkedAccount;
  }

  @MessagePattern('linkedAccount.getById')
  async getByIdLinkedAccount({ id, token }) {
    const LinkedAccount = await this.linkedAccountService.getByIdLinkedAccount(
      id,
      token,
    );
    return LinkedAccount;
  }

  @MessagePattern('linkedAccount.update')
  async updateLinkedAccount(
    model: LINKED_ACCOUNT_DTOS.linkedAccountUpdateDto & { id: string },
  ) {
    const LinkedAccount = await this.linkedAccountService.updateLinkedAccount(
      model,
    );
    return LinkedAccount;
  }

  @MessagePattern('linkedAccount.deleteById')
  async deleteLinkedAccount({ id, token }) {
    const LinkedAccount = await this.linkedAccountService.deleteLinkedAccount(
      id,
      token,
    );
    return LinkedAccount;
  }

  @MessagePattern('linkedAccount.verifyAccount')
  async verifyAccount(model: LINKED_ACCOUNT_DTOS.linkedAccountVerify) {
    const LinkedAccount = await this.linkedAccountService.verifyAccount(model);
    return LinkedAccount;
  }

  @MessagePattern('linkedAccount.retrieveAccountGcrs')
  async retrieveAccountGcrs({ id, token }) {
    const LinkedAccount = await this.linkedAccountService.retrieveAccountGcrs({
      id,
      token,
    });
    return LinkedAccount;
  }
  @MessagePattern('linkedAccount.getAccountsGcrs')
  async getAccountsGcrs({ id, token }) {
    const LinkedAccount = await this.linkedAccountService.getAccountsGcrs({
      id,
      token,
    });
    return LinkedAccount;
  }
  @MessagePattern('linkedAccount.createLinkedAccountLimit')
  async createLinkedAccountLimit(
    model: LINKED_ACCOUNT_LIMIT_DTOS.createLinkedAccountLimit,
  ) {
    const LinkedAccountLimit =
      await this.linkedAccountService.createLinkedAccountLimit(model);
    return LinkedAccountLimit;
  }
}
