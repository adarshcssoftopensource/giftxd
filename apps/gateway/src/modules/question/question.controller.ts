import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { QuestionsService } from './question.service';
import { ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';

@Controller('question')
@ApiTags('question')
export class QuestionsController {
  constructor(private questionService: QuestionsService) {}
  @Post('/create')
  @ResponseMessage('question created')
  @UseInterceptors(ResponseInterceptor)
  createQuestion(@Body() model: USER_DTOS.QuestionCreateDto) {
    return this.questionService.createQuestion(model);
  }

  @Get('/getall')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  async getUserCount() {
    return this.questionService.getQuestions();
  }
}
