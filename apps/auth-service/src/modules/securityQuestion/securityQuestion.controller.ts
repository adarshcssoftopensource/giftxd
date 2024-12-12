import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SECURITY_QUESTION_ANSWER_DTO, SECURITY_QUESTION_DTO } from '@app/dto';
import { SecurityQuestionService } from './securityQuestion.service';
@Controller('securityQuestion')
export class SecurityQuestionController {
  constructor(private securityQuestionService: SecurityQuestionService) {}

  @MessagePattern('securityQuestion.create')
  createRole(model: SECURITY_QUESTION_DTO.CreateSecurityQuestion) {
    try {
      const data = this.securityQuestionService.createSecurityQuestion(model);
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }
  @MessagePattern('securityQuestion.getById')
  getByIdSecurityQuestion({ id, token }) {
    try {
      const data = this.securityQuestionService.getByIdSecurityQuestion({
        id,
        token,
      });
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }
  @MessagePattern('securityQuestion.getAll')
  getAllSecurityQuestion(token) {
    try {
      const data = this.securityQuestionService.getAllSecurityQuestion(token);
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }
  @MessagePattern('securityQuestion.updateById')
  updateByIdSecurityQuestion(
    model: SECURITY_QUESTION_DTO.UpdateSecurityQuestion,
  ) {
    try {
      const data =
        this.securityQuestionService.updateByIdSecurityQuestion(model);
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }
  @MessagePattern('securityQuestion.delete')
  deleteSecurityQuestion({ id, token }) {
    try {
      const data = this.securityQuestionService.deleteSecurityQuestion({
        id,
        token,
      });
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }

  @MessagePattern('securityQuestion.createAnswer')
  createSecurityQuestionAnswer(
    model: SECURITY_QUESTION_ANSWER_DTO.CreateSecurityQuestionAnswer,
  ) {
    try {
      const data =
        this.securityQuestionService.createSecurityQuestionAnswer(model);
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }

  @MessagePattern('getByIdSecurityQuestionAnswer.getById')
  getByIdSecurityQuestionAnswer({ userId, token }) {
    try {
      const data = this.securityQuestionService.getByIdSecurityQuestionAnswer(
        userId,
        token,
      );
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }

  @MessagePattern('securityQuestion.GetListOfUser')
  GetListOfUser(model: SECURITY_QUESTION_ANSWER_DTO.GetListOfUser) {
    try {
      const data = this.securityQuestionService.GetListOfUser(model);
      return data;
    } catch (error) {
      console.log('err', error);
    }
  }
}
