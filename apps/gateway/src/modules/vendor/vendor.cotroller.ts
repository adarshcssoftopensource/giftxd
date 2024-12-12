import {
  Controller,
  Body,
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  Param,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { VendorService } from './vendor.service';
import { ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { USER_DTOS } from '@app/dto';
import {
  memoryUploader,
  ResponseInterceptor,
  ResponseMessage,
} from '@app/common';
import { access_token_payload } from '@app/common/global/swagger';

@Controller('vendor')
@ApiTags('vendor')
export class VendorController {
  constructor(private vendorService: VendorService) {}

  @Post('/create')
  @ApiHeader(access_token_payload)
  @ResponseMessage('vendor created')
  @UseInterceptors(ResponseInterceptor)
  createVendor() {
    // let file;
    // if (files.ResidencyProof) {
    //   file = files.ResidencyProof[0];
    // }
    return this.vendorService.createVendor();
  }

  @Get('/getById')
  @ResponseMessage('data fetch')
  @UseInterceptors(ResponseInterceptor)
  getByIdVendor(@Query('id') id: string) {
    return this.vendorService.getByIdVendor(id);
  }
}
