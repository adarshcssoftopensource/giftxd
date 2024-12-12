import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @Inject('AUTH_CLIENT_SERVICE')
    private readonly authClientService: ClientProxy,
  ) {}

  enable2FA(user_id: string) {
    return this.authClientService.send('client.enable2FA', user_id);
  }

  disable2FA(user_id: string, token: string) {
    return this.authClientService.send('client.disable2FA', {
      id: user_id,
      token: token,
    });
  }

  verify2FA(user_id: string, token: string) {
    return this.authClientService.send('client.verify2FA', {
      id: user_id,
      token: token,
    });
  }
}
