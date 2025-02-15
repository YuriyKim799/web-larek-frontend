import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';


export class Modal {
  
  protected events: IEvents;
  protected modalElement: HTMLElement;
  protected _content: HTMLElement;

  constructor(modalElement: HTMLElement, template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.modalElement = modalElement;
    this._content = modalElement.querySelector('.modal__content')
  
  const closeButtonElement = this.modalElement.querySelector(".modal__close");
    closeButtonElement.addEventListener("click", this.close.bind(this));
    this.modalElement.addEventListener("mousedown", (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    this.handleEscUp = this.handleEscUp.bind(this);
  }
  
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
}

  open() {
    this.modalElement.classList.add("modal_active");
    document.addEventListener("keyup", this.handleEscUp);
      }

  close() {
    this.modalElement.classList.remove("modal_active");
    document.removeEventListener("keyup", this.handleEscUp);
  }

  handleEscUp (evt: KeyboardEvent) {
      if (evt.key === "Escape") {
        this.close();
      }
    };
}

