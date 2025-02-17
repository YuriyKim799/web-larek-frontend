import { AppApi } from './components/AppApi';
import { EventEmitter, IEvents } from './components/base/events';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { Page } from './components/Page';
import { AppData } from './components/WebLarekData';
import './scss/styles.scss';
import { API_URL,CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const cardsContainerElement = document.querySelector('.gallery') as HTMLElement
const modalElement = document.querySelector('#modal-container') as HTMLElement
const cardTemlate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement
const cardsContainer = new CardsContainer(cardsContainerElement);

const events: IEvents = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const cardsData = new AppData(events);
const page = new Page(cardsContainerElement, events)




api.getProductList()
  .then(cardsData.setCards.bind(cardsData))
  .catch(err => {console.log(err)});

events.on('items:change', ()=> {
  page.catalog = cardsData.items.map(item => {
    const card = new Card(cloneTemplate(cardTemlate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render(item);
  });
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