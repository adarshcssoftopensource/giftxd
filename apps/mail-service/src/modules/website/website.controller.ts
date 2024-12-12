import { Controller } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { MessagePattern } from '@nestjs/microservices';
import { USER_DTOS } from '@app/dto';

@Controller('mail')
export class WebsiteController {
  constructor(private readonly webservice: WebsiteService) {}

  @MessagePattern('mail.emailVerification')
  signup_user(model: USER_DTOS.EmailVerificationDto) {
    return this.webservice.sendVerificationEmail(model);
  }

  @MessagePattern('mail.loginNotification')
  login_user(model: USER_DTOS.LoginNotificationEmailDto) {
    return this.webservice.sendLoginNotificationEmail(model);
  }

  @MessagePattern('mail.passwordReset')
  forgetPassword(model: USER_DTOS.PasswordResetEmailDto) {
    return this.webservice.sendPasswordResetEmail(model);
  }
}
