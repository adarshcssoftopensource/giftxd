import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseInterceptors,
    Query,
    BadRequestException,
    HttpCode,
    UseGuards,
    UploadedFile,
  } from '@nestjs/common';
import { AcceptedCardService } from './accepted_cards.service';
import { AuthGuards, FileToBodyInterceptor, ResponseInterceptor, ResponseMessage } from '@app/common';
import { ApiConsumes, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SortOrderString } from '@app/schemas/home/accepted_cards.schema';
import { AcceptedCardDto, CreateAcceptedCardDto, UpdateAcceptedCardDto } from '@app/dto/home/accepted.cards.dto';
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
  
@Controller('accepted-cards')
@ApiTags('accepted-cards')
export class AcceptedCardsController {
    constructor(private readonly acceptedCardsService: AcceptedCardService) {}

    @Post()
    @HttpCode(201)
    @ApiHeader(access_token_payload)
    @UseGuards(AuthGuards.JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: imageFileFilter
    }), FileToBodyInterceptor, ResponseInterceptor)
    @UseInterceptors(ResponseInterceptor)
    @ResponseMessage('Accepted cards created successfully')
    async createAcceptedCards(@Body() data: CreateAcceptedCardDto): Promise<AcceptedCardDto> {
        console.log(data);
        return this.acceptedCardsService.createAcceptedCard(data);
    }

    @Get()
    @ApiQuery({
        name: 'query', 
        type: String,
        required: false
    })
    @ApiQuery({
        name: 'sortBy', 
        enum: SortOrderString,
        required: false
    })
    @ApiQuery({
        name: 'page', 
        type: Number,
        required: false
    })
    @ApiQuery({
        name: 'limit', 
        type: Number,
        required: false
    })
    @UseInterceptors(ResponseInterceptor)
    @ResponseMessage('Accepted cards fetched successfully')
    async getAcceptedCards(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('query') query: string = "",
        @Query('sortBy') sortBy: SortOrderString = SortOrderString.ASCENDING,
    ): Promise<AcceptedCardDto[]>{
        if (sortBy !== SortOrderString.ASCENDING && sortBy !== SortOrderString.DESCENDING) {
            throw new BadRequestException('Invalid sortBy parameter. sortBy must be either `ascending` or `descending`.');
        }

        return await this.acceptedCardsService.getAcceptedCards(limit, page, query, sortBy);
    }

    @Patch(':cardId')
    @ApiHeader(access_token_payload)
    @UseGuards(AuthGuards.JwtAuthGuard)
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: imageFileFilter
    }), FileToBodyInterceptor)
    @UseInterceptors(ResponseInterceptor)
    @ResponseMessage('Accepted card update successful')
    async updateAcceptedCard(
        @Body() updateAcceptedCardDto: UpdateAcceptedCardDto,
    ) {
        return await this.acceptedCardsService.updateAcceptedCard(
            updateAcceptedCardDto,
        );
    }

    @Delete(':cardId')
    @ApiHeader(access_token_payload)
    @UseGuards(AuthGuards.JwtAuthGuard)
    @UseInterceptors(ResponseInterceptor)
    @ResponseMessage('Accepted card deletion successful')
    async deleteAcceptedCard(@Param('cardId') cardId: string) {
        return await this.acceptedCardsService.deleteAcceptedCard(cardId);
    }
}
