import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Get,
  Query,
} from '@nestjs/common';
import { USER_DTOS } from '@app/dto';
import {
  ResponseInterceptor,
  ResponseMessage,
  MessageResponseInterceptor,
} from '@app/common';
import { PermissionService } from './permission.service';
import { ApiTags } from '@nestjs/swagger';
@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}
  @Post('/createPermission')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('permission created')
  createPermission(@Body() model: USER_DTOS.PermisssionCreateDto) {
    return this.permissionService.createPermission(model);
  }
  @Get('getAll')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('permission fetched')
  getAll(
    @Query('page_number') page_number: string,
    @Query('page_size') page_size: string,
  ) {
    return this.permissionService.getallPermission({ page_number, page_size });
  }
}
