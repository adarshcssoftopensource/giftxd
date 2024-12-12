import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../users';

@Schema()
class SecurityQuestionsAnswer {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  answerBy: User;

  @Prop()
  questionsAndAnswer: object[];

  @Prop()
  decryptedKey: mongoose.Schema.Types.Mixed;

  @Prop({ default: Date.now() })
  updatedAt: Date;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

const SecurityQuestionsAnswerSchema = SchemaFactory.createForClass(
  SecurityQuestionsAnswer,
);

export { SecurityQuestionsAnswerSchema, SecurityQuestionsAnswer };
