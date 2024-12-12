import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  Query,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  MessageResponseInterceptor,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { UserProfileService } from './profiles.service';
import { ApiExcludeController, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  UserProfileCreateDto,
  UserProfileUpdateDto,
} from '@app/dto/users/profile.dto';

@Controller('profiles')
@ApiTags('my-profile')
@ApiExcludeController()
export class UserProfileController {
  constructor(private profileService: UserProfileService) {}

  @Post('/create')
  @ResponseMessage('Profile created')
  @UseInterceptors(ResponseInterceptor)
  createProfile(@Body() dto: UserProfileCreateDto) {
    return this.profileService.createProfile(dto);
  }

  @Get('/get')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  async getProfiles() {
    return this.profileService.getProfiles();
  }

  @Get('/get/:id')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the user profile',
  })
  getProfileById(@Param('id') id: string) {
    return this.profileService.getProfileById(id);
  }

  @Put('/update/:id')
  @ResponseMessage('Profile updated')
  @UseInterceptors(ResponseInterceptor)
  updateProfile(
    @Param('id') id: string,
    @Body() updateModel: UserProfileUpdateDto,
  ) {
    return this.profileService.updateProfile(id, updateModel);
  }

  @Delete('/delete/:id')
  @HttpCode(200)
  @ResponseMessage('Profile deleted')
  @UseInterceptors(ResponseInterceptor)
  deleteProfile(@Param('id') id: string) {
    return this.profileService.deleteProfile(id);
  }
}
