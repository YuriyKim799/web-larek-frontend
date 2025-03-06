
import { OrderForm } from '../../types';
import { EventEmitter } from '../base/Events';
import { Form } from './Form';

export class Order extends Form<OrderForm> {
  protected _paymentCard: HTMLButtonElement;
  protected _paymentCash: HTMLButtonElement;


  constructor(events: EventEmitter, container: HTMLFormElement){
    super(events, container);

    this._paymentCard = this.container.querySelector('.button_alt[name=card]');
    this._paymentCash = this.container.querySelector('.button_alt[name=cash]');

    this._paymentCard.addEventListener('click', () => {
      this.payment = 'online';  
      this.onInputChange('payment','card');
    });

    this._paymentCash.addEventListener('click', () => {
      this.payment = 'cash';  
      this.onInputChange('payment','cash');
    });
  };

  set payment(value: string) {
    this._paymentCard.classList.toggle('button_alt-active', value === 'online');
    this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
  };

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}