export interface ICard { // интерфейс карточки товара
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  cards: string;
}

export interface ICardsData { // интерфейс для модалки
  cards: ICard[];
  prewiew: string | null;  // хранится указатель на ту карточку которую мы хотим просмотреть _id
  getCard(cardId: string): ICard;
}
