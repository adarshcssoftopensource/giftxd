import { SECURITY_QUESTION_ANSWER_DTO, SECURITY_QUESTION_DTO } from '@app/dto';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class SecurityQuestionService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly SecurityQuestionClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createSecurityQuestion(model: SECURITY_QUESTION_DTO.CreateSecurityQuestion) {
    model.token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.create',
      model,
    );
    return response;
  }

  getByIdSecurityQuestion(id: string) {
    const token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.getById',
      { id, token },
    );
    return response;
  }

  updateByIdSecurityQuestion(
    model: SECURITY_QUESTION_DTO.UpdateSecurityQuestion,
  ) {
    model.token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.updateById',
      model,
    );
    return response;
  }

  getAllSecurityQuestion() {
    const token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.getAll',
      token,
    );
    return response;
  }

  deleteSecurityQuestion(id: string) {
    const token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.delete',
      { id, token },
    );
    return response;
  }

  createSecurityQuestionAnswer(
    model: SECURITY_QUESTION_ANSWER_DTO.CreateSecurityQuestionAnswer,
  ) {
    model.token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.createAnswer',
      model,
    );
    return response;
  }

  getByIdSecurityQuestionAnswer(userId: string) {
    const token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'getByIdSecurityQuestionAnswer.getById',
      { userId, token },
    );
    return response;
  }

  GetListOfUser(model: SECURITY_QUESTION_ANSWER_DTO.GetListOfUser) {
    model.token = this.request.headers['x-access-token'];
    const response = this.SecurityQuestionClientService.send(
      'securityQuestion.GetListOfUser',
      model,
    );
    return response;
  }
}
