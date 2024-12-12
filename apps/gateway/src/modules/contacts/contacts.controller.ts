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
import { ContactCardsService } from './contacts.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { HOME_DTOS } from '@app/dto';

@Controller('contactcard')
@ApiTags('contactcard')
export class ContactCardsController {
  constructor(private contactcardService: ContactCardsService) {}
  @Post('/create')
  @ResponseMessage('contactcard created')
  @UseInterceptors(ResponseInterceptor)
  createContactCard(@Body() model: HOME_DTOS.ContactCreateDto) {
    return this.contactcardService.createContactCard(model);
  }

  @Get('/get')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  async getUserCount() {
    return this.contactcardService.getContactCards();
  }

  @Get('/get/:id')
  @HttpCode(200)
  @UseInterceptors(MessageResponseInterceptor)
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the contact card',
  })
  getContactCardById(@Param('id') id: string) {
    return this.contactcardService.getContactCardById(id);
  }

  @Put('/update/:id')
  @ResponseMessage('contactcard updated')
  @UseInterceptors(ResponseInterceptor)
  updateContactCard(
    @Param('id') id: string,
    @Body() updateModel: HOME_DTOS.UpdateContactDto,
  ) {
    return this.contactcardService.updateContactCard(id, updateModel);
  }

  @Delete('/delete/:id')
  @HttpCode(200)
  @ResponseMessage('contactcard deleted')
  @UseInterceptors(ResponseInterceptor)
  deleteContactCard(@Param('id') id: string) {
    return this.contactcardService.deleteContactCard(id);
  }
}
