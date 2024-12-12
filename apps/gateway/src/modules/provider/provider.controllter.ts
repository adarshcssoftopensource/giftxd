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
  UseGuards,
} from '@nestjs/common';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { ProviderService } from './provideer.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { PROVIDER_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('provider')
@ApiTags('provider')
export class ProviderController {
  constructor(private providerService: ProviderService) {}
  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('provider created')
  @UseInterceptors(ResponseInterceptor)
  createProvider(@Body() model: PROVIDER_DTOS.CreateProviderDto) {
    return this.providerService.createProvider(model);
  }

  @Get('/getAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllProvider() {
    return this.providerService.getAllProvider();
  }
  @Put('/updateByName')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage(' update data')
  @UseInterceptors(ResponseInterceptor)
  updateByNameProvider(@Body() model: PROVIDER_DTOS.UpdateProviderDto) {
    return this.providerService.updateByNameProvider(model);
  }

  @Get('/getByName')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getByNameProvider(@Query('providerName') providerName: string) {
    return this.providerService.getByNameProvider(providerName);
  }

  @Delete('/deleteByName')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  deleteByNameProvider(@Query('name') name: string) {
    return this.providerService.deleteByNameProvider(name);
  }
  @Get('/provider-details')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  providerDetails() {
    return this.providerService.providerDetails();
  }
}
