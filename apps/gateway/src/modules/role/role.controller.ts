import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Post('/create')
  @ResponseMessage('role created')
  @UseInterceptors(ResponseInterceptor)
  createRole(@Body() model: USER_DTOS.CreateRoleDto) {
    return this.roleService.createRole(model);
  }

  @Get('/getAll')
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllRole() {
    return this.roleService.getAllRole();
  }

  @Put('/update')
  @ResponseMessage('update data')
  @UseInterceptors(ResponseInterceptor)
  updateRole(@Query('id') id: string, model: USER_DTOS.UpdateRoleDto) {
    return this.roleService.updateRole(id, model);
  }
}
