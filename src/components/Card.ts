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

  setData(cardData: ICard) {
    this.cardId = cardData.id;
    this.cardCategory.textContent = cardData.category;
    this.cardTitle.textContent = cardData.title;
    this.cardImage.src = require(`../images${cardData.image}`);
    this.cardImage.alt = cardData.title;
    if(cardData.price) {
      this.cardPrice.textContent = `${cardData.price} синапсов`;
    } else {
      this.cardPrice.textContent = `Бесценно`;
    }
    
    // this.cardText.textContent = cardData.text;
  }

  get id() {
		return this.cardId;
	}

  deleteCard() {
		this.element.remove();
		this.element = null;
	} 

  render() {
		return this.element;
	}

}