import {
  Controller,
  Post,
  Get,
  Patch,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Param,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TextractService } from './textract.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { HOME_DTOS } from '@app/dto';
import { HOME_MODELS } from '@app/schemas';

@Controller('textract')
@ApiTags('textract')
export class TextractController {
  constructor(private readonly textractService: TextractService) {}

  @Post('extract-text')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async extractText(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ createCardDto: HOME_DTOS.CreateCardDto; cardId?: string }> {
    try {
      if (!files || files.length === 0) {
        throw new HttpException(
          'Files are required (front image, back image, receipt)',
          HttpStatus.BAD_REQUEST,
        );
      }

      const buffers = files.map((file) => file.buffer);

      const { frontText, backText, receiptText } =
        await this.textractService.extractTextFromImages(buffers);

      const response = await this.textractService.parseAndMapCardDetails(
        frontText,
        backText,
        receiptText,
      );

      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  @ApiExcludeEndpoint()
  async getById(@Param('id') id: string): Promise<HOME_MODELS.Card> {
    return this.textractService.getById(id);
  }
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: HOME_DTOS.UpdateCardDto,
  ): Promise<HOME_MODELS.Card> {
    return this.textractService.update(id, updateCardDto);
  }
}
