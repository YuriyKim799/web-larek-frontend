import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { CardData } from './components/CardsData';
import { Modal } from './components/Modal';
import './scss/styles.scss';
import { IApi, ICard } from './types';
import { API_URL } from './utils/constants';

const events: IEvents = new EventEmitter();
const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi);

const cardsContainerElement = document.querySelector('.gallery') as HTMLElement
const modalElement = document.querySelector('#modal-container') as HTMLElement
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement
const cardsData = new CardData(events);
const cardsContainer = new CardsContainer(cardsContainerElement);


api.getCards().then((res) => {
  cardsData.cards = res.items;
  events.emit('initialData:loaded');
});

events.on('initialData:loaded', ()=> {
  const cardsArray = cardsData.cards.map((card) => {
    const cardInstant = new Card(cardCatalogTemplate, events);
    return cardInstant.render(card);
  });

  cardsContainer.catalog = cardsArray;
})

// events.on('card:select', (data: {card: ICard}) => {
//   const { card } = data;
//   //  console.log(card);
//    const cardItemPreview = new Card(cardPreviewTemplate, events);
//    cardItemPreview.setData(card);
//   const cardElementPreview = cardItemPreview.render();
//    const mainModal = new Modal(modalElement, cardPreviewTemplate, events);
//   //  console.log(cardsData.getCard(card.id));
//   mainModal.content = cardElementPreview;
//    mainModal.open();
// })