import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
class SecurityQuestions {
  @Prop()
  question: string;
  @Prop({ default: Date.now() })
  updatedAt: Date;
  @Prop({ default: Date.now() })
  createdAt: Date;
}

const SecurityQuestionsSchema = SchemaFactory.createForClass(SecurityQuestions);

export { SecurityQuestionsSchema, SecurityQuestions };
