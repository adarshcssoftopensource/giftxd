import {
  Controller,
  Body,
  Get,
  Param,
  Put,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { HOME_DTOS } from '@app/dto';
import {
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('/:id')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  @ApiParam({ name: 'id', required: true, description: 'ID of the settings' })
  getSettingsById(@Param('id') id: string) {
    return this.settingsService.getSettingsById(id);
  }

  @Put('/:id')
  @ResponseMessage('Settings updated')
  @UseInterceptors(ResponseInterceptor)
  updateSettings(
    @Param('id') id: string,
    @Body() updateModel: HOME_DTOS.UpdateSettingsDto,
  ) {
    return this.settingsService.updateSettings(id, updateModel);
  }

  //   @Get('/timezones')
  // @HttpCode(200)
  // @UseInterceptors(MessageResponseInterceptor)
  // @ResponseMessage('Timezones retrieved')
  // getTimezones() {
  //   return this.settingsService.getTimezones();
  // }
}
