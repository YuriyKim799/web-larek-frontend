import { ICardsData, ICard } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardsData {
  protected _cards: ICard[];
  protected _preview: string | null;
  protected events: IEvents
  
  constructor(events: IEvents) {
    this.events = events;
  }

  set cards(cards: ICard[]) {
    this._cards = cards;
  }

  get products() {
    return this._cards;
  }

  getCard(cardId: string) {
    return this._cards.find((item) => item._id === cardId)
  }

  set prewiew(cardId: string) {
    if(!cardId) {
      this._preview = null;
      return;
    }
    const selectedCard = this.getCard(cardId);
    if(selectedCard) {
      this._preview = cardId;
      this.events.emit('card:selected');
    }
  }
}