// Базовый класс для работы с HTML элементами

import { IEvents } from './Events';

export abstract class Component<T> {
	 constructor(protected readonly container: HTMLElement) {}

	protected setText(element: HTMLElement, value: string) {
		if (element) {
			element.textContent = String(value);
		}
	}

	setColorCategory(element: HTMLElement, category: string) {
		element.classList.toggle(category);
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