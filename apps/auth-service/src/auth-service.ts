import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../libs/schemas/src/users/user.schema';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwt: JwtService,
  ) {}
  async verifyUserWithJwt(token: string) {
    try {
      const decode = this.jwt.verify(token);

      const jwt_error_list = {
        TokenExpiredError: 'TokenExpiredError',
        JsonWebTokenError: 'JsonWebTokenError',
        NotBeforeError: 'NotBeforeError',
      };

      if (jwt_error_list[decode.name]) {
        throw jwt_error_list[decode.name];
      }

      const user = await this.userModel.findById(decode._id);

      if (!user) {
        throw 'invalid user';
      }

      return [null, user];
    } catch (err) {
      return [err, null];
    }
  }
}
