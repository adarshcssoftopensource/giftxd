import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { Client, RpcException } from '@nestjs/microservices';
import { hash_with_bcrypt } from '@app/common';
import { toSearchModel, toModel } from 'apps/gateway/src/mappers/client';

const toObjectId = Types.ObjectId;
@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(USER_MODELS.Question.name)
    private questionModel: Model<USER_MODELS.Question>,
  ) {}

  async createQuestion(model: USER_DTOS.QuestionCreateDto) {
    const question_payload = {
      question: model.question,
    };
    const question = await new this.questionModel({
      ...question_payload,
    }).save();

    return question;
  }

  async getQuestions() {
    try {
      const questions = await this.questionModel.find();
      return questions;
    } catch (error) {
      throw new RpcException('Error getting crypto');
    }
  }
}
