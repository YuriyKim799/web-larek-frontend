# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

## Описание данных

```
Данные, используемые в проекте представлены интерфейсами ICard и IOrder.

Интерфейс ICard описывает конкретный товар, для покупки в интернет магазине, содержит данные которые присылает сервер, для описания товара.

 interface ICard { 
  _id: string;           уникальный индентификатор
  description: string;   описание товара
  image: string;         ссылка на изображение товара
  title: string;         название товара
  category: string;      категория товара
  price: number;         цена товара
}

Интерфейс IOrder описывает объект заказа отправляемый на сервер, содержит массив id товаров добавленных в заказ, а также данные покупателя и общую стоимость заказов.

interface IOrder {      
  payment: string;     метод оплаты заказа
  email: string;       почта покупателя
  phone: string;       номер телефона покупателя
  address: string;     адрес доставки
  total: number;       общая стоимость заказа
  items: string[];     массив id товаров добавленных в заказ
}

Интерфейс IOrderResult описывает возращаемый объект с сервера после успешной отправки формы заказа.

interface IOrderResult {
	id: string;
	total: number;
}

Интерфейс IBasket описывает объект корзины покупок содержит в себе массив id карточек добавленных в корзину и счетчик общей стоимости товаров 

interface IBasket {
  cards: string[],
  total: number
}

Интерфейс OrderForm описывает объект формы заказа, и что б не дублировать код используем утилиту Omit которая создаёт новый тип, исключая указанные свойства из исходного типа. Т.е. вырезаем 'total' | 'items' из интерфейса IOrder.

type OrderForm = Omit<IOrder, 'total' | 'items'>;
```

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
  
 #### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.  

#### Абстрактный базовый класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

abstract class Component
constructor(protected readonly container: HTMLElement) - В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента.

Методы:
- protected setText(element: HTMLElement, value: string) - принимает элемент разметки и меняет текстовое содержимое в элементе.
- setColorCategory(element: HTMLElement, category: string) - принимает элемент разметки карточки товара и устанавливает класс на элемент категории товара т.е. меняет цвет в зависимости от категории товара.
- setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает изображение карточки товара, и устанавливает описание для скринридера.
- render(data?: Partial<T>): HTMLElement - возвращает новый заполненый HTML элемент.


#### Базовый класс View
Класс View расширяет Component. 

- constructor(protected readonly events:IEvents, container: HTMLElement) - Добавляя в конструктор параметр events, он служит прослойкой между Component и конкретными представлениями, добавляя функционал для работы с событиями.

### Слой коммуникации.

#### Класс AppApi

interface IAppApi {
	  getProductList: () => Promise<ICard[]>;
    getProductItem: (id: string) => Promise<ICard>;
	  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

Методы:
- getProductList() - получачем массив карточек товара
- getProductItem(id) - получаем конкретную карточку по id
- orderProducts(order) - отправляем на сервер объект заказа и получаем результат

### Слой данных (Model). Основные классы.

#### Класс AppData
Класс отвечает за хранение и логику работы с данными.

Конструктор класса принимает инстант брокера событий

В полях класса хранятся следующие данные:

 items: ICard[]; Массив карточек товара полученных с сервера.

 previewCard: ICard = null; объект карточки товара, открывается при клике на саму карточку в списке на главной странице.
 
  basket: IBasket = { cards: [] }; Объект корзины хранит в себе массив карточек для отображения.

  formErrors = {}; Объект ошибок

  order: IOrder = {
    payment: 'online',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
  }; Объект заказа, содержит нужные поля для отправки заказа на сервер.

  Методы класса:

