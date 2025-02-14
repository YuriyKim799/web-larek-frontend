import { ApiPostMethods } from '../components/base/api';

export interface ICard { // интерфейс карточки товара
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
  text: string;
  
}

export interface IOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  cards: string;
}

export interface ICardsData { // интерфейс для 
  cards: ICard[];
  prewiew: string | null;  // хранится указатель на ту карточку которую мы хотим просмотреть _id
  getCard(cardId: string): ICard;
}

export interface IApi {
  baseUrl: string;
  get(uri: string): Promise<object>;
  post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}