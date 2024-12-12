import {
  Controller,
  UseInterceptors,
  UploadedFiles,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags, ApiBody, ApiHeader, ApiExcludeEndpoint } from '@nestjs/swagger';
import { UserCardService } from './user-card.service';
import {
  AuthGuards,
  memoryUploader,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { ORDER_DTOS } from '@app/dto';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('user-card')
@ApiTags('user-card')
export class UserCardController {
  constructor(private cardService: UserCardService) {}

  @Post('/uploadCard')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'front_side_image', maxCount: 1 },
        { name: 'back_side_image', maxCount: 1 },
        { name: 'receipt_front_side', maxCount: 1 },
        { name: 'receipt_back_side', maxCount: 1 },
      ],
      { storage: memoryUploader() },
    ),
  )
  @UseInterceptors(ResponseInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ORDER_DTOS.CreateUserCardFileDto,
    required: false,
  })
  @ResponseMessage('card detail upload')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  uploadCard(
    @UploadedFiles() files: any,
    @Body() model: ORDER_DTOS.CreateUserCardBodyDto,
  ) {
    return this.cardService.uploadCard(files, model);
  }

  @Get('/getUserCard')
  @UseInterceptors(ResponseInterceptor)
  @ResponseMessage('card detail fetched')
  @ApiHeader(access_token_payload)
  @UseGuards(AuthGuards.JwtAuthGuard)
  @ApiExcludeEndpoint()
  getUserCards(@Query() query: ORDER_DTOS.GetUserCardDto) {
    return this.cardService.getUserCards(query);
  }
}
