import { cloneTemplate, createElement } from '../utils/utils';
import { View } from './base/Component';
import { EventEmitter } from './base/events';

interface IBasketView {
  cards: HTMLElement[],
  total: number
}

export class Basket extends View<IBasketView> {
  static template = document.querySelector('#basket') as HTMLTemplateElement;

  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(events: EventEmitter) {
    super(events, cloneTemplate(Basket.template));

    this._list = this.container.querySelector('.basket__list');
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');

    this._button.addEventListener('click', () => {
      events.emit('order:open');
    });
    this.cards = []
  }
 
  set cards(items: HTMLElement[]) {
    if(items.length) {
      this._list.replaceChildren(...items);
      this._button.removeAttribute('disabled');
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
      this._button.setAttribute('disabled', 'disabled');
    }
  };

  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }
} 