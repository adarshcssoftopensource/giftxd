import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuards, ResponseInterceptor, ResponseMessage } from '@app/common';
import { LinkedAccountService } from './linked-account.service';
import { ApiExcludeEndpoint, ApiHeader, ApiTags } from '@nestjs/swagger';
import { LINKED_ACCOUNT_DTOS, LINKED_ACCOUNT_LIMIT_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('linkedAccount')
@ApiTags('linkedAccount')
export class LinkedAccountController {
  constructor(private linkedAccountService: LinkedAccountService) {}

  @Post('/create')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(201)
  @ResponseMessage('linkedAccount created')
  @UseInterceptors(ResponseInterceptor)
  createLinkedAccount(
    @Body() model: LINKED_ACCOUNT_DTOS.linkedAccountCreateDto,
  ) {
    return this.linkedAccountService.createLinkedAccount(model);
  }

  @Get('/getAll')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllLinkedAccount(
    @Query() model: LINKED_ACCOUNT_DTOS.linkedAccountPagingQueryDto,
  ) {
    return this.linkedAccountService.getAllLinkedAccount(model);
  }

  @Get('/getById')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getByIdLinkedAccount(@Query('id') id: string) {
    return this.linkedAccountService.getByIdLinkedAccount(id);
  }

  @Put('/update')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('update linkedAccount')
  @UseInterceptors(ResponseInterceptor)
  async updateLinkedAccount(
    @Query('id') id: string,
    @Body() model: LINKED_ACCOUNT_DTOS.linkedAccountUpdateDto,
  ) {
    return await this.linkedAccountService.updateLinkedAccount(id, model);
  }

  @Delete('delete')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('delete data')
  @UseInterceptors(ResponseInterceptor)
  async deleteLinkedAccount(@Query('id') id: string) {
    return this.linkedAccountService.deleteLinkedAccount(id);
  }

  @Put('gcrs/verify-account')
  @ApiExcludeEndpoint()
  @HttpCode(200)
  @ResponseMessage('verify-account')
  @UseInterceptors(ResponseInterceptor)
  async verifyAccount(@Body() model: LINKED_ACCOUNT_DTOS.linkedAccountVerify) {
    return await this.linkedAccountService.verifyAccount(model);
  }
  @Get('/getAccountByIdGcrs')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  retrieveAccountGcrs(@Query('id') id: string) {
    return this.linkedAccountService.retrieveAccountGcrs(id);
  }

  @Get('/getAccountsGcrs')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(200)
  @ResponseMessage('fetch the data')
  @UseInterceptors(ResponseInterceptor)
  getAccountsGcrs(@Query('userId') id: string) {
    return this.linkedAccountService.getAccountsGcrs(id);
  }

  @Post('limit/createOrUpdate')
  @ApiExcludeEndpoint()
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @HttpCode(201)
  @ResponseMessage('linkedAccount limit created')
  @UseInterceptors(ResponseInterceptor)
  createLinkedAccountLimit(
    @Body() model: LINKED_ACCOUNT_LIMIT_DTOS.createLinkedAccountLimit,
  ) {
    return this.linkedAccountService.createLinkedAccountLimit(model);
  }
}
