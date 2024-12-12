import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly roleService: ClientProxy,
  ) {}

  createRole(model: USER_DTOS.CreateRoleDto) {
    return this.roleService.send('role.create', model);
  }
  getAllRole() {
    return this.roleService.send('role.getAll', {});
  }
  updateRole<T>(id: string, model: USER_DTOS.UpdateRoleDto) {
    const Role_update_payload = class {
      id: string;
      permissions: object;
      constructor(r_args: USER_DTOS.UpdateRoleDto & { id: string }) {
        this.id = r_args.id;
        this.permissions = r_args.permissions;
      }
    };
    return this.roleService.send(
      'role.update',
      new Role_update_payload({ id, ...model }),
    );
  }
}
