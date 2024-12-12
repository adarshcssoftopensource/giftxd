import { ClientProxy } from '@nestjs/microservices';
import { Injectable, Inject } from '@nestjs/common';
import { USER_DTOS } from '@app/dto';
import { lastValueFrom } from 'rxjs';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WebsiteService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
    @Inject('WALLET_CLIENT_SERVICE')
    private readonly walletClientService: ClientProxy,
    @Inject(REQUEST) private request: Request,
    private jwt: JwtService,
  ) {}

  async create_user(model: USER_DTOS.CreateUserDto) {
    try {
      const response = await lastValueFrom(
        this.authClientService.send('website.user.create', model),
      );
      if (response['token']) {
        const decodeData = this.jwt.decode(response['token']);
        if (decodeData['_id']) {
          await lastValueFrom(
            this.walletClientService.send('wallet.create', decodeData['_id']),
          );
          return response;
        } else {
          return response;
        }
      } else {
        return response;
      }
    } catch (e) {
      console.log('error', JSON.stringify(e, null, 2));
    }
  }

  async signup_web_user(model: USER_DTOS.WebSiteUserSignupDto) {
    return this.authClientService.send('website.user.signup', model);
  }

  async login_user(model: USER_DTOS.WebSiteUserLoginDto) {
    const response = await lastValueFrom(
      this.authClientService.send('website.user.login', model),
    );
    if (response['_id']) {
      this.walletClientService.send('wallet.getWallet', response['_id']);
    }
    return response;
  }
  forgetPassword(model: USER_DTOS.WebsiteUserForgetPasswordDto) {
    return this.authClientService.send('website.user.forgetPassword', model);
  }
  resetPassword(model: USER_DTOS.WebsiteUserResetPasswordDto) {
    return this.authClientService.send('website.user.resetPassword', model);
  }

  fetchUserProfile() {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('website.user.profile', token);
  }

  uploadProfilePic(file: Express.Multer.File) {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('website.user.profile.upload', {
      token,
      file,
    });
  }

  changePassword(id: string, model: USER_DTOS.WebsiteChangePassword) {
    const change_pass_payload = class {
      id: string;
      new_password: string;
      old_password: string;
      constructor(m_args: USER_DTOS.WebsiteChangePassword & { id: string }) {
        this.id = m_args.id;
        this.new_password = m_args.new_password;
        this.old_password = m_args.old_password;
      }
    };
    return this.authClientService.send(
      'website.user.changePassword',
      new change_pass_payload({ id, ...model }),
    );
  }

  getUserCount() {
    return this.authClientService.send('website.user.count', {});
  }

  sendPasswordResetEmail(model: { id: string }) {
    return this.authClientService.send('website.user.passwordReset', model);
  }

  sendLoginNotificationEmail(model: { id: string }) {
    return this.authClientService.send('website.user.loginNotification', model);
  }

  tokenVerify(secret) {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('website.user.tokenVerify', {
      secret,
      token,
    });
  }

  verifyEmail(model: { otp: string }) {
    return this.authClientService.send('website.user.verify-email', model);
  }

  enableTwoFA() {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('website.enableTwoFA', {
      token,
    });
  }

  verifyTwoFA(appSecret) {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('website.verifyTwoFA', {
      token,
      appSecret,
    });
  }
  disableTwoFA(appSecret) {
    const token = this.request.headers['x-access-token'];
    return this.authClientService.send('website.disableTwoFA', {
      token,
      appSecret,
    });
  }

  twoFASettings(model: USER_DTOS.CreateTwoSettings) {
    const token = this.request.headers['x-access-token'];
    model.token = token;
    return this.authClientService.send('website.TwoFASettings', model);
  }
}
