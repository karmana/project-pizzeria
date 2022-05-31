"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templates = exports.settings = exports.select = exports.classNames = void 0;
const select = {
  // obiekt
  templateOf: {
    //obiekt
    menuProduct: '#template-menu-product',
    // wlasciwosc obiektu, ktora zawiera selektor do szablonu produktu 
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget'
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',
    booking: '.booking-wrapper',
    slider: '.my-slider',
    boxes: '.boxes'
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select'
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]'
  },
  boxes: {
    smallBoxes: '.small-box',
    links: '.box-link'
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]'
    },
    datePicker: {
      wrapper: '.date-picker',
      input: "input[name=\"date\"]"
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output'
    }
  },
  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    floorPlan: '.floor-plan',
    form: '.booking-form',
    phone: '[name="phone"]',
    address: '[name="address"]',
    name: '[name="name"]',
    starters: '.booking-form [name="starter"]',
    startersCheck: '.booking-form [type="checkbox"]'
  },
  nav: {
    links: '.main-nav a'
  },
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: ".cart__total-number",
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]'
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]'
  }
};
exports.select = select;
const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active'
  },
  cart: {
    wrapperActive: 'active'
  },
  booking: {
    loading: 'loading',
    tableBooked: 'booked',
    tableSelected: 'selected'
  },
  nav: {
    active: 'active'
  },
  pages: {
    active: 'active'
  }
};
exports.classNames = classNames;
const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 0,
    defaultMax: 10
  },
  cart: {
    defaultDeliveryFee: 20
  },
  hours: {
    open: 12,
    close: 24
  },
  datePicker: {
    maxDaysInFuture: 14
  },
  booking: {
    tableIdAttribute: 'data-table'
  },
  db: {
    url: '//' + window.location.hostname + (window.location.hostname == 'localhost' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',
    product: 'product',
    booking: 'bookings',
    event: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false'
  }
};
exports.settings = settings;
const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  //metoda menuProduct jest tworzona za pomoca biblioteki Handlebars
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML)
};
exports.templates = templates;