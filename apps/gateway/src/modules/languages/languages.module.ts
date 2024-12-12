import { Module } from '@nestjs/common';
import { LanguageController } from './languages.controller';
import { LanguageService } from './languages.service';

@Module({
  providers: [LanguageService],
  controllers: [LanguageController],
})
export class LanguagesModule {}
