import { Module } from '@nestjs/common';
import { SuggestionCardsController } from './suggestions.controller';
import { SuggestionCardsService } from './suggestions.service';
import { AdminService } from '../admin/admin.service';
import { AuthService } from 'apps/auth-service/src/auth-service';
import { JwtAuthGuard } from '@app/common/guard/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema }
    ]),
  ],
  controllers: [SuggestionCardsController],
  providers: [SuggestionCardsService, AuthService, AdminService, JwtAuthGuard],
})
export class SuggestionsModule {}
