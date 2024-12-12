import { Injectable } from '@nestjs/common';

const ISO6391 = require('iso-639-1');

@Injectable()
export class LanguageService {
  getAllLanguages(): any[] {
    return ISO6391.getAllNames().map((name, index) => {
      return { name, code: ISO6391.getAllCodes()[index] };
    });
  }
}
