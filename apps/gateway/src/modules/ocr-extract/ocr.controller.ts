import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('ocr')
@ApiTags('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('/extract-text')
  @UseInterceptors(FileInterceptor('image'))
  async extractText(@UploadedFile() file): Promise<any> {
    return this.ocrService.extractTextFromImage(file);
  }
}
