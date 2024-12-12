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
import { SupervisorsService } from './supervisors.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';

@Controller('supervisor')
@ApiTags('supervisor')
export class SupervisorsController {
  constructor(private supervisorService: SupervisorsService) {}
  @Post('/create')
  @ResponseMessage('supervisor created')
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  createSupervisor(@Body() model: USER_DTOS.CreateSupervisorDto) {
    return this.supervisorService.createSupervisor(model);
  }

  @Get('/getAll')
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllSupervisor(@Query() query: USER_DTOS.SupervisorPagingQueryDto) {
    return this.supervisorService.getAllSupervisor(query);
  }
  @Get('/getById/:id')
  @ResponseMessage('data fetch')
  @UseInterceptors(ResponseInterceptor)
  getByIdSupervisor(@Param('id') id: string) {
    return this.supervisorService.getByIdSupervisor(id);
  }
  @Put('/update/:id')
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updatesupervisor(
    @Param('id') id: string,
    @Body() model: USER_DTOS.UpdateSupervisorDto,
  ) {
    return this.supervisorService.updateSupervisor(id, model);
  }
  @Delete('/delete/:id')
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  deleteSupervisor(@Param('id') id: string) {
    return this.supervisorService.deleteSupervisor(id);
  }

  @Get('/getAdminsList')
  @ResponseMessage('get admins list')
  @UseInterceptors(ResponseInterceptor)
  getAdminsList() {
    return this.supervisorService.getAdminsList();
  }

  @Get('/search')
  @ResponseMessage('Employee search results')
  @UseInterceptors(ResponseInterceptor)
  searchSupervisors(@Query() query: USER_DTOS.SupervisorSearchQueryDto) {
    return this.supervisorService.searchSupervisors(query);
  }
}
