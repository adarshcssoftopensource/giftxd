import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}
  @MessagePattern('permission.create')
  async createPermission(model: USER_DTOS.PermisssionCreateDto) {
    const data = await this.permissionService.createPermission(model);
    return data;
  }
  @MessagePattern('permission.getall')
  async getPermisssions(model: USER_DTOS.GetAllPermissionDto) {
    const data = await this.permissionService.getPermissions(model);
    return data;
  }
}
