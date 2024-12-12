import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './languages.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('languages')
@ApiTags('languages-list')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  getAllLanguages(): any[] {
    return this.languageService.getAllLanguages();
  }
}
