import { CryptoDocument } from '@app/schemas/home/cryptos.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

@Injectable()
export class CoinMakerService {
  constructor(
    @InjectModel('Crypto') private cryptoModel: Model<CryptoDocument>,
  ) {}
  async startCoinMakerLoop() {
    while (true) {
      try {
        const listings = await this.coinMaker();
        await this.updateCryptoData(listings);
        await this.sleep(60000); 
      } catch (error) {
        console.error('Error in coin maker loop:', error);
      }
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async coinMaker(): Promise<any[]> {
    const options = {
      method: 'GET',
      url: process.env.COIN_MARKET_BASE_URL,
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY,
      },
    };
    try {
      const response = await axios(options);
      const filteredCryptos = response.data.data
        .filter(
          (crypto) =>
            crypto.symbol === 'BTC' ||
            crypto.symbol === 'USDT' ||
            crypto.symbol === 'USDC',
        )
        .map((crypto) => ({
          symbol: crypto.symbol,
          price: crypto.quote.USD.price,
          UpdatedAt: new Date(crypto.last_updated),
        }));

      if (filteredCryptos.length > 0) {
        console.log('Mapped Cryptos:', filteredCryptos);
        return filteredCryptos;
      } else {
        throw new Error('cryptocurrencies not found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async updateCryptoData(cryptoData: any[]) {
    for (const data of cryptoData) {
      await this.cryptoModel.findOneAndUpdate({ symbol: data.symbol }, data, {
        upsert: true,
      });
    }
  }
}
