import { Injectable } from '@nestjs/common';
import { USER_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(USER_MODELS.Role.name)
    private roleModel: Model<USER_MODELS.Role>,
  ) {}

  async createRole(model: USER_DTOS.CreateRoleDto) {
    const isExist = await this.roleModel.findOne({
      name: model.name,
    });
    console.log('isExist', isExist);
    if (isExist) {
      return new RpcException('Role already exist');
    }

    const role = await new this.roleModel({
      ...model,
    }).save();

    return role;
  }

  async getAllRoles() {
    const roles = await this.roleModel.find().exec();
    if (roles?.length === 0) {
      return new RpcException('roles not available');
    }

    return roles;
  }

  async updateRole(id: string, model: USER_DTOS.UpdateRoleDto) {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new RpcException('employee not found');
    }
    role.permissions = model.permissions;
    await role.save();
    return role;
  }
}
