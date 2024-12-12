import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema()
export class Permission {
  @Prop({ default: 'employee', enum: ['employee', 'supervisor'] })
  role: string;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  new_post: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  notification: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  download_vault_content: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  queue: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  collection: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  statements: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  statistics: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  profile: Record<string, any>;

  @Prop(
    raw({
      is_selected: Boolean,
      access: {
        type: String,
        enum: ['allow', 'deny', 'granted'],
      },
    }),
  )
  settings: Record<string, any>;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
