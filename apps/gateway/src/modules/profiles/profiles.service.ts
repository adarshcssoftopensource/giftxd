import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  UserProfileCreateDto,
  UserProfileUpdateDto,
} from '@app/dto/users/profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  createProfile(dto: UserProfileCreateDto) {
    return this.authClientService.send('profile.create', dto);
  }

  getProfiles() {
    return this.authClientService.send('profile.get', {});
  }

  getProfileById(id: string) {
    return this.authClientService.send('profile.getById', id);
  }

  updateProfile(id: string, updateModel: UserProfileUpdateDto) {
    return this.authClientService.send('profile.update', { id, updateModel });
  }

  deleteProfile(id: string) {
    return this.authClientService.send('profile.delete', id);
  }
}
