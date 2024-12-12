import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SettingsService } from './setting.service';
import { HOME_DTOS } from '@app/dto';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // @MessagePattern('settings.timezones.list')
  // getTimezones() {
  //   return this.settingsService.getTimezones();
  // }

  @MessagePattern('settings.user.get')
  getSettingsById(id: string) {
    return this.settingsService.getSettingsById(id);
  }

  @MessagePattern('settings.user.update')
  updateSettings({
    id,
    updateModel,
  }: {
    id: string;
    updateModel: HOME_DTOS.UpdateSettingsDto;
  }) {
    return this.settingsService.updateSettings(id, updateModel);
  }
}
