import { Module } from '@nestjs/common';
import { QuestionService } from './questions.service';
import { QuestionController } from './questions.controller';
import { USER_MODELS } from '@app/schemas';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODELS.Question.name,
        schema: USER_MODELS.QuestionSchema,
      },
    ]),
  ],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionsModule {}
