import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GiftCardService } from './giftcard.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('gift-cards')
@ApiTags('gift-cards')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get()
  @ApiQuery({
    name: 'query', 
    type: String,
    required: false
  })
  @ApiQuery({
    name: 'sortBy', 
    type: String,
    required: false
  })
  getGiftCards(
    @Query('query') query?: string,
    @Query('sortBy') sortBy?: string,
  ): { id: number; name: string; icon: string }[] {
    const formattedSortBy = sortBy ? sortBy.toLowerCase() : 'asc';
    
    if (formattedSortBy && formattedSortBy !== 'asc' && formattedSortBy !== 'desc') {
      throw new BadRequestException('Invalid sortBy parameter. It must be "asc" or "desc".');
    }

    return this.giftCardService.getGiftCards(query, formattedSortBy as 'asc' | 'desc');
  }
}
