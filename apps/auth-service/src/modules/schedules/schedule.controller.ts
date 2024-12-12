import { MessagePattern } from '@nestjs/microservices';
import { ScheduleService } from './schedule.service';
import { Controller } from '@nestjs/common';
import { SCHEDULE_DTOS } from '@app/dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @MessagePattern('schedule.create')
  createSchedule(model: SCHEDULE_DTOS.CreateScheduleDto) {
    const data = this.scheduleService.createSchedule(model);
    return data;
  }
  @MessagePattern('schedule.update')
  updateSchedule(
    model: SCHEDULE_DTOS.UpdateScheduleDto & {
      id: string;
    },
  ) {
    const data = this.scheduleService.updateSchedule(model);
    return data;
  }
  @MessagePattern('schedule.getById')
  async getByIdSchedule(id: string) {
    const data = await this.scheduleService.getBYIdSchedule(id);
    return data;
  }
  @MessagePattern('schedule.getAll')
  async getAllSchedule(query: SCHEDULE_DTOS.SchedulePagingQueryDto) {
    const data = await this.scheduleService.getAllSchedule(query);
    return data;
  }
  @MessagePattern('schedule.delete')
  async deleteSchedule(id: string) {
    const data = await this.scheduleService.deleteSchedule(id);
    return data;
  }
}
