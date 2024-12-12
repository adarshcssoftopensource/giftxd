import { Injectable } from '@nestjs/common';
import { SCHEDULE_MODEL, USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SCHEDULE_DTOS } from '@app/dto';
import { RpcException } from '@nestjs/microservices';

const toObjectId = Types.ObjectId;
@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(SCHEDULE_MODEL.Schedule.name)
    private scheduleModel: Model<SCHEDULE_MODEL.Schedule>,
    @InjectModel(USER_MODELS.Employee.name)
    private employeeModel: Model<USER_MODELS.Employee>,
  ) {}

  async createSchedule(model: SCHEDULE_DTOS.CreateScheduleDto) {
    const schedule_payload = {
      start_time: model.start_time,
      end_time: model.end_time,
      date: model.date,
      break_time: model.break_time,
      employee: model.employee,
    };
    try {
      const employee = await this.employeeModel.findById({
        _id: new toObjectId(model.employee),
      });
      if (!employee) {
        return new RpcException('Invalid Employee ID');
      }
    } catch (error) {
      // Throw invalid Employee ID if mongoose cannot parse model.employee
      return new RpcException('Invalid Employee ID');
    }
    const schedule = await new this.scheduleModel({
      ...schedule_payload,
    }).save();

    return schedule;
  }

  async getAllSchedule(query: SCHEDULE_DTOS.SchedulePagingQueryDto) {
    let { page_number = '1', page_size = '50' } = query;
    page_number = Number(page_number);
    page_size = Number(page_size);
    const skip = (page_number - 1) * page_size;
    const schedules = await this.scheduleModel.aggregate([
      {
        $skip: skip,
      },
      {
        $limit: page_size,
      },
    ]);
    if (!schedules.length) {
      return new RpcException('schedules not found');
    }
    return schedules;
  }

  async getBYIdSchedule(id: string) {
    const [schedule] = await this.scheduleModel.aggregate([
      {
        $match: { _id: new toObjectId(id) },
      },
    ]);
    if (!schedule) {
      return new RpcException('schedule not found');
    }
    return schedule;
  }

  async updateSchedule(
    model: SCHEDULE_DTOS.UpdateScheduleDto & {
      id: string;
    },
  ) {
    const schedule = await this.scheduleModel.findOne({
      _id: new toObjectId(model.id),
    });
    if (!schedule) {
      throw new RpcException('schedule not found');
    }
    schedule.date = model?.date ? new Date(model.date) : schedule.date;
    schedule.start_time = model?.start_time || schedule.start_time;
    schedule.end_time = model?.end_time || schedule.end_time;
    if (model.employee) {
      try {
        const employee = await this.employeeModel.findById({
          _id: new toObjectId(model.employee),
        });
        if (!employee) {
          return new RpcException('Invalid Employee ID');
        }
        schedule.employee = employee;
      } catch (error) {
        // Throw invalid Employee ID if mongoose cannot parse model.employee
        return new RpcException('Invalid Employee ID');
      }
    }
    await schedule.save();
    return schedule;
  }

  async deleteSchedule(id: string) {
    const schedule = await this.scheduleModel.findByIdAndDelete(id);
    if (!schedule) {
      return new RpcException('schedule not found');
    }

    return 'schedule deleted';
  }
}
