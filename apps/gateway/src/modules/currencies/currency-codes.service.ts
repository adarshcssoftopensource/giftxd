// currency-codes.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CurrencyCodesService {
  private readonly apiKey = 'a343a677a0ffaba56761ee1a0d42351d';
  private readonly baseUrl = 'https://zerosack.org/marketplace/apis/v1';

  async getCurrencyCodes(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/currency_codes`, {
        params: {
          key: this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
