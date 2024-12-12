import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpSendDto } from '@app/dto/home/otp.dto';
import { ApiTags, ApiBody, ApiHeader } from '@nestjs/swagger';
import { access_token_payload } from '@app/common/global/swagger';
import { AuthGuards } from '@app/common';

@Controller('otp')
@ApiTags('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async sendOTP(
    @Body() otpSendDto: OtpSendDto,
  ): Promise<{ status: string; acceptable_phone: boolean }> {
    const result = await this.otpService.sendOTP(otpSendDto);
    return result;
  }

  @Post('verify')
  @ApiBody({
    schema: {
      properties: {
        phoneNumber: { type: 'string' },
        otpCode: { type: 'string' },
      },
    },
  })
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otpCode') otpCode: string,
  ): Promise<{ status: string }> {
    const status = await this.otpService.verifyOTP(phoneNumber, otpCode);
    return { status };
  }
}
