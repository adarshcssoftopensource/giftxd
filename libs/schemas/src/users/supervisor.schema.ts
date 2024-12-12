import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Supervisor {
  @Prop()
  full_name: string;

  @Prop()
  avatar: string;

  @Prop()
  email: string;

  @Prop()
  employment_type: string;

  @Prop([String])
  assign_to: string[];

  @Prop()
  address: string;

  @Prop()
  phone_number: number;

  @Prop()
  password: string;

  @Prop({ default: 0 })
  orders_completed: number;

  @Prop()
  two_factor_auth: boolean;

  @Prop()
  can_accept_orders: boolean;

  @Prop()
  can_void_orders: boolean;

  @Prop()
  can_change_employee_schedule: boolean;

  @Prop({ default: Date.now() })
  onboarded_date: Date;

  @Prop({ default: Date.now() })
  created_date: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const SupervisorSchema = SchemaFactory.createForClass(Supervisor);
