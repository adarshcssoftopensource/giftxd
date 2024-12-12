import { Module } from '@nestjs/common';
import { QuestionsService } from './question.service';
import { QuestionsController } from './question.controller';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionModule {}
