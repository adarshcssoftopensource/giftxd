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
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuards,
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { ClientService } from './client.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('client')
@ApiTags('client')
export class ClientController {
  constructor(private clientService: ClientService) {}
  @Post('/create')
  @HttpCode(201)
  @ResponseMessage('client created')
  @UseInterceptors(ResponseInterceptor)
  createClient(@Body() model: USER_DTOS.ClientCreateDto) {
    return this.clientService.createClient(model);
  }

  @Get('/getAll')
  @HttpCode(200)
  @ResponseMessage('get all data')
  @UseInterceptors(ResponseInterceptor)
  getAllClient(@Query() query: USER_DTOS.ClientPagingQueryDto) {
    return this.clientService.getAllClient(query);
  }
  @Get('/getById/:id')
  @HttpCode(200)
  @ResponseMessage('data fetch')
  @UseInterceptors(ResponseInterceptor)
  getByIdClient(@Param('id') id: string) {
    return this.clientService.getByIdClient(id);
  }

  @Put('/update/:id')
  @HttpCode(200)
  @ResponseMessage('Client data updated successfully')
  @UseInterceptors(ResponseInterceptor)
  updateClient(
    @Param('id') id: string,
    @Body() model: USER_DTOS.ClientUpdateDto,
  ) {
    return this.clientService.updateClient(id, model);
  }

  @Delete('/delete/:id')
  @HttpCode(200)
  @ResponseMessage(' delete data')
  @UseInterceptors(ResponseInterceptor)
  deleteClient(@Param('id') id: string) {
    return this.clientService.deleteClient(id);
  }
  @Get('/search')
  @HttpCode(200)
  @ResponseMessage('successfully')
  @UseInterceptors(ResponseInterceptor)
  searchClient(@Query() searchValue: USER_DTOS.ClientSearchQuery) {
    return this.clientService.searchClient(searchValue);
  }

  @Put('/verify-identity')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Identity verification plaid link retrieved successfully')
  @UseInterceptors(ResponseInterceptor)
  verifyIdDocument() {
    return this.clientService.verifyIdDocument();
  }

  @Post('/update/kyc-status')
  @HttpCode(200)
  @ResponseMessage('Identity verification plaid link retrieved successfully')
  @UseInterceptors(ResponseInterceptor)
  updateKycStatus(@Body() webhook_payload: USER_DTOS.ClientKycStatusUpdateDto) {
    return this.clientService.updateKycStatus(webhook_payload);
  }

  @Put('/verify-residency')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('Residency verification plaid link retrieved successfully')
  @UseInterceptors(ResponseInterceptor)
  verifyResidency() {
    return this.clientService.verifyResidency();
  }

  @Post('/send-verification-email')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async sendEmailVerification() {
    return this.clientService.sendEmailVerification();
  }

  @Get('/all/verification-status')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async getAllVerificationStatus() {
    return this.clientService.getAllVerificationStatus();
  }
}
