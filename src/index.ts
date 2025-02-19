import { AppApi } from './components/AppApi';
import { EventEmitter, IEvents } from './components/base/events';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { AppData } from './components/WebLarekData';
import './scss/styles.scss';
import { ICard } from './types';
import { API_URL,CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new AppApi(CDN_URL, API_URL);

//Темплейты карточки товара 
const cardCatalogTemlate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const events = new EventEmitter();
const cardsData = new AppData(events);

const modalElement = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(events, modalElement);
const page = new Page(document.body, events);
const basket = new Basket(events);


api.getProductList()
  .then(cardsData.setCards.bind(cardsData))
  .catch(err => {console.log(err)});

events.on('items:change', (items: ICard[])=> {
  page.catalog = items.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemlate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
			price: item.price,
			title: item.title,
			image: item.image,
			category: item.category,
		});
  });
});

events.on('card:select', (data: ICard) => {
  cardsData.setPreview(data);
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

events.on('preview:change', (data: ICard) => {
    if(data) {
      const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
          if(cardsData.inBasket(data)) {
            cardsData.removeFromBasket(data);
            card.button = 'В корзину';
          } else {
            cardsData.addToBasket(data);
             card.button = 'Удалить из корзины';
          }
        }
      });

      card.button = cardsData.inBasket(data) ? 'Удалить из корзины': 'В корзину';
  
      modal.render({content: card.render({
        price: data.price,
        title: data.title,
        image: data.image,
        category: data.category,
        description: data.description,
      })});
    } else {
      modal.close();
    }
});

events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
});

events.on('basket:change', () => {
  page.counter = cardsData.basket.cards.length;

  basket.cards = cardsData.basket.cards.map(cardId => {
    const item = cardsData.items.find(card => card.id === cardId);
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => cardsData.removeFromBasket(item)
    });
    return card.render({
      price: item.price,
      title: item.title,
      image: item.image,
      description: item.description,
      })
    });
     basket.total = cardsData.basket.total;
  });

