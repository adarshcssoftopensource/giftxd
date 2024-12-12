import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { USER_DTOS } from '@app/dto';
import { RpcException } from '@nestjs/microservices';
@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(USER_MODELS.Permission.name)
    private permissionModel: Model<USER_MODELS.Permission>,
  ) {}
  async createPermission(model: USER_DTOS.PermisssionCreateDto) {
    try {
      const data = await new this.permissionModel(model).save();
      return data;
    } catch (Err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }
  async getPermissions(model: USER_DTOS.GetAllPermissionDto) {
    const page_number = Number(model.page_number);
    const page_size = Number(model.page_size);
    const skip = (page_number - 1) * page_size;
    try {
      const data = await this.permissionModel.aggregate([
        {
          $skip: skip,
        },
        {
          $limit: page_size,
        },
      ]);
      return data;
    } catch (Err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }
}
