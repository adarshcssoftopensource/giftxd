import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { ContactUsMessage, ContactUsMessageSchema } from '@app/schemas/home/contact-us.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactUsMessage.name, schema: ContactUsMessageSchema },
    ]),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule { }
