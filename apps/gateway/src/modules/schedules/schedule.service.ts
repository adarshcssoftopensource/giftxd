import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SCHEDULE_DTOS } from '@app/dto';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly scheduleService: ClientProxy,
  ) {}

  createSchedule(model: SCHEDULE_DTOS.CreateScheduleDto) {
    return this.scheduleService.send('schedule.create', model);
  }

  getAllSchedule(query: SCHEDULE_DTOS.SchedulePagingQueryDto) {
    return this.scheduleService.send('schedule.getAll', query);
  }

  updateSchedule<T>(id: string, model: SCHEDULE_DTOS.UpdateScheduleDto) {
    const Schedule_update_payload = class {
      id: string;
      date: Date;
      start_time: string;
      end_time: string;
      break_time: string;
      employee: string;
      constructor(s_args: SCHEDULE_DTOS.UpdateScheduleDto & { id: string }) {
        this.id = s_args.id;
        this.date = s_args.date;
        this.start_time = s_args.start_time;
        this.end_time = s_args.end_time;
        this.break_time = s_args.break_time;
        this.employee = s_args.employee;
      }
    };
    return this.scheduleService.send(
      'schedule.update',
      new Schedule_update_payload({ id, ...model }),
    );
  }
  getByIdSchedule(id: string) {
    return this.scheduleService.send('schedule.getById', id);
  }

  deleteSchedule(id: string) {
    return this.scheduleService.send('schedule.delete', id);
  }
}
