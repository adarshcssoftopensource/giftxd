import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoDocument } from '@app/schemas/home/cryptos.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class CryptoService {
  private readonly apiKey: string = process.env.COIN_MARKET_API_KEY;
  private readonly baseUrl: string = process.env.COIN_MARKET_BASE_URL;

  constructor(
    @InjectModel('Crypto') private cryptoModel: Model<CryptoDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const listings = await this.getListingsLatest();
    await this.updateCryptoData(listings);
  }

  async getListingsLatest() {
    try {
      console.log('RUNNING_EVERY_MINUTE');
      const response = await axios.get(this.baseUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
        },
      });
      return response.data.data
        .filter(
          (crypto) =>
            crypto.symbol === 'BTC' ||
            crypto.symbol === 'USDT' ||
            crypto.symbol === 'USDC',
        )
        .map((crypto) => ({
          symbol: crypto.symbol,
          price: crypto.quote.USD.price,
          lastUpdated: new Date(crypto.last_updated),
        }));
    } catch (error) {
      console.log('COIN_MARKING_API_NOT_WORKING');
      console.error(error);
    }
  }

  async updateCryptoData(cryptoData: any[]) {
    for (const data of cryptoData) {
      const newCrypto = new this.cryptoModel(data);
      await newCrypto.save();
    }
  }

  async getCryptoData() {
    const symbols = ['BTC', 'USDT', 'USDC'];
    const data = {};
    const result = await this.cryptoModel.aggregate([
      {
        $match: {
          lastUpdated: { $gte: new Date(Date.now() - 86400000) },
        },
      },
      { $sort: { lastUpdated: -1 } },
      {
        $group: {
          _id: '$symbol',
          latestData: { $first: '$$ROOT' },
          data24hrsAgo: { $last: '$$ROOT' },
        },
      },
    ]);

    const finalData = result.map((crypto) => {
      const { latestData, data24hrsAgo } = crypto;
      let percentageChange = 0;
      if (data24hrsAgo) {
        percentageChange =
          ((latestData.price - data24hrsAgo.price) / data24hrsAgo.price) * 100;
      }
      return {
        symbol: crypto._id,
        price: latestData.price,
        percentageChange,
      };
    });
    return finalData;
  }
  async getLatestCryptoPrice(symbol: string): Promise<number | undefined> {
    try {
      const latestData = await this.cryptoModel.aggregate([
        {
          $match: { symbol: symbol },
        },
        {
          $sort: { lastUpdated: -1 },
        },
        {
          $limit: 1,
        },
        {
          $project: {
            _id: 0,
            price: '$price',
          },
        },
      ]);

      return latestData[0]?.price;
    } catch (error) {
      console.error('Error fetching latest crypto price:', error);
      throw error;
    }
  }
}
