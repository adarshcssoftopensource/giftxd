import axios from 'axios';

export async function getBitcoinPrice() {
  try {
    const response = await axios.get(process.env.COIN_MARKET_BASE_URL, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY,
      },
    });

    const bitcoinData = response.data.data.find(
      (crypto) => crypto.symbol === 'BTC',
    );
    const bitcoinPrice = {
      symbol: bitcoinData.symbol,
      price: bitcoinData.quote.USD.price,
      lastUpdated: new Date(bitcoinData.last_updated),
    };

    return bitcoinPrice.price;
  } catch (error) {
    console.log(error, 'from btc-price ');
  }
}
