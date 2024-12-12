import { SecurityQuestionController } from './securityQuestion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityQuestionService } from './securityQuestion.service';
import {
  SECURITY_QUESTION_ANSWER_MODELS,
  SECURITY_QUESTION_MODELS,
  USER_MODELS,
} from '@app/schemas';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
      {
        name: SECURITY_QUESTION_MODELS.SecurityQuestions.name,
        schema: SECURITY_QUESTION_MODELS.SecurityQuestionsSchema,
      },
      {
        name: SECURITY_QUESTION_ANSWER_MODELS.SecurityQuestionsAnswer.name,
        schema: SECURITY_QUESTION_ANSWER_MODELS.SecurityQuestionsAnswerSchema,
      },
      { name: USER_MODELS.User.name, schema: USER_MODELS.UserSchema },
      { name: USER_MODELS.Role.name, schema: USER_MODELS.RoleSchema },
    ]),
  ],
  controllers: [SecurityQuestionController],
  providers: [SecurityQuestionService],
})
export class SecurityQuestionModule {}
