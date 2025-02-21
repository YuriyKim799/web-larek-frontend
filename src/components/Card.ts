// Компонент ВЬЮ
import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export class Card extends Component<ICard>{
  protected _cardId: string;
  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardDescription: HTMLElement;
  protected _cardPrice: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _cardIndex: HTMLElement;

  Category: { [key: string]: string } = {
		'софт-скил': 'card__category_soft',
		'хард-скил': 'card__category_hard',
		'дополнительное': 'card__category_additional',
		'другое': 'card__category_other',
		'кнопка': 'card__category_button',
	};

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this._cardTitle = ensureElement<HTMLElement>('.card__title', container);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', container);
    this._cardCategory = container.querySelector('.card__category');
    this._cardImage = container.querySelector('.card__image');
    this._cardDescription = container.querySelector('.card__text');
    this._button = container.querySelector('.card__button');
    this._cardIndex = container.querySelector('.basket__item-index');
   
    if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
  }

  set price(price: number | null) {
    this.setText(
			this._cardPrice,
			price ? `${price.toString()} синапсов` : 'Бесценно');
		if (price === null && this._button) {
			this._button.disabled = true;
		}
  }

  set description(description: string) {
    this.setText(this._cardDescription, description);
  }

  set title(title: string) {
    this.setText(this._cardTitle, title);
  }

  get title(): string {
    return this._cardTitle.textContent || '';
  }

  set image(src: string) {
    this.setImage(this._cardImage, src, this.title);
  }

  set category(category: string) {    
    this.setText(this._cardCategory, category);
    this.setColorCategory(this._cardCategory, this.Category[category]);
  }

  set id (id: string) {
    this._cardId = id;
  }

  get id(): string {
		return this._cardId || '';
	}

  set button(btnText: string) {
		this.setText(this._button, btnText);
	}

  set cartItemIndex(idx: string) {
		this._cardIndex.textContent = idx;
	}

}