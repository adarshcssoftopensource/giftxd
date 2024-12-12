import { MessagePattern } from '@nestjs/microservices';
import { QuestionService } from './questions.service';
import { Controller } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @MessagePattern('question.create')
  createQuestion(model: USER_DTOS.QuestionCreateDto) {
    const data = this.questionService.createQuestion(model);
    return data;
  }
  @MessagePattern('question.user.get')
  getQuestions() {
    return this.questionService.getQuestions();
  }
}
