import { MessagePattern } from '@nestjs/microservices';
import { EmployeeService } from './employee.service';
import { Controller } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @MessagePattern('employee.create')
  createEmployee(model: USER_DTOS.CreateEmployeeDto) {
    const data = this.employeeService.createEmployee(model);
    return data;
  }
  @MessagePattern('employee.update')
  async updateEmployee(data: { id: string, model: USER_DTOS.UpdateEmployeeDto }) {
    const { id, model } = data;
    const updatedData = await this.employeeService.updateEmployee(id, model);
    return updatedData;
  }
  @MessagePattern('employee.getAll')
  async getAllEmployee(query: USER_DTOS.EmployeePagingQueryDto) {
    const data = await this.employeeService.getAllEmployee(query);
    return data;
  }
  @MessagePattern('employee.getById')
  async getBYIdEmployee(id: string) {
    const data = await this.employeeService.getBYIdEmployee(id);
    return data;
  }
  @MessagePattern('employee.deleteById')
  async deleteEmployee(id: string) {
    const data = await this.employeeService.deleteEmployee(id);
    return data;
  }

  @MessagePattern('employee.getTypes')
  getEmployeeTypeList() {
    const data = this.employeeService.getEmployeeTypeList();
    return data;
  }

  @MessagePattern('employee.getSupervisorsAdminsList')
  async getSupervisorsAdminsList() {
    const data = await this.employeeService.getSupervisorsAdminsList();
    return data;
  }

  @MessagePattern('employee.search')
  async searchEmployees(query: USER_DTOS.EmployeeSearchQueryDto) {
    const { page, limit, search } = query;
    // Defaults are handled in the service if not provided
    const data = await this.employeeService.searchEmployees(
      page,
      limit,
      search,
    );
    return data;
  }
}
