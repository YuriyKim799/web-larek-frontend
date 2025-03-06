export interface ICard { // интерфейс карточки товара
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  cardIndex: number;
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IBasket {
  cards: string[],
  // total: number
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

// export type PaymentMethod = 'cash' | 'online';