export class Model {
  protected _products: [];
  
  constructor() {
    this._products = [];
  }

  set products(data: []) {
    this._products = data;
  }

  get products() {
    return this._products;
  }

}