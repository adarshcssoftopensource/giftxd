import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEDULE_MODEL, USER_MODELS } from '@app/schemas';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SCHEDULE_MODEL.Schedule.name,
        schema: SCHEDULE_MODEL.ScheduleSchema,
      },
      { name: USER_MODELS.Employee.name, schema: USER_MODELS.EmployeeSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
