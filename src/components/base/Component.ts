// Базовый класс для работы с HTML элементами

import { IEvents } from './events';

export abstract class Component<T> {
	 constructor(protected readonly container: HTMLElement) {}
	
	// toggleClass(element: HTMLElement, className: string, force?: boolean) {
	// 	element.classList.toggle(className, force);
	// }

	toggleClass(className: string) {
		this.container.classList.toggle(className)
	}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	setColorCategory(element: HTMLElement, category: string) {
		element.classList.add(category);
	}

	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	 setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
        element.alt = alt;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}

export class View<T> extends Component<T> {
  constructor(protected readonly events:IEvents, container: HTMLElement) {
    super(container);
  }
}