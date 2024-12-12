import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  createQuestion(model: USER_DTOS.QuestionCreateDto) {
    return this.authClientService.send('question.create', model);
  }
  getQuestions() {
    return this.authClientService.send('question.user.get', {});
  }
}
