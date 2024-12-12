import { MessagePattern } from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import { Controller } from '@nestjs/common';
import {
  UserProfileCreateDto,
  UserProfileUpdateDto,
} from '@app/dto/users/profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @MessagePattern('profile.create')
  createProfile(model: UserProfileCreateDto) {
    const data = this.profileService.createProfile(model);
    return data;
  }

  @MessagePattern('profile.get')
  getProfiles() {
    return this.profileService.getProfiles();
  }

  @MessagePattern('profile.getById')
  getProfileById(id: string) {
    return this.profileService.getProfileById(id);
  }

  @MessagePattern('profile.update')
  updateProfile({
    id,
    updateModel,
  }: {
    id: string;
    updateModel: UserProfileUpdateDto;
  }) {
    return this.profileService.updateProfile(id, updateModel);
  }

  @MessagePattern('profile.delete')
  deleteProfile(id: string) {
    return this.profileService.deleteProfile(id);
  }
}
