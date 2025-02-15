export interface ICardsContainer {
  catalog: HTMLElement[];
}

export class CardsContainer {
  protected _catalog: HTMLElement;
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  set catalog(items:HTMLElement[]) {
    this.container.replaceChildren(...items);
  }

  render() {
    return this.container;
  }
}