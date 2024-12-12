import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { ActivityLogService } from './activitylog.service';
import { Activity } from '@app/schemas/activities';
import { ResponseInterceptor, ResponseMessage } from '@app/common';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ResponseMessage('Activity log fetching successful')
  @UseInterceptors(ResponseInterceptor)
  getActivityLogs() {
    return this.activityLogService.getActivityLogs();
  }

  @Post()
  @ResponseMessage('Activity logging successful')
  @UseInterceptors(ResponseInterceptor)
  logActivity(@Body() activityLog: Activity) {
    activityLog.dateCreated = new Date();
    this.activityLogService.logActivity(activityLog);
  }
}
