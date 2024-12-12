import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employee } from '../users/employee.schema';

@Schema()
export class Schedule {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Employee.name,
  })
  employee: Employee;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: String })
  start_time: String;

  @Prop({ type: String })
  end_time: String;

  @Prop({ type: String })
  break_time: String;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
