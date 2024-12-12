import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { EmployeesService } from './employees.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';

@Controller('employee')
@ApiTags('employee')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}
  @Post('/create')
  @ResponseMessage('employee created')
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  createEmployee(@Body() model: USER_DTOS.CreateEmployeeDto) {
    return this.employeeService.createEmployee(model);
  }

  @Get('/getAll')
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllEmployee(@Query() query: USER_DTOS.EmployeePagingQueryDto) {
    return this.employeeService.getAllEmployee(query);
  }
  @Get('/getById/:id')
  @ResponseMessage('data fetch')
  @UseInterceptors(ResponseInterceptor)
  getByIdEmployee(@Param('id') id: string) {
    return this.employeeService.getByIdEmployee(id);
  }
  @Put('/update/:id')
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updateemployee(
    @Param('id') id: string,
    @Body() model: USER_DTOS.UpdateEmployeeDto,
  ) {
    console.log('Controller Received ID:', id);
    return this.employeeService.updateEmployee(id, model);
  }
  @Delete('/delete/:id')
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }

  @Get('/getEmploymentTypes')
  @ResponseMessage('get employee types')
  @UseInterceptors(ResponseInterceptor)
  getEmployeeTypeList() {
    return this.employeeService.getEmployeeTypeList();
  }

  @Get('/getSupervisorsAdminsList')
  @ResponseMessage('get list of supervisors and admins')
  @UseInterceptors(ResponseInterceptor)
  getSupervisorsAdminsList() {
    return this.employeeService.getSupervisorsAdminsList();
  }

  @Get('/search')
  @ResponseMessage('Employee search results')
  @UseInterceptors(ResponseInterceptor)
  searchEmployees(@Query() query: USER_DTOS.EmployeeSearchQueryDto) {
    return this.employeeService.searchEmployees(query);
  }
}
