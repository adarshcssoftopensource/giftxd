import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { MailService } from '../../mail-service';
import { ConfigService } from 'aws-sdk';

@Module({
  imports: [],
  controllers: [WebsiteController],
  providers: [WebsiteService, MailService, ConfigService],
})
export class WebsiteModule { }
