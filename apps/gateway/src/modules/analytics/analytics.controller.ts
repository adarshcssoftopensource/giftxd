import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('analytics')
@ApiTags('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('change')
  @ResponseMessage('Analytics fetching successful')
  @UseInterceptors(ResponseInterceptor)
  async getAnalyticsChange(@Query('period') periods: string[]): Promise<{}> {
    const changes = {};
    for (const value of periods) {
      const period = parseInt(value.trim());
      changes[value] = await this.analyticsService.getMonthlyChange(period);
    }
    return changes;
  }
}
