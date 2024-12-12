import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { TwoFactorAuthService } from './two.factor.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { Client2FA_DTO } from '@app/dto/users';

@Controller('2fa')
@ApiTags('2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Get('enable/:user_id')
  @ResponseMessage('2FA enabled successfully')
  @UseInterceptors(ResponseInterceptor)
  async enable2FA(@Param('user_id') user_id: string) {
    return this.twoFactorAuthService.enable2FA(user_id);
  }

  @Post('verify/:user_id')
  @ResponseMessage('2FA verification successful')
  @UseInterceptors(ResponseInterceptor)
  async verify2FA(
    @Param('user_id') user_id: string,
    @Body() reqBody: Client2FA_DTO,
  ) {
    return this.twoFactorAuthService.verify2FA(user_id, reqBody.token);
  }

  @Post('disable/:user_id')
  @ResponseMessage('2FA disabled successfully')
  @UseInterceptors(ResponseInterceptor)
  async disable2FA(
    @Param('user_id') user_id: string,
    @Body() reqBody: Client2FA_DTO,
  ) {
    return this.twoFactorAuthService.disable2FA(user_id, reqBody.token);
  }
}
