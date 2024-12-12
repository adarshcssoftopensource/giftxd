import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpCode,
  Param,
  Get,
  Query,
  UseGuards,
  UploadedFile,
  Put,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';
import { WebsiteService } from './website.service';

import {
  ResponseInterceptor,
  ResponseMessage,
  AuthGuards,
  MessageResponseInterceptor,
  TwoFaGuards,
} from '@app/common';
import { access_token_payload } from '@app/common/global/swagger';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i)) {
    return callback(
      new BadRequestException(
        'Only JPG, JPEG, PNG, GIF, BMP, SVG, or WebP files are allowed',
      ),
      false,
    );
  }
  callback(null, true);
};

@Controller('website')
@ApiTags('website')
export class WebsiteController {
  constructor(private readonly webService: WebsiteService) {}

  @Post('/user/signup')
  @UseInterceptors(ResponseInterceptor)
  signupUser(@Body() model: USER_DTOS.WebSiteUserSignupDto) {
    return this.webService.signup_web_user(model);
  }

  @Post('/user/create')
  @UseInterceptors(ResponseInterceptor)
  createUser(@Body() model: USER_DTOS.CreateUserDto) {
    return this.webService.create_user(model);
  }

  @Post('/user/login')
  @HttpCode(200)
  @UseInterceptors(ResponseInterceptor)
  loginUser(@Body() model: USER_DTOS.WebSiteUserLoginDto) {
    return this.webService.login_user(model);
  }

  @Post('/user/forgetPassword')
  @HttpCode(200)
  @ResponseMessage('email sent')
  @UseInterceptors(ResponseInterceptor)
  forgetPassword(@Body() model: USER_DTOS.WebsiteUserForgetPasswordDto) {
    return this.webService.forgetPassword(model);
  }

  @Post('/user/resetPassword')
  @HttpCode(200)
  @ResponseMessage('email sent')
  @UseInterceptors(ResponseInterceptor)
  resetPassword(@Body() model: USER_DTOS.WebsiteUserResetPasswordDto) {
    return this.webService.resetPassword(model);
  }

  @Post('/user/changePassword/:id')
  @HttpCode(200)
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  changePassword(
    @Param('id') id: string,
    @Body() model: USER_DTOS.WebsiteChangePassword,
  ) {
    return this.webService.changePassword(id, model);
  }

  @Get('/user/profile')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async fetchUserProfile() {
    return this.webService.fetchUserProfile();
  }

  @Put('/user/profile/upload')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
    }),
    ResponseInterceptor,
  )
  @UseInterceptors(ResponseInterceptor)
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File) {
    return this.webService.uploadProfilePic(file);
  }

  @Get('/user/count')
  @HttpCode(200)
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  async getUserCount() {
    return this.webService.getUserCount();
  }

  @Get('/verify/token')
  @ApiExcludeEndpoint()
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @UseInterceptors(ResponseInterceptor)
  async tokenVerify(@Query('secret') secret: string) {
    return this.webService.tokenVerify(secret);
  }

  @Post('/verify-email')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  async verifyEmail(@Query('otp') otp: string) {
    return this.webService.verifyEmail({ otp });
  }

  @Post('/enableTwoFA')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(TwoFaGuards.twoFaAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async enableTwoFA() {
    return this.webService.enableTwoFA();
  }

  @Post('/verifyTwoFA')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(TwoFaGuards.twoFaAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async verifyTwoFA(@Query('appSecret') appSecret: string) {
    return this.webService.verifyTwoFA(appSecret);
  }

  @Post('/disableTwoFA')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @UseGuards(TwoFaGuards.twoFaAuthGuard)
  @UseInterceptors(MessageResponseInterceptor)
  async disableTwoFA(@Query('appSecret') appSecret: string) {
    return this.webService.disableTwoFA(appSecret);
  }
  @Post('/twoFASettings')
  @HttpCode(200)
  @ApiHeader(access_token_payload)
  @ResponseMessage('settings updated')
  @UseGuards(TwoFaGuards.twoFaAuthGuard)
  async twoFASettings(@Body() model: USER_DTOS.CreateTwoSettings) {
    return this.webService.twoFASettings(model);
  }
}
