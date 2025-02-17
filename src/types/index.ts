export interface ICard { // интерфейс карточки товара
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  cards: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IBasket {
  cards: string[],
  total: number
}

export type OrderForm = Omit<IOrder, 'total' | 'cards'>;

export type PaymentMethod = 'cash' | 'card';