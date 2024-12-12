import { Module } from '@nestjs/common';
import { SuggestionCardController } from './suggestion.controller';
import { SuggestionCardService } from './suggestion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: HOME_MODELS.SuggestionCard.name,
        schema: HOME_MODELS.SuggestionCardSchema,
      },
      {
        name: USER_MODELS.User.name,
        schema: USER_MODELS.UserSchema,
      },
    ]),
  ],
  controllers: [SuggestionCardController],
  providers: [SuggestionCardService],
})
export class SuggestionModule {}
