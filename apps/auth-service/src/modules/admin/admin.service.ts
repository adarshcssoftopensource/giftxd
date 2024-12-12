import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { hash_with_bcrypt, compare_hash_with_bcrypt } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Role.name)
    private roleModel: Model<USER_MODELS.Role>,
    private jwt: JwtService,
  ) {}

  async createAdmin(model: USER_DTOS.AdminCreateDto) {
    try {
      const decode: any = this.jwt.decode(model.token);
      const user = await this.userModel.findById(decode._id).populate('role');
      const role = await this.roleModel.findOne({
        name: roleType.childAdmin,
      });
      if (user?.role?.name !== roleType.Admin) {
        return new RpcException('Invalid user');
      }
      if (!role) {
        throw new RpcException('Admin Role not exist');
      }
      model['role'] = role._id;

      model.password = hash_with_bcrypt(model.password);

      const is_exist = await this.userModel.findOne({
        email: model.email,
      });

      if (is_exist) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: model.email,
              msg: 'email already exists',
              path: 'email',
            },
          ],
        });
      }
      await new this.userModel(model).save();
      return 'Child admin created';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async adminLogin(model: USER_DTOS.AdminLoginDto) {
    try {
      const role = await this.roleModel.findOne({
        name: roleType.Admin,
      });
      const childAdminRole = await this.roleModel.findOne({
        name: roleType.childAdmin,
      });
      const admin = await this.userModel.findOne({
        email: model.email,
      });

      if (!admin) {
        return new RpcException({
          errorCode: 400,
          message: ['Invalid credentials'],
        });
      }

      const is_matched = compare_hash_with_bcrypt(
        model.password,
        admin['password'],
      );

      if (!is_matched) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: model.password,
              msg: 'invalid credentials',
              path: 'password',
            },
          ],
        });
      }

      const token = await this.jwt.signAsync({
        _id: admin['_id'],
        twoFaVerified: true,
      });
      admin.token = token;

      await admin.save();
      admin.password = null;
      if (admin.role.toString() == childAdminRole._id.toString()) {
        admin.role = childAdminRole;
      } else {
        admin.role = role;
      }
      return admin;
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async forgetPassword(model: USER_DTOS.forgetPasswordDto) {
    try {
      const admin = await this.userModel.findOne({ email: model.email });
      if (!admin) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: model.email,
              msg: 'invalid email',
              path: 'email',
            },
          ],
        });
      }
      const token = this.jwt.sign({ _id: admin['_id'] }, { expiresIn: '3m' });
      return token;
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async resetPassword(model: USER_DTOS.ResetPasswordDto) {
    try {
      const decode = await this.jwt.verifyAsync(model.token);
      const admin = await this.userModel.findById(decode._id);
      if (!admin) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: model.token,
              msg: 'Invalid user token',
              path: 'token',
            },
          ],
        });
      }

      model.password = hash_with_bcrypt(model.password);

      admin.password = model.password;
      await admin.save();
      return 'password reset';
    } catch (err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async usergetById(token: string) {
    try {
      const decode = await this.jwt.verifyAsync(token);
      const user = await this.userModel.findById(decode._id).populate('role');
      if (!user) {
        return ['user not found', null];
      }
      return [null, user];
    } catch (Err) {
      console.log(Err);
      return [Err.message, null];
    }
  }
}
