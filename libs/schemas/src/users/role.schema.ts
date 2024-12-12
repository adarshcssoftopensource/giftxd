import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum roleType {
  Client = 'CLIENT',
  Vendor = 'VENDOR',
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
  SuperVisor = 'SUPERVISOR',
  childAdmin = 'CHILD_ADMIN',
}

@Schema()
export class Role {
  @Prop({ default: false })
  can_delete: boolean;

  @Prop({ type: String, enum: roleType })
  name: roleType;

  @Prop({ type: Object })
  permissions: {};

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
