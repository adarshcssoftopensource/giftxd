import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { AttributeService } from './attributes.service';
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ATTRIBUTE_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('attribute')
@ApiTags('attribute')
export class AttributesController {
  constructor(private attributeService: AttributeService) {}

  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('attribute created')
  @UseInterceptors(ResponseInterceptor)
  createAttribute(@Body() model: ATTRIBUTE_DTOS.CreateAttribueDto) {
    return this.attributeService.createAttribute(model);
  }

  @Get('/getAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllProvider(@Query() model: ATTRIBUTE_DTOS.queryatributeDto) {
    return this.attributeService.getAllAttribute(model);
  }

  @Delete('/delete')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  deleteProvider(@Query('id') id: string) {
    return this.attributeService.deleteAttribute(id);
  }
}
