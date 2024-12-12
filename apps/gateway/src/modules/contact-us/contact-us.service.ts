import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactUsMessage } from '@app/schemas/home/contact-us.schema';
import { ContactMessageDto, ContactMessageListDto, CreateContactMessageDto } from '@app/dto/home/contact-us.dto';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUsMessage.name)
    private readonly contactMessageModel: Model<ContactUsMessage>,
  ) {}

  async createMessage(createMessageDto: CreateContactMessageDto): Promise<ContactMessageDto> {
    const { id, firstname, lastname, email_address, message, topic } = await this.contactMessageModel.create(createMessageDto);
    return { id, firstname, lastname, email_address, message, topic } as ContactMessageDto;
  }

  async getContactMessages(page: number = 1, limit: number = 10, email: string = "", topic: string = ""): Promise<ContactMessageListDto[]> {
    const query = {};
    if (email !== "") {
      query['email_address'] = email;
    }
    if (topic !== "") {
      query['topic'] = topic;
    }

    let messages = await this.contactMessageModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return messages.map(({ id, topic, email_address }) => ({ id: id, topic, email_address } as ContactMessageListDto));
  }

  async getContactMessageDetails(id: string): Promise<ContactMessageDto | null> {
    const result = await this.contactMessageModel.findById(id).exec();
    if (!result)
        throw new NotFoundException('Message not found');

    const { firstname, lastname, email_address, message, topic } = result;
    return { id, firstname, lastname, email_address, message, topic } as ContactMessageDto;
  }

  async deleteContactMessage(id: string): Promise<void> {
    const deletedMessage = await this.contactMessageModel.findByIdAndDelete(id).exec();
    if (!deletedMessage) {
      throw new NotFoundException('Message not found');
    }
  }
}