  - setCards(cards: ICard[]) наполняет поле items массивом карточек товара с сервера.
  - setPreview(card: ICard) наполняет поле previewCard объектом card для предварительного просмотра карточки.
  - inBasket(card: ICard) принимает объект карточки товара и проверяет есть ли данный бъект карточки товар уже в корзине.
  - getBasketTotal(): number - возращает общую стоимость товаров в корзине.
  - addToBasket(card: ICard) добавляет выбранный товар в массив карточек корзины.
  - removeFromBasket(card: ICard) удаляет товар из массива карточек корзины. 
  - clearBasket() очищает корзину.
  - setOrderField(field,value) заполняем объект заказа значениями из инпутов формы.
  - validateOrder() проверяет заполнены ли поля формы заказа.

События: 

- events.emit('items:change')
- events.emit('preview:change')
- events.emit('basket:change')
- events.emit('order:ready')
- events.emit('formErrors:change')


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Page

interface IPage {
    counter: number; - счетчик, значение которого выводится у иконки корзины на главной странице.
    catalog: HTMLElement[]; 
    locked: boolean; - блокировка скролла страницы при появлении модального окна.
}

Устанавливает элементы в предназначенные для них контейнеры, выводит обновленное значение счетчика товаров после добавления/удаления товара, позволяет блокировать прокрутку страницы, когда поверх нее вызвано модальное окно. Содержит сеттеры для работы с полями.

В конструктор принимает HTML элемент контейнера и экземпляр EventEmitter для инициализации событий и ставит слушатель событий на кнопку корзины.

- counter: HTMLElement - счетчик товаров в корзине
- catalog: HTMLElement - каталог товаров
- wrapper: HTMLElement - обертка страницы (для блокировки скролла)
- _basketCartIcon: HTMLElement - элемент счетчика на главной странице

Методы класса (сеттеры):

- set counter(value: number) - принимает в себя числовое значение и отображает его на корзине покупок.
- set catalog(items: HTMLElement[]) - принимает массив элементов, т.е. карточки для отображения
- set locked(value: boolean) - принимает булевое значение заблокировать страницу для прокрутки либо нет.

События: 

- events.emit('basket:open')
  
#### Класс Modal 

interface IModal {
  content: HTMLElement; 
}

Является дочерним классом View.
Отображает универсальное модальное окно с кнопкой закрытия. Выводит внутри модального окна любой переданный контент.
В конструктор принимает элемент контейнера и экземпляр класса EventEmitter для инициализации событий. Содержит сеттер для установки контента.

- _closeButton: HTMLButtonElement - кнопка закрытия модального окна;
- _content: HTMLElement - наполнение модального окна;

Добавляем на кнопку закрытия, слушатели. Закрытие модального окна по клавише Esc, либо по самой кнопке закрытия, либо при клике в любою область кроме модального окна.
  
Методы класса (сеттеры):

-  set content: Принимает значение для наполнения контента модального окна.

Методы класса:

- open() - открытие модального окна.
- close() - закрытие модального окна по нажатию на кнопку или вне зоны окна.
- handleESC(evt:KeyboardEvent) - закрытие модального окна по нажатию на ESC.
- render(data: IPopup) - отображение модального окна.

События: 

- events.emit('modal:open')
- events.emit('modal:close')
 
#### Класс Form

interface IForm {
  valid: boolean,
  errors: string[]
}

Является дочерним классом View.
Представляет собой универсальный компонент формы, является родительским классом для всех форм приложения. Содержит сеттеры для установки ошибок полей и валидации кнопки.

- submit: HTMLButtonElement - кнопка типа 'submit'.
- errors: HTMLElement - span элемент куда выводится ошибка.

Методы класса:

- onInputChange() - отслеживание изменений в поле ввода для генерации событий "changed".
- render() - отрисовывает и перерисовывает форму (когда нужно вывести сообщение об ошибке при невалидном тексте в поле ввода).

Методы класса (сеттеры):

- set valid: делает кнопку активной или не активной в зависимости от переданного значения.
- set errors: устанавливает ошибки в span элемент ошибки.

События: 

- events.emit('order:submit')
- events.emit('contacts:submit')
- events.emit('order.address:change') 
- events.emit('order.payment:change') 
- events.emit('contacts.email:change') 
- events.emit('contacts.phone:change') 
 
#### Класс Card

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

Отвечает за отображение карточки товара, устанавливает картинку товара, название, цену, категорию и описание товара. Содержит сеттеры и геттеры для работы с полями.

В конструктор принимает название блока, контейнер, в который будет помещена карточка и колбэк, который будет выполняться при клике на кнопку карточки.

