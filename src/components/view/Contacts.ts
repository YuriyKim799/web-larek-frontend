import { OrderForm } from '../../types';
import { Form } from './Form';


export class Contacts extends Form<OrderForm> {
  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  };

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
};