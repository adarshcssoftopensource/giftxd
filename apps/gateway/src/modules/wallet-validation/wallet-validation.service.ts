// wallet-validation.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WalletValidationService {
  async validateWallet(address: string, network: string): Promise<any> {
    const options = {
      method: 'GET',
      url: `https://crypto-address-validation-api.p.rapidapi.com/addresses/validate/`,
      params: {
        network,
        address,
      },
      headers: {
        'X-RapidAPI-Key': 'c828162aa5msh053e5dd0f0fcca2p11aef6jsn7026c1b8a72f',
        'X-RapidAPI-Host': 'crypto-address-validation-api.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error('Error making request:', error.message);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      throw error;
    }
  }
}
