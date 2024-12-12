import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { USER_MODELS } from '@app/schemas';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
import { USER_DTOS } from '@app/dto';
@Injectable()
export class PermissionService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy, // @InjectModel(USER_MODELS.Permission.name) // private permissionModel: Model<USER_MODELS.Permission>,
  ) {}
  createPermission(model: USER_DTOS.PermisssionCreateDto) {
    return this.authClientService.send('permission.create', model);
  }
  getallPermission(model: USER_DTOS.GetAllPermissionDto) {
    return this.authClientService.send('permission.getall', model);
  }
}
