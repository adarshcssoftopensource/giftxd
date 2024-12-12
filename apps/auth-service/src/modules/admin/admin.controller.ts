import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';
import { AdminService } from './admin.service';
import { ServiceExceptionFilter } from '@app/common';
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @MessagePattern('admin.create')
  @UseInterceptors(ServiceExceptionFilter)
  createAdmin(model: USER_DTOS.AdminCreateDto) {
    return this.adminService.createAdmin(model);
  }

  @MessagePattern('admin.login')
  @UseInterceptors(ServiceExceptionFilter)
  adminLogin(model: USER_DTOS.AdminLoginDto) {
    return this.adminService.adminLogin(model);
  }

  @MessagePattern('admin.forget.password')
  @UseInterceptors(ServiceExceptionFilter)
  forgetPassword(model: USER_DTOS.forgetPasswordDto) {
    return this.adminService.forgetPassword(model);
  }

  @MessagePattern('admin.reset.password')
  @UseInterceptors(ServiceExceptionFilter)
  resetPassword(model: USER_DTOS.ResetPasswordDto) {
    return this.adminService.resetPassword(model);
  }

  @MessagePattern('auth.token.verify')
  @UseInterceptors(ServiceExceptionFilter)
  tokenVerify(token: string) {
    return this.adminService.usergetById(token);
  }
}
