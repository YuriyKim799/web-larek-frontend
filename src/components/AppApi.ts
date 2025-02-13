import { IApi, ICard } from '../types';
import { ApiListResponse } from './base/api';


export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getCards() {
    return this._baseApi.get(`/product/`).then((cards: ApiListResponse<ICard>) => cards);
  }
}