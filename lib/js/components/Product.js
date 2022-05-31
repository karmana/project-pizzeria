"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

var _settings = require("../settings.js");

var _utils = _interopRequireDefault(require("../utils.js"));

var _AmountWidget = _interopRequireDefault(require("./AmountWidget.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Product {
  //klasa, wzorzec wedle, ktotrego tworzona jet kazda instancja
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu(); //konstruktor uruchomi funckje renderInMenu od razu po utworzeniu instancji

    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder(); //console.log('new Product:', thisProduct);
  }

  renderInMenu() {
    //metoda, ktora renderuje, czyli tworzy produkty na stronie
    const thisProduct = this;

    const generatedHTML = _settings.templates.menuProduct(thisProduct.data);
    /* generate HTML based on template */
    // wywoluje metode templates.menuProduct i przekazuje jej dane produktu, HTML - zwykly string


    thisProduct.element = _utils.default.createDOMFromHTML(generatedHTML);
    /* create element using utils.createElementsFromHTML */
    // element DOM to obiekt wygenerowany przez przegladarke na podstawie kodu HTML
    // stworzony element DOM zapisujemy od razu jako wlasciwosc instancji, dzieki czemu bedziemy mieli do niej dostep w innych metodach instancji

    const menuContainer = document.querySelector(_settings.select.containerOf.menu);
    /* find menu container */

    menuContainer.appendChild(thisProduct.element);
    /* add element to menu */
    //metoda appendChild dodaje stworzony element fo menu
  }

  getElements() {
    // tworze metode getElements, ktora szuka elementow w konterze produktu -> by nie wyszukiwac tych samych elementow wielokrotnie
    const thisProduct = this; // TO DO: EXERCISE - ADD .dom TO PRODUCT thisProduct.dom = {};

    thisProduct.accordionTrigger = thisProduct.element.querySelector(_settings.select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(_settings.select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(_settings.select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(_settings.select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(_settings.select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(_settings.select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(_settings.select.menuProduct.amountWidget);
  }

  initAccordion() {
    // tworze metode initAccordion 
    const thisProduct = this; //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); /* find the clickable trigger (the element that should react to clicking) */
    // wykorzystuje elementy z metody getElements - definiowanie nowej zmiennej jest zbedne 
    // clickableTrigger.addEventListener('click', function(event) {

    thisProduct.accordionTrigger.addEventListener('click', function (event) {
      /* START: add event listener to clickable trigger on event click */
      event.preventDefault();
      /* prevent default action for event */

      const activeProduct = document.querySelector(_settings.select.all.menuProductsActive);
      /* find active product (product that has active class) */
      //console.log('active produts:', activeProduct);

      if (activeProduct != null && thisProduct.element) {
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        activeProduct.classList.remove('active');
        /* != null sprawdza czy element DOM udalo sie znalezc, !=thisProduct.element - sprawdza czy aktywny produkt jest rozny od elementu biezacego */
      }

      thisProduct.element.classList.toggle('active');
      /* toggle active class on thisProduct.element */

      /* toogle - jesli danej klasy nie ma - dodaje, jesli jest - zabiera */
    });
  }

  initOrderForm() {
    // tworze metode initOrderForm, ktora jest odpowiedzialna za dodanie listenerow evntow do formularza, jego kontrolek, guzika add to cart
    const thisProduct = this;
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault(); // blokuje domyslna akcje, czyli wyslanie strony z przeladowaniem formularza

      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault(); // blokuje domyslana akcje, czyli zmiane adresu strony po kliknieciu w link

      thisProduct.processOrder();
      thisProduct.addToCart();
    }); //console.log('initOrderForm');
  }

  processOrder() {
    // tworze metode processOrder
    const thisProduct = this; // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}

    const formData = _utils.default.serializeFormToObject(thisProduct.form); //console.log('formData', formData);
    // set price to default price


    let price = thisProduct.data.price; // for every category (param)...

    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId]; //console.log(paramId, param);
      // for every option in this category

      for (let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId]; //console.log('option', optionId, option);

        /* weryfikacja czy dana opcja jest zaznaczona */

        /* 1. czy obiekt formData zawiera wlasciwosc o klczu takim jak klucz parametru (powinien)  */

        /* 2. czy w tablicy zapisnej pod tym kluczem znajduje sie klucz opcji */

        /* jesli 1 i 2 sa prawdziwe to znaczy ze opcja jest zaznaczona */

        const optionSelected = formData[paramId] && formData[paramId].includes(optionId); //console.log('Selected?', optionSelected);

        if (optionSelected) {
          // sprawdzam czy opcja nie jest domyslna 
          if (!option.default == true) {
            //dodaje cene opcji do zmiennej price
            price += option.price;
          }
        } else {
          //sprawdzam czy opcja jest domyslna
          if (option.default == true) {
            price -= option.price;
          }
        }
        /* dodaje czesc odpowiedzialna za obsluge obrazkow */
        //szukam obrazka w divie z obrazkami


        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId); //console.log(thisProduct.imageWrapper);

        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add(_settings.classNames.menuProduct.imageVisible);
          } else {
            optionImage.classList.remove(_settings.classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    thisProduct.priceSingle = price; //zapisuje nowa wlasciwosc z cena jednostokowa wybranej opcji

    /* multiply price by amount */

    price *= thisProduct.amountWidget.value; // update calculated price in the HTML

    thisProduct.priceElem.innerHTML = price;
  }

  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new _AmountWidget.default(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder(); //po wykryciu eventu updated zostanie uruchomiona metoda processOrder
    });
  }

  addToCart() {
    const thisProduct = this; //app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct
      }
    });
    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;
    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams()
    };
    return productSummary;
  }

  prepareCartProductParams() {
    const thisProduct = this; // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}

    const formData = _utils.default.serializeFormToObject(thisProduct.form); //tworze nowy obiekt, w ktorym bede przechowywac wybor uzytkownika


    const params = {}; // for every category (param)...

    for (let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId]; // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}

      params[paramId] = {
        label: param.label,
        options: {}
      }; // for every option in this category

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          params[paramId].options[optionId] = option.label;
        }
      }
    }

    return params;
  }

}

var _default = Product;
exports.default = _default;