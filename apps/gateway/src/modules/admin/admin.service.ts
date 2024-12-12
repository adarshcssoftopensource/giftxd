import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AdminService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
  ) {}

  createAdmin(model: USER_DTOS.AdminCreateDto) {
    model.token = this.request.headers['x-access-token'];
    return this.authClientService.send('admin.create', model);
  }

  adminLogin(model: USER_DTOS.AdminLoginDto) {
    return this.authClientService.send('admin.login', model);
  }
  forgetPassword(model: USER_DTOS.forgetPasswordDto) {
    return this.authClientService.send('admin.forget.password', model);
  }
  resetPassword(model: USER_DTOS.ResetPasswordDto) {
    return this.authClientService.send('admin.reset.password', model);
  }
  tokenVerify(token: string) {
    return this.authClientService.send('auth.token.verify', token);
  }
}
