import { Injectable } from '@nestjs/common';

@Injectable()
export class GiftCardService {
  private giftCards = [
    { id: 1, name: 'Apple', icon: 'apple.svg' },
    { id: 2, name: 'Amazon', icon: 'amazon.svg' },
    { id: 3, name: 'Google Play', icon: 'gplay.svg' },
    { id: 4, name: 'Steam Wallet', icon: 'steam.svg' },
    { id: 5, name: 'Razer Gold', icon: 'razer.svg' },
  ];

  getGiftCards(query?: string, sortBy?: 'asc' | 'desc'): { id: number; name: string; icon: string }[] {
    let filteredCards = this.giftCards;

    // Filter based on query (if present and longer than 2 characters)
    if (query && query.length >= 3) {
      filteredCards = this.filterAndSortGiftCards(query, sortBy);
    }

    return filteredCards;
  }

  private filterAndSortGiftCards(query: string, sortBy?: 'asc' | 'desc'): { id: number; name: string; icon: string }[] {
    const filteredCards = this.giftCards.filter(card =>
      card.name.toLowerCase().startsWith(query.toLowerCase())
    );

    if (sortBy) {
      return this.sortGiftCards(filteredCards, sortBy);
    }

    return filteredCards;
  }

  private sortGiftCards(cards: { id: number; name: string; icon: string }[], order: 'asc' | 'desc'): { id: number; name: string; icon: string }[] {
    return cards.sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }
}
