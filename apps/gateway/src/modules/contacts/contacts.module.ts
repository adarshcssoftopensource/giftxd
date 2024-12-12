import { Module } from '@nestjs/common';
import { ContactCardsService } from './contacts.service';
import { ContactCardsController } from './contacts.controller';

@Module({
  providers: [ContactCardsService],
  controllers: [ContactCardsController],
})
export class ContactsModule {}
