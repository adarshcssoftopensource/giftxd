import { Injectable } from '@nestjs/common';
import { HOME_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HOME_DTOS } from '@app/dto';
import { Client, RpcException } from '@nestjs/microservices';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/client';

const toObjectId = Types.ObjectId;
@Injectable()
export class ContactCardService {
  constructor(
    @InjectModel(HOME_MODELS.ContactCard.name)
    private contactCardModel: Model<HOME_MODELS.ContactCard>,
  ) {}

  async createContactCard(model: HOME_DTOS.ContactCreateDto) {
    const contactcard_payload = {
      email_support: model.email_support,
      phone_support: model.phone_support,
    };
    const contactcard = await new this.contactCardModel({
      ...contactcard_payload,
    }).save();

    return contactcard;
  }

  async getContactCards() {
    try {
      const contactcards = await this.contactCardModel.find();
      return contactcards;
    } catch (error) {
      throw new RpcException('Error getting contact');
    }
  }

  async updateContactCard(
    id: string,
    updateModel: HOME_DTOS.UpdateContactDto,
  ): Promise<HOME_MODELS.ContactCard> {
    let contactCard = await this.contactCardModel.findById(id);
    if (!contactCard) {
      throw new RpcException('Contact Card not found');
    }

    if (updateModel.email_support !== undefined) {
      contactCard.email_support = updateModel.email_support;
    }
    if (updateModel.phone_support !== undefined) {
      contactCard.phone_support = Number(updateModel.phone_support);
    }

    await contactCard.save();
    return contactCard;
  }

  async deleteContactCard(id: string): Promise<{ message: string }> {
    const result = await this.contactCardModel.findByIdAndRemove(id);
    if (!result) {
      throw new RpcException('Contact Card not found');
    }
    return { message: 'Contact Card deleted successfully' };
  }

  async getContactCardById(id: string): Promise<HOME_MODELS.ContactCard> {
    const contactCard = await this.contactCardModel.findById(id);
    if (!contactCard) {
      throw new RpcException('Contact Card not found');
    }
    return contactCard;
  }
}
