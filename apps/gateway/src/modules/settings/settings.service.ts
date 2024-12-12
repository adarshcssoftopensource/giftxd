import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HOME_DTOS } from '@app/dto';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  getSettingsById(id: string) {
    return this.authClientService.send('settings.user.get', id);
  }

  updateSettings(id: string, updateModel: HOME_DTOS.UpdateSettingsDto) {
    return this.authClientService.send('settings.user.update', {
      id,
      updateModel,
    });
  }

  // getTimezones() {
  //   return this.authClientService.send('settings.timezones.list', {});
  // }
}
