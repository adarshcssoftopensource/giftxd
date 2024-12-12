import { Module } from '@nestjs/common';
import { ContactCardController } from './contact.controller';
import { ContactCardService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HOME_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HOME_MODELS.ContactCard.name,
        schema: HOME_MODELS.ContactCardSchema,
      },
    ]),
  ],
  controllers: [ContactCardController],
  providers: [ContactCardService],
})
export class ContactModule {}
