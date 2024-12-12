import { Module } from '@nestjs/common';
import { TextractController } from './textract.controller';
import { TextractService } from './textract.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HOME_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HOME_MODELS.Card.name, schema: HOME_MODELS.CardSchema },
    ]),
  ],
  providers: [TextractService],
  controllers: [TextractController],
})
export class TextractModule {}
