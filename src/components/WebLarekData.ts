import { IBasket, ICard, IOrder, OrderForm, PaymentMethod } from '../types';
import { IEvents } from './base/events';

export class AppData {
  items: ICard[] = [];
  previewCard: ICard = null;
  basket: IBasket = { 
    cards: [],
    total: 0
  };

  order: IOrder = {
    payment: 'card',
    email: '',
    phone: '',
    address: '',
    total: 0,
    cards: []
  }

  formErrors: Partial<Record<keyof OrderForm, string>> = {};

  
  constructor(protected events: IEvents) {}

  setCards(cards: ICard[]) {
    this.items = cards;
    this.events.emit('items:change', this.items);
  }

  setPreview(card: ICard) {
    this.previewCard = card;
    this.events.emit('card:select', this.previewCard);
  }

  inBasket(card: ICard) {
    return this.basket.cards.includes(card.id)
  }
  
  addToBasket(card: ICard) {
    this.basket.cards.push(card.id);
    this.basket.total += card.price;
    this.events.emit('basket:change', this.basket);
  }

  removeFromBasket(card: ICard) {
    this.basket.cards = this.basket.cards.filter(id => id !== card.id);
    this.basket.total -= card.price;
    this.events.emit('basket:change', this.basket);
  }

  clearBasket() {
    this.basket.cards = [];
    this.basket.total = 0;
    this.events.emit('basket:change', this.basket);
  }

  setPayMethod(method: PaymentMethod) {
    this.order.payment = method;
  }

  setOrderField(field: keyof OrderForm, value: string) {
    if(field === 'payment') {
      this.setPayMethod(value as PaymentMethod);
    } else {
      this.order[field] = value;
    }

    if(this.order.payment && this.validateOrder()) {
      this.order.total = this.basket.total;
      this.order.cards = this.basket.cards;
      this.events.emit('order:ready', this.order);
    }
  } 

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if(!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    } 
    if(!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if(!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if(!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length = 0;
  }

}