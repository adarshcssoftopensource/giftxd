import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Injectable()
export class EmployeesService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  createEmployee(model: USER_DTOS.CreateEmployeeDto) {
    return this.authClientService.send('employee.create', model);
  }
  getAllEmployee(query: USER_DTOS.EmployeePagingQueryDto) {
    return this.authClientService.send('employee.getAll', query);
  }
  getByIdEmployee(id: string) {
    return this.authClientService.send('employee.getById', id);
  }
  updateEmployee(id: string, model: USER_DTOS.UpdateEmployeeDto) {
    return this.authClientService.send('employee.update', { id, model });
  }
  deleteEmployee(id: string) {
    return this.authClientService.send('employee.deleteById', id);
  }
  getEmployeeTypeList() {
    return this.authClientService.send('employee.getTypes', {});
  }
  getSupervisorsAdminsList() {
    return this.authClientService.send('employee.getSupervisorsAdminsList', {});
  }
  searchEmployees(query: USER_DTOS.EmployeeSearchQueryDto) {
    return this.authClientService.send('employee.search', query);
  }
}
