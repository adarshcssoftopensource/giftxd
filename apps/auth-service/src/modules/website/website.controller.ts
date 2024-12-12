import { Controller } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { MessagePattern } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Controller('website')
export class WebsiteController {
  constructor(private readonly webservice: WebsiteService) {}

  @MessagePattern('website.user.signup')
  signup_user(model: USER_DTOS.WebSiteUserSignupDto) {
    return this.webservice.signup_user(model);
  }

  @MessagePattern('website.user.create')
  create_user(model: USER_DTOS.CreateUserDto) {
    return this.webservice.create_user(model);
  }

  @MessagePattern('website.user.login')
  login_user(model: USER_DTOS.WebSiteUserLoginDto) {
    return this.webservice.login_user(model);
  }

  @MessagePattern('website.user.forgetPassword')
  forgetPassword(model: USER_DTOS.WebsiteUserForgetPasswordDto) {
    return this.webservice.forgetPassword(model);
  }

  @MessagePattern('website.user.changePassword')
  changePassword(model: USER_DTOS.WebsiteChangePassword & { id: string }) {
    return this.webservice.changePassword(model.id, model);
  }
  @MessagePattern('website.user.resetPassword')
  resetPassword(model: USER_DTOS.WebsiteUserResetPasswordDto & { id: string }) {
    return this.webservice.resetPassword(model);
  }

  @MessagePattern('website.user.profile')
  userProfile(token: string) {
    return this.webservice.getUserProfile(token);
  }

  @MessagePattern('website.user.profile.upload')
  userProfilePicUpload(data: { token: string; file: Express.Multer.File }) {
    return this.webservice.uploadProfilePic(data);
  }

  @MessagePattern('website.user.count')
  getUserCount() {
    return this.webservice.getUserCount();
  }

  @MessagePattern('website.user.tokenVerify')
  tokenVerify({ token, secret }) {
    return this.webservice.tokenVerify(token, secret);
  }

  @MessagePattern('website.user.verify-email')
  verifyEmail(model: { token: string; otp: string }) {
    return this.webservice.verifyEmailOtp(model);
  }

  @MessagePattern('website.enableTwoFA')
  enableTwoFA(model: { token: string }) {
    return this.webservice.enableTwoFA(model);
  }

  @MessagePattern('website.verifyTwoFA')
  verifyTwoFA(model: { token: string; appSecret: string }) {
    return this.webservice.verifyTwoFA(model);
  }

  @MessagePattern('website.disableTwoFA')
  disableTwoFA(model: { token: string; appSecret: string }) {
    return this.webservice.disableTwoFA(model);
  }
  @MessagePattern('website.TwoFASettings')
  TwoFASettings(model: USER_DTOS.CreateTwoSettings) {
    return this.webservice.TwoFASettings(model);
  }
}
