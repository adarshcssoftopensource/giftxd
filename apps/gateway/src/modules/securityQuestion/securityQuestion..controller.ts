import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  UseGuards,
  Get,
  Put,
  Query,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { SecurityQuestionService } from './securityQuestion..service';
import { SECURITY_QUESTION_ANSWER_DTO, SECURITY_QUESTION_DTO } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('security-question')
@ApiTags('security-question')
export class SecurityQuestionController {
  constructor(private securityQuestionService: SecurityQuestionService) {}
  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question created')
  @UseInterceptors(ResponseInterceptor)
  createSecurityQuestion(
    @Body() model: SECURITY_QUESTION_DTO.CreateSecurityQuestion,
  ) {
    return this.securityQuestionService.createSecurityQuestion(model);
  }

  @Post('/Answer')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question created')
  @UseInterceptors(ResponseInterceptor)
  createSecurityQuestionAnswer(
    @Body() model: SECURITY_QUESTION_ANSWER_DTO.CreateSecurityQuestionAnswer,
  ) {
    return this.securityQuestionService.createSecurityQuestionAnswer(model);
  }

  @Get('/GetById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getByIdSecurityQuestion(@Query('id') id: string) {
    return this.securityQuestionService.getByIdSecurityQuestion(id);
  }
  @Get('/GetAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question')
  @UseInterceptors(ResponseInterceptor)
  getAllSecurityQuestion() {
    return this.securityQuestionService.getAllSecurityQuestion();
  }

  @Delete('/Delete')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question deleted')
  @UseInterceptors(ResponseInterceptor)
  deleteSecurityQuestion(@Query('id') id: string) {
    return this.securityQuestionService.deleteSecurityQuestion(id);
  }

  @Put('/updateById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question')
  @UseInterceptors(ResponseInterceptor)
  updateByIdSecurityQuestion(
    @Body() model: SECURITY_QUESTION_DTO.UpdateSecurityQuestion,
  ) {
    return this.securityQuestionService.updateByIdSecurityQuestion(model);
  }

  @Put('/AnswerGetById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question')
  @UseInterceptors(ResponseInterceptor)
  getByIdSecurityQuestionAnswer(@Query('userId') userId: string) {
    return this.securityQuestionService.getByIdSecurityQuestionAnswer(userId);
  }

  @Put('/GetListOfUser')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Security question')
  @UseInterceptors(ResponseInterceptor)
  GetListOfUser(@Query() model: SECURITY_QUESTION_ANSWER_DTO.GetListOfUser) {
    return this.securityQuestionService.GetListOfUser(model);
  }
}
