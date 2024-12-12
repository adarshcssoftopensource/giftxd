import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODELS } from '@app/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODELS.UserProfile.name,
        schema: USER_MODELS.UserProfileSchema,
      },
    ]),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
