import { ensureElement } from '../utils/utils';
import { View } from './base/Component';
import { EventEmitter } from './base/events';

interface IForm {
  valid: boolean,
  errors: string[]
}

export class Form<T> extends View<IForm> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(events: EventEmitter, protected container:HTMLFormElement ) {
    super(events,container);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors',this.container);

    this.container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit',(event)=> {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`)
    })
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value
    });
  };

  set valid(value: boolean) {
    this._submit.disabled = !value;
  };

  set errors(value: string) {
    this.setText(this._errors, value);
  };

  render(state: Partial<T> & IForm) {
    const {valid, errors, ...inputs} = state;
    super.render({valid,errors});
    Object.assign(this, inputs);
    return this.container;
  }

 }