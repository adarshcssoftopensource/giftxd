import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Injectable()
export class SupervisorsService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  createSupervisor(model: USER_DTOS.CreateSupervisorDto) {
    return this.authClientService.send('supervisor.create', model);
  }
  getAllSupervisor(query: USER_DTOS.SupervisorPagingQueryDto) {
    return this.authClientService.send('supervisor.getAll', query);
  }
  getByIdSupervisor(id: string) {
    return this.authClientService.send('supervisor.getById', id);
  }
  updateSupervisor(id: string, model: USER_DTOS.UpdateSupervisorDto) {
    return this.authClientService.send('supervisor.update', { id, model });
  }
  deleteSupervisor(id: string) {
    return this.authClientService.send('supervisor.deleteById', id);
  }
  getAdminsList() {
    return this.authClientService.send('supervisor.getAdminsList', {});
  }
  searchSupervisors(query: USER_DTOS.SupervisorSearchQueryDto) {
    return this.authClientService.send('supervisor.search', query);
  }
}
