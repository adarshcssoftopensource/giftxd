import { Injectable } from '@nestjs/common';
import {
  SECURITY_QUESTION_ANSWER_MODELS,
  SECURITY_QUESTION_MODELS,
  USER_MODELS,
} from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SECURITY_QUESTION_ANSWER_DTO, SECURITY_QUESTION_DTO } from '@app/dto';
import { RpcException } from '@nestjs/microservices';
import { roleType } from '@app/schemas/users/role.schema';
import { JwtService } from '@nestjs/jwt';
import { decryptData, encryptData } from '@app/common/encryption';

@Injectable()
export class SecurityQuestionService {
  constructor(
    @InjectModel(SECURITY_QUESTION_MODELS.SecurityQuestions.name)
    private securityQuestionModel: Model<SECURITY_QUESTION_MODELS.SecurityQuestions>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(SECURITY_QUESTION_ANSWER_MODELS.SecurityQuestionsAnswer.name)
    private securityQuestionsAnswerModel: Model<SECURITY_QUESTION_ANSWER_MODELS.SecurityQuestionsAnswer>,
    private jwt: JwtService,
  ) {}

  async createSecurityQuestion(
    model: SECURITY_QUESTION_DTO.CreateSecurityQuestion,
  ) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Admin) {
      return new RpcException('Invalid user');
    }
    const securityQuestion = await new this.securityQuestionModel({
      ...model,
    }).save();

    return securityQuestion;
  }

  async getByIdSecurityQuestion({ id, token }) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Admin) {
      return new RpcException('Invalid user');
    }
    const data = await this.securityQuestionModel.findById(id).select({
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!data) {
      return new RpcException('SecurityQuestion not found');
    }
    return data;
  }

  async updateByIdSecurityQuestion(
    model: SECURITY_QUESTION_DTO.UpdateSecurityQuestion,
  ) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Admin) {
      return new RpcException('Invalid user');
    }
    const data = await this.securityQuestionModel.findById(model.id);
    if (!data) {
      return new RpcException('SecurityQuestion not found');
    }
    if (model.question) {
      data.question = model.question;
    }
    data.save();
    return 'Updated successfully';
  }

  async getAllSecurityQuestion(token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Admin &&
      user?.role?.name !== roleType.Vendor &&
      user?.role?.name !== roleType.Client
    ) {
      return new RpcException('Invalid user');
    }
    const data = await this.securityQuestionModel
      .find()
      .select({ __v: 0, createdAt: 0, updatedAt: 0 });
    return data;
  }

  async deleteSecurityQuestion({ id, token }) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Admin) {
      return new RpcException('Invalid user');
    }
    await this.securityQuestionModel.findOneAndDelete(id);
    return 'Deleted successfully';
  }

  async createSecurityQuestionAnswer(
    model: SECURITY_QUESTION_ANSWER_DTO.CreateSecurityQuestionAnswer,
  ) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (
      user?.role?.name !== roleType.Client &&
      user?.role?.name !== roleType.Vendor
    ) {
      return new RpcException('Invalid user');
    }
    const answerExist = await this.securityQuestionsAnswerModel.findOne({
      answerBy: user._id,
    });

    if (answerExist) {
      if (model.questionsAndAnswer && Array.isArray(model.questionsAndAnswer)) {
        for (const entry of model.questionsAndAnswer) {
          const [questionId, answer] = Object.entries(entry)[0];
          const question = await this.securityQuestionModel.findById(
            questionId,
          );

          if (!question) {
            throw new RpcException(`Question with ID ${questionId} not found`);
          }

          const encryptAnswer = await encryptData(answer);
          const existingEntryIndex = answerExist.questionsAndAnswer.findIndex(
            (existingEntry) => Object.keys(existingEntry)[0] === questionId,
          );
          if (existingEntryIndex !== -1) {
            const update = {
              $set: {},
            };

            update.$set[
              `questionsAndAnswer.${existingEntryIndex}.${questionId}`
            ] = {
              encryptedData: encryptAnswer.encryptedData,
              iv: encryptAnswer.iv,
            };
            await this.securityQuestionsAnswerModel.updateOne(
              { _id: answerExist._id },
              update,
            );
          } else {
            const newEntry = {
              [questionId]: {
                encryptedData: encryptAnswer.encryptedData,
                iv: encryptAnswer.iv,
              },
            };

            answerExist.questionsAndAnswer.push(newEntry);
          }
        }

        await answerExist.save();
      }
      return 'updated';
    } else {
      if (model.questionsAndAnswer && Array.isArray(model.questionsAndAnswer)) {
        for (const entry of model.questionsAndAnswer) {
          const [questionId, answer] = Object.entries(entry)[0];
          const question = await this.securityQuestionModel.findById(
            questionId,
          );
          if (!question) {
            throw new RpcException(`Question with ID ${questionId} not found`);
          }
          const encryptAnswer = await encryptData(answer);
          entry[questionId] = {
            encryptedData: encryptAnswer.encryptedData,
            iv: encryptAnswer.iv,
          };
        }
        const payload = {
          answerBy: user.id,
          questionsAndAnswer: model.questionsAndAnswer,
        };
        await new this.securityQuestionsAnswerModel({
          ...payload,
        }).save();
      }
      return 'created';
    }
  }
  async getByIdSecurityQuestionAnswer(userId, token) {
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel.findById(decode._id).populate('role');
    if (user?.role?.name !== roleType.Admin) {
      return new RpcException('Invalid user');
    }
    const data = await this.securityQuestionsAnswerModel
      .findOne({
        answerBy: userId,
      })
      .select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0, answerBy: 0 })
      .lean();
    if (!data) {
      return new RpcException('Not found');
    }
    for (const obj of data.questionsAndAnswer) {
      for (const key in obj) {
        if (obj[key] && obj[key].iv && obj[key].encryptedData) {
          const { iv, encryptedData } = obj[key];
          const decryptedAnswer = await decryptData({ encryptedData, iv });
          obj[key].encryptedData = decryptedAnswer;
        }
      }
    }
    if (
      data &&
      data.questionsAndAnswer &&
      Array.isArray(data.questionsAndAnswer)
    ) {
      data.questionsAndAnswer = data.questionsAndAnswer.map((entry) => {
        const [questionId, values] = Object.entries(entry)[0];
        return { [questionId]: values.encryptedData };
      });
    }
    return data;
  }
  async GetListOfUser(model: SECURITY_QUESTION_ANSWER_DTO.GetListOfUser) {
    const decode: any = this.jwt.decode(model.token);
    const user = await this.userModel.findById(decode._id).populate('role');

    if (user?.role?.name !== roleType.Admin) {
      console.log('Invalid user');
      return new RpcException('Invalid user');
    }
    const pageNumber = Number(model.pageNumber) || 1;
    const pageSize = Number(model.pageSize) || 10;
    const skip = (pageNumber - 1) * pageSize;
    let filterBoolean: boolean;

    if (typeof model.filter === 'boolean') {
      filterBoolean = model.filter;
    } else {
      filterBoolean = model.filter === 'true';
    }
    if (filterBoolean) {
      const securityAnswers = await this.securityQuestionsAnswerModel
        .find()
        .select({ answerBy: 1 })
        .sort({ createAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: 'answerBy',
          select: { _id: 1, email: 1, username: 1 },
        });
      const populatedAnswers = securityAnswers.map((answer) => answer.answerBy);
      return populatedAnswers;
    } else {
      const users = await this.userModel
        .find()
        .sort({ create_at: 1 })
        .select({ _id: 1, email: 1, username: 1 })
        .skip(skip)
        .limit(pageSize);
      return users;
    }
  }
}
