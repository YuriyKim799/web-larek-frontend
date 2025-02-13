import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { CardData } from './components/CardsData';

import './scss/styles.scss';
import { IApi } from './types';

import { API_URL } from './utils/constants';

const events: IEvents = new EventEmitter();

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi)

const contentElement = document.querySelector('.page') as HTMLElement
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement


const cardsData = new CardData(events);

api.getCards().then((res) => {
  cardsData.cards = res.items;
  console.log(cardsData.products);
});
