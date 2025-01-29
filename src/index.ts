import { Api, ApiListResponse } from './components/base/api';
import { Model } from './components/Model';

import './scss/styles.scss';
import { API_URL } from './utils/constants';

const products = new Api(API_URL);
const productArray = new Model();




const getProducts = async (): Promise<object> => {
    const apiProducts: {total: number,items:[]} = await products.get('/product/').then();
    // apiProducts.items.map(item => item);
    return apiProducts.items;
 }

const productArr = getProducts();

console.log(productArr);

// console.log(productArray.products);
