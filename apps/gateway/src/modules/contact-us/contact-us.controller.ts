import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseInterceptors,
    Query,
  } from '@nestjs/common';
  import { ContactUsService } from './contact-us.service';
  import { ResponseInterceptor, ResponseMessage } from '@app/common';
  import { ApiQuery, ApiTags } from '@nestjs/swagger';
  import {
    ContactMessageDto,
    ContactMessageListDto,
    CreateContactMessageDto,
  } from '@app/dto/home/contact-us.dto';
  
  @Controller('contact-us')
  @ApiTags('contact-us')
  export class ContactUsController {
    constructor(private readonly contactUsService: ContactUsService) {}
  
    @Post('messages/')
    @UseInterceptors(ResponseInterceptor)
    @ResponseMessage('Contact us message recorded successfully')
    async createMessage(@Body() createMessage: CreateContactMessageDto): Promise<ContactMessageDto> {
      return await this.contactUsService.createMessage(createMessage);
    }
  
    @Get('messages/')
    @ApiQuery({
      name: 'email', 
      type: String,
      required: false
    })
    @ApiQuery({
      name: 'topic', 
      type: String,
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
    @ResponseMessage('Contact us messages retrieved successfully')
    async getContactMessages(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('email') email: string = "",
      @Query('topic') topic: string = "",
    ): Promise<ContactMessageListDto[]> {
      const messages = await this.contactUsService.getContactMessages(page, limit, email, topic);
      return messages.map(({ id, topic, email_address }) => ({ id: id, topic, email_address }));
    }
  
    @Get('messages/:id')
    @ResponseMessage('Contact us message detail retrieved successfully')
    @UseInterceptors(ResponseInterceptor)
    async getContactMessageDetails(@Param('id') id: string): Promise<ContactMessageDto> {
      const message = await this.contactUsService.getContactMessageDetails(id);
      return message;
    }
  
    @Delete('messages/:id')
    @UseInterceptors(ResponseInterceptor)
    @ResponseMessage('Contact us message deleted successfully')
    async deleteContactMessage(@Param('id') id: string): Promise<any> {
      await this.contactUsService.deleteContactMessage(id);
      return {};
    }
  }
  