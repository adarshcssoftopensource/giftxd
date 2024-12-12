import { Controller, Get } from '@nestjs/common';
import { TimezoneService } from './timezone.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('timezones')
@ApiTags('timezones-list')
export class TimezoneController {
  constructor(private readonly timezoneService: TimezoneService) {}

  @Get()
  getAllTimezones(): string[] {
    return this.timezoneService.getAllTimezones();
  }
}
