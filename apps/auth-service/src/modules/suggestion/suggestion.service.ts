import { Injectable } from '@nestjs/common';
import { HOME_MODELS, USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';


@Injectable()
export class SuggestionCardService {
  constructor(
    @InjectModel(HOME_MODELS.SuggestionCard.name)
    private suggestionCardModel: Model<HOME_MODELS.SuggestionCard>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    private jwt: JwtService,
  ) {}

  async createSuggestionCard(model: { message: string, token: string }) {
    const decode = await this.jwt.verifyAsync(model.token);
    const user = await this.userModel.findById(decode['_id']);
    if(!user){
      return new RpcException("Corresponding user not found!");
    }
    const suggestioncard_payload = {
      message: model.message,
      username: user.username
    };
    const suggestioncard = await new this.suggestionCardModel({
      ...suggestioncard_payload,
    }).save();

    return suggestioncard;
  }

  async getSuggestionCards(model: { token: string }) {
    const decode = await this.jwt.verifyAsync(model.token);
    const user = await this.userModel.findById(decode['_id']).populate('role');
    
    if(!user){
      return new RpcException("Corresponding user not found!");
    }
    if(user.role.name != roleType.Admin){
      return new RpcException("Unauthorized to access these resources. Only Admin can access this resource!");
    }

    try {
      const suggestioncards = await this.suggestionCardModel.find({}, { message: 1, username: 1, created_date: 1, updated_at: 1 });
      return suggestioncards;
    } catch (error) {
      throw new RpcException('Error getting suggestion');
    }
  }
}