  -  _cardId: string; - уникальный индентификатор
  -  _cardCategory: HTMLElement; -  категория товара
  -  _cardTitle: HTMLElement;  - название товара
  -  _cardImage: HTMLImageElement; изображение товара
  -  _cardDescription: HTMLElement; - описание товара
  -  _cardPrice: HTMLElement; - цена товара
  -  _button: HTMLButtonElement; - кнопка добавления товара в корзину
  -  _cardIndex: HTMLElement; - порядковый номер товара в корзине

Методы класса (сеттеры):

- set id: Устанавливает идентификатор продукта.
- set category: Устанавливает категорию продукта.
- set title: Устанавливает заголовок продукта.
- set description: Устанавливает описание продукта.
- set image: Устанавливает изображение продукта.
- set buttonText: Устанавливает текст кнопки.
- set price: Устанавливает цену продукта.
  
Методы класса (геттеры):

- get id: возвращает id карточки.
- get title: возвращает название карточки.

#### Класс Basket

interface IBasketView {
  cards: HTMLElement[],
  total: number
}

Является дочерним классом View.
Отвечает за отображение содержимого корзины покупок.

В конструктор принимает экземпляр EventEmitter для инициализации событий.
Имеет свойства: 
- _list: HTMLElement; Элемент-контейнер куда выводится список карточек товара.
- _total: HTMLElement; Элемент где отображается общая стоимость товаров в корзине
- _button: HTMLButtonElement; Кнопка оформить товары.
в конструкторе ставим слушатель событий на кнопку 'оформить' товары.

Методы класса (сеттеры):

- set cards: Получаем массив карточек, и отрисовываем их в _list, затем у кнопки убираем аттрибут disabled.

- set total: Получаем сумму добавленных в корзину товаров.

События: 

- events.emit('order:open');

#### Класс Order 

Является дочерним классом Form, отвечает за отображение формы ввода выбора способа оплаты и адреса пользователя, содержит сеттеры для работы с полями.

В конструктор принимает экземпляр EventEmitter для инициализации событий и HTML-элемент формы.

- paymentCard - кнопка выбора оплаты картой.
- paymentCash - кнопка выбора оплаты наличными.

Методы класса (сеттеры):

- set payment переключает класс на кнопках.
- set adress устанавливает значение в инпут.

#### Класс Contacts 

Является дочерним классом Form, отвечает за отображение формы ввода email и phone.

Методы класса (сеттеры):

- set email: устанавливает значение в инпут.
- set phone: устанавливает значение в инпут.

#### Класс Success 

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

Имеет поля:

total: HTML элемент разметки для отображения описания удачного сообщения о покупке.
close: кнопка закрытия модального окна.

в конструктор принимает, темплейт модального окна и коллбэк функцию.

Методы класса (сеттеры):
total: устанавливает текст в элемент разметки для отображения сообщения о общей стоимости покупки.

### Взаимодействие компонентов

Архитектура проекта реализована в парадигме MVP и состоит из трех основных частей.

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*События изменения данных (генерируются классами моделями данных)*

- `items:change` -  событие генерируемое при загрузке карточек с сервера.
- `preview:change` -  карточка товара выбрана для отображения в модальном окне.
- `basket:change` - изменение корзины покупок.
- `order:ready` - изменение кнопки (делаем ее активной для клика).
- `formErrors:change`- следим за изменением объекта ошибок если поле не прошло валидацию значит объект ошибок не пустой.

*Список всех событий, которые могут генерироваться в системе:*\

- `card:select` - событие выбора карточки для предварительного просмотра.
- `modal:open` - событие открытия любого модального окна.
- `modal:close` - событие закрытия любого модального окна.
- `basket:open` - открытие модального окна корзины.
- `order:open` - открытие модального окна выбора оплаты и указания адреса.
- `order:submit` - открытие модального окна указания почты и телефона.
- `order.address:change` - изменение поля ввода адреса доставки.
- `order.payment:change` - изменение поля ввода способа оплаты.
- `contacts.email:change` - изменение поля ввода электронной почты.
- `contacts.phone:change` - изменение поля ввода номера телефона.
- `contacts:submit` - подтверждение последней формы адреса и почты,отправка на сервер объекта заказа и отображение финального модального окна, успешного подтверждения заказа.



