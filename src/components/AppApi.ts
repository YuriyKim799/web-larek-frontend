import { ICard, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface ICustomApi {
	  getProductList: () => Promise<ICard[]>;
    getProductItem: (id: string) => Promise<ICard>;
	  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}


export class AppApi extends Api implements ICustomApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
}

  getProductList(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) => 
      data.items.map((card) => ({
        ...card,
        image: this.cdn + card.image
      }))
    );
  }

  getProductItem(id: string): Promise<ICard> {
    return this.get(`/product/${id}`).then((card: ICard) => ({
      ...card,
      image: this.cdn + card.image
    }))
  };

  orderProducts(order: IOrder):Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  };
}