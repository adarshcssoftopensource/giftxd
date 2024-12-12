import { MessagePattern } from '@nestjs/microservices';
import { ContactCardService } from './contact.service';
import { Controller } from '@nestjs/common';
import { HOME_DTOS } from '@app/dto';

@Controller('contactcards')
export class ContactCardController {
  constructor(private contactcardService: ContactCardService) {}

  @MessagePattern('contactcard.create')
  createContactCard(model: HOME_DTOS.ContactCreateDto) {
    const data = this.contactcardService.createContactCard(model);
    return data;
  }
  @MessagePattern('contactcard.user.get')
  getContactCards() {
    return this.contactcardService.getContactCards();
  }

  @MessagePattern('contactcard.user.getById')
  getContactCardById(id: string) {
    return this.contactcardService.getContactCardById(id);
  }

  @MessagePattern('contactcard.user.update')
  updateContactCard({
    id,
    updateModel,
  }: {
    id: string;
    updateModel: HOME_DTOS.UpdateContactDto;
  }) {
    return this.contactcardService.updateContactCard(id, updateModel);
  }

  @MessagePattern('contactcard.user.delete')
  deleteContactCard(id: string) {
    return this.contactcardService.deleteContactCard(id);
  }
}
