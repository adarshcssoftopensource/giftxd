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
import { ScheduleService } from './schedule.service';
import { ApiTags } from '@nestjs/swagger';
import { SCHEDULE_DTOS } from '@app/dto';

@Controller('schedule')
@ApiTags('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}
  @Post('/create')
  @ResponseMessage('schedule created')
  @UseInterceptors(ResponseInterceptor)
  createSchedule(@Body() model: SCHEDULE_DTOS.CreateScheduleDto) {
    return this.scheduleService.createSchedule(model);
  }

  @Get('/getAll')
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllSchedule(@Query() query: SCHEDULE_DTOS.SchedulePagingQueryDto) {
    return this.scheduleService.getAllSchedule(query);
  }
  @Put('/update/:id')
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updateSchedule(
    @Param('id') id: string,
    @Body() model: SCHEDULE_DTOS.UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(id, model);
  }

  @Get('/getById/:id')
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getByIdSchedule(@Param('id') id: string) {
    return this.scheduleService.getByIdSchedule(id);
  }

  @Delete('/delete/:id')
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  deleteSchedule(@Param('id') id: string) {
    return this.scheduleService.deleteSchedule(id);
  }
}
