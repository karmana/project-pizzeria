"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/es.promise.js");

var _settings = require("../settings.js");

var _utils = _interopRequireDefault(require("../utils.js"));

var _CartProduct = _interopRequireDefault(require("./CartProduct.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = []; //tworze tablice w ktorej bede przechowywac produkty dodane do koszyka

    thisCart.getElements(element);
    thisCart.initActions();
    console.log('newCart', thisCart);
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(_settings.select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(_settings.select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(_settings.select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(_settings.select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(_settings.select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(_settings.select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(_settings.select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(_settings.select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(_settings.select.cart.phone);
  }

  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(_settings.classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      //nasluchujemy na liste produktow, w ktorej umiesczamy produkty, w ktorych znajduje sie widget liczby sztuk, ktory generuje ten event
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = _settings.templates.cartProduct(menuProduct);
    /* generate HTML based on template */


    const generatedDOM = _utils.default.createDOMFromHTML(generatedHTML);
    /* create element using utils.createElementsFromHTML */


    thisCart.dom.productList.appendChild(generatedDOM);
    /* add element to menu */

    thisCart.products.push(new _CartProduct.default(menuProduct, generatedDOM));
    console.log('thisCart.products', thisCart.products);
    console.log('adding product', menuProduct);
    thisCart.update();
  }

  update() {
    const thisCart = this;
    thisCart.totalNumber = 0; //calkowita liczba sztuk

    thisCart.subtotalPrice = 0; //zsumowana cena za wszystko, bez kosztow dostawy

    thisCart.deliveryFee = 0;

    for (let product of thisCart.products) {
      // petla przechodzi po thisCart.products
      thisCart.totalNumber = product.amount + thisCart.totalNumber; //zwieksza totalNumber o liczbe sztuk danego produktu

      thisCart.subtotalPrice = product.price + thisCart.subtotalPrice; //zwieksza subtotalPrice o jego cena calkowita (wlasciwosc price)
    }

    if (thisCart.totalNumber == 0) {
      //jesli nie ma nic w koszyku nie ma kosztow dostawy, cena koncowa =0
      thisCart.deliveryFee == 0;
      thisCart.subtotalPrice == 0;
      thisCart.totalPrice == 0;
    } else {
      thisCart.deliveryFee = _settings.settings.cart.defaultDeliveryFee;
    }

    for (let totalPrices of thisCart.dom.totalPrice) {
      thisCart.totalPrice = thisCart.deliveryFee + thisCart.subtotalPrice;
      totalPrices.innerHTML = thisCart.totalPrice;
    }

    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    console.log(thisCart.deliveryFee, thisCart.totalNumber, thisCart.subtotalPrice, 'totalPrice:', thisCart.totalPrice);
  }

  remove(event) {
    const thisCart = this; // usuwam informacje o danym produkcie z tablicy thisCart.products

    const removedProduct = thisCart.products.indexOf(event.detail.cartProduct);
    thisCart.products.splice(removedProduct, 1); // wywoluje metode update w celu przeliczenia sum po usunieciu produktu

    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    const url = _settings.settings.db.url + '/' + _settings.settings.db.orders;
    const payload = {};
    payload.address = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subtotalPrice = thisCart.subtotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    console.log('payload:', payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    fetch(url, options);
    /* nie potrzebujemy, ale jesli bysmy chcieli, w przypadku sukcesu json-server powinien zwrocic obiekt dodany do bazy 
      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
      */
  }

}

var _default = Cart;
exports.default = _default;