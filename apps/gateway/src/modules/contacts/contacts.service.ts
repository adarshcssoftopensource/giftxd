import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HOME_DTOS } from '@app/dto';

@Injectable()
export class ContactCardsService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  createContactCard(model: HOME_DTOS.ContactCreateDto) {
    return this.authClientService.send('contactcard.create', model);
  }

  getContactCards() {
    return this.authClientService.send('contactcard.user.get', {});
  }

  getContactCardById(id: string) {
    return this.authClientService.send('contactcard.user.getById', id);
  }

  updateContactCard(id: string, updateModel: HOME_DTOS.UpdateContactDto) {
    return this.authClientService.send('contactcard.user.update', {
      id,
      updateModel,
    });
  }

  deleteContactCard(id: string) {
    return this.authClientService.send('contactcard.user.delete', id);
  }
}
