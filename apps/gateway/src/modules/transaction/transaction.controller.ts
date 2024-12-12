import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { TransactionService } from './transaction.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { TRANSACTION_DTOS } from '@app/dto';

@Controller('transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(private TransactionService: TransactionService) {}

  @Post('/create')
  @ResponseMessage('transaction created')
  @UseInterceptors(ResponseInterceptor)
  @ApiExcludeEndpoint()
  async createTransaction(@Body() dto: TRANSACTION_DTOS.TransactionCreateDto) {
    return this.TransactionService.createTransaction(dto);
  }

  @Get('/all')
  @ResponseMessage('data fetched')
  @UseInterceptors(ResponseInterceptor)
  async filterTransaction(
    @Query() query: TRANSACTION_DTOS.FilterTransactionDto,
  ) {
    return this.TransactionService.getAllTransaction(query);
  }
}
