import { ICardsData, ICard } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardsData {
  protected _cards: ICard[];
  protected events: IEvents
  
  constructor(events: IEvents) {
    this.events = events;
  }

  set cards(cards: ICard[]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  getCard(cardId: string) {
    return this._cards.find((item) => item.id === cardId)
  }

}