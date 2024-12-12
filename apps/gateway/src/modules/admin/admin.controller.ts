import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ResponseInterceptor,
  ResponseMessage,
  MessageResponseInterceptor,
  AuthGuards,
} from '@app/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiHeader, ApiExcludeEndpoint } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';
import { access_token_payload } from '../../../../../libs/common/src/global/swagger';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/create')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('admin created')
  @UseInterceptors(ResponseInterceptor)
  createAdmin(@Body() model: USER_DTOS.AdminCreateDto) {
    return this.adminService.createAdmin(model);
  }

  @HttpCode(200)
  @Post('/login')
  @ResponseMessage('admin logged in.')
  @UseInterceptors(ResponseInterceptor)
  adminLogin(@Body() model: USER_DTOS.AdminLoginDto) {
    return this.adminService.adminLogin(model);
  }

  @HttpCode(200)
  @Post('/forgetPassword')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ResponseMessage('email sent')
  @UseInterceptors(ResponseInterceptor)
  forgetPassword(@Body() model: USER_DTOS.forgetPasswordDto) {
    return this.adminService.forgetPassword(model);
  }

  @HttpCode(200)
  @Post('/resetPassword')
  @UseInterceptors(MessageResponseInterceptor)
  resetPassword(@Body() model: USER_DTOS.ResetPasswordDto) {
    return this.adminService.resetPassword(model);
  }
}
