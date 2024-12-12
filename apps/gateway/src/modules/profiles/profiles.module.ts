import { Module } from '@nestjs/common';
import { UserProfileController } from './profiles.controller';
import { UserProfileService } from './profiles.service';

@Module({
  providers: [UserProfileService],
  controllers: [UserProfileController],
})
export class ProfilesModule {}
