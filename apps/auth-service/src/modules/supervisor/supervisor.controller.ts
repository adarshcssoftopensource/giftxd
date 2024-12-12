import { MessagePattern } from '@nestjs/microservices';
import { SupervisorService } from './supervisor.service';
import { Controller } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';

@Controller('supervisors')
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  @MessagePattern('supervisor.create')
  createSupervisor(model: USER_DTOS.CreateSupervisorDto) {
    const data = this.supervisorService.createSupervisor(model);
    return data;
  }
  @MessagePattern('supervisor.update')
  updateSupervisor(data: { id: string; model: USER_DTOS.UpdateSupervisorDto }) {
    const { id, model } = data;
    return this.supervisorService.updateSupervisor(id, model);
  }
  @MessagePattern('supervisor.getAll')
  async getAllSupervisor(query: USER_DTOS.SupervisorPagingQueryDto) {
    const data = await this.supervisorService.getAllSupervisor(query);
    return data;
  }
  @MessagePattern('supervisor.getById')
  async getBYIdSupervisor(id: string) {
    const data = await this.supervisorService.getBYIdSupervisor(id);
    return data;
  }
  @MessagePattern('supervisor.deleteById')
  async deleteSupervisor(id: string) {
    const data = await this.supervisorService.deleteSupervisor(id);
    return data;
  }

  @MessagePattern('supervisor.getAdminsList')
  async getAdminsList() {
    const data = await this.supervisorService.getAdminsList();
    return data;
  }

  @MessagePattern('supervisor.search')
  async searchSupervisors(query: USER_DTOS.SupervisorSearchQueryDto) {
    const { page, limit, search } = query;
    // Defaults are handled in the service if not provided
    const data = await this.supervisorService.searchSupervisors(
      page,
      limit,
      search,
    );
    return data;
  }
}
