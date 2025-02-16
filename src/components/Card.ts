// Компонент ВЬЮ
import { ICard } from '../types';
import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';


export class Card {
  protected events: IEvents;
  protected cardId: string;
  protected cardCategory: HTMLElement;
  protected cardTitle: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected cardPrice: HTMLElement;
  protected addCartButton: HTMLElement;
  protected deleteCardButton: HTMLElement;
  protected cardIndex: HTMLElement;
  protected element: HTMLElement;

  Category: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		'хард-скил': 'card__category_hard',
		'дополнительное': 'card__category_additional',
		'другое': 'card__category_other',
		'кнопка': 'card__category_button',
	};


  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.element = cloneTemplate(template);
    this.cardCategory = this.element.querySelector('.card__category');
    this.cardTitle = this.element.querySelector('.card__title');
    this.cardImage = this.element.querySelector('.card__image');
    this.cardText = this.element.querySelector('.card__text');
    this.cardPrice = this.element.querySelector('.card__price');
    this.addCartButton = this.element.querySelector('.card__button');
    this.deleteCardButton = this.element.querySelector('.basket__item-delete');
    this.cardIndex = this.element.querySelector('.basket__item-index');
   
    this.element.addEventListener('click', () => {
      this.events.emit('card:select', { card: this});
    });
  }

  render(cardData: Partial<ICard>) {
    const {price, ...otherCardData} = cardData;
    if(!price) {
      this.price = 'Бесценно';
    } else {
      this.price = `${price} Синапсов`;
    };
    Object.assign(this, otherCardData);
    return this.element;
  }

  set price(price: string) {
      this.cardPrice.textContent = price;
  }

  set text(description: string) {
    this.cardText.textContent = description;
  }

  set image(imageLink: string) {
    this.cardImage.src = require(`../images${imageLink}`);
  }

  set title (title: string) {
    this.cardTitle.textContent = title;
    this.cardImage.alt = title;
  }

  set category (category: string) {    
    this.cardCategory.textContent = category;
  }

  set id (id: string) {
    this.cardId = id;
  }

  get id() {
		return this.cardId;
	}

  deleteCard() {
		this.element.remove();
		this.element = null;
	} 
}