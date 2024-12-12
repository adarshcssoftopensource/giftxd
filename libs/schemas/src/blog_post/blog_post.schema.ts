import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum BlogCategory {
  All = 'All',
  Fundamentals = 'Fundamentals',
  UseCases = 'Use Cases',
  RecentTrends = 'Recent Trends',
}

@Schema()
export class BlogPost {
  _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  read_time: number;

  @Prop({ default: '' })
  image_url: string;

  @Prop({ default: Date.now() })
  created_at: Date;

  @Prop({ default: Date.now() })
  updated_at: Date;

  @Prop({
    type: String,
    enum: BlogCategory,
    default: BlogCategory.Fundamentals,
  })
  category: BlogCategory;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
