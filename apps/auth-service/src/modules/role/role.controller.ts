import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';
import { RoleService } from './role.service';
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @MessagePattern('role.create')
  createRole(model: USER_DTOS.CreateRoleDto) {
    try {
      const data = this.roleService.createRole(model);
      return data;
    } catch (error) {
      console.log('errr', error);
    }
  }

  @MessagePattern('role.update')
  updateRole(model: USER_DTOS.UpdateRoleDto, id: string) {
    const data = this.roleService.updateRole(id, model);
    return data;
  }

  @MessagePattern('role.getAll')
  async getAllRole() {
    const data = await this.roleService.getAllRoles();
    return data;
  }
}
