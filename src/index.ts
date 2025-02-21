import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { Contacts } from './components/Contacts';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';
import { AppData } from './components/AppData';
import './scss/styles.scss';
import { ICard, OrderForm } from './types';
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
const orderForm = new Order(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#order')));
const contactsForm = new Contacts(events, cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')));

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

  events.on('order:open', () => {
    modal.render({
      content: orderForm.render({
        payment: 'online',
        address: '',
        valid: false,
        errors: []
      })
    })
  });

  events.on('order:submit', () => {
    modal.render({
      content: contactsForm.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
      })
    })
  });

  events.on('order:ready', () => {
    contactsForm.valid = true;
  })

  events.on(/^order\..*:change/,(data: {field: keyof OrderForm, value: string})=> {
    cardsData.setOrderField(data.field, data.value);
  });

  events.on(/^contacts\..*:change/,(data: {field: keyof OrderForm, value: string})=> {
    cardsData.setOrderField(data.field, data.value);
  })

  events.on('formErrors:change', ({ payment, address, email, phone }: Partial<OrderForm>) => {
    // Основная форма
    orderForm.valid = ![payment, address].some(Boolean);
    orderForm.errors = [payment, address].filter(Boolean).join('; ');
    
    // Контактная форма
    contactsForm.errors = [email, phone].filter(Boolean).join('; ');
  });

events.on('contacts:submit', () => {
  api.orderProducts(cardsData.order)
  .then((res) => {
    const success = new Success(cloneTemplate
      (ensureElement<HTMLTemplateElement>('#success')), {
      onClick: () => {
        modal.close();
        cardsData.clearBasket();
      }
    });

    modal.render({
      content: success.render(res)
    })
  })

  .catch(err => {
    console.log(err);
  })
})


