"use strict";

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.promise.js");

var _settings = require("./settings.js");

var _Product = _interopRequireDefault(require("./components/Product.js"));

var _Cart = _interopRequireDefault(require("./components/Cart.js"));

var _Booking = _interopRequireDefault(require("./components/Booking.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//importuj obiekty settings,select itd. z pliku ./settings.js
//bez {}, nawiasow uzywamy wtedy kiedy importujemy wiecej niz 1 obiekt, product.js importujemy jako domyslny, moze byc bez {}
// import Home from './components/Home.js';
const app = {
  initPages: function initPages() {
    const thisApp = this;
    thisApp.pages = document.querySelector(_settings.select.containerOf.pages).children; //tworzymy wlasciwosc, w ktorej bedziemy przechowywac wszystkie kontenery podstron (w kontenerze pages), wlasciwosc children - dzieki niej we wlasciwosci pages znajda sie wszystkie dzieci kontenra pages (sekcka order i booking)

    thisApp.navLinks = document.querySelectorAll(_settings.select.nav.links); //ten selekstor wyszukuje wszystkie linki, dlatego nie stosujemy children

    console.log('NavLinks', thisApp.navLinks); //thisApp.activatePage(thisApp.pages[0].id); //metodzie przekazujemu informacje, ktora strona ma byc aktywowana, przekazujemy id kontenera - id pierwszej ze stron znalezionej i zapisanej w thisApp.pages

    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
        /* get page id from href attribute */

        const id = clickedElement.getAttribute('href').replace('#', ''); //w stalej id zapisujemy atrybut hre kliknietego elementu, w ktorym zamienimy # na pusty ciag znakow - zamieniajac to pozostanie nam tekst ktory jest o tym znaku, czyli order lub bookind odpowiadajce id strony 

        /* run thisApp.activatePage with that id */

        thisApp.activatePage(id);
        /* change URL hash */

        window.location.hash = '#/' + id; //dodajemy / po # zeby uniknac domyslnego zachowania przegladarki - przewiniecia strony do elementu o tej samej nazwie (#order) co link (#order)
      });
    }
  },
  activatePage: function activatePage(pageId) {
    //metoda, bedaca funkcja przyjmujaca jeden argument pageId
    const thisApp = this;
    /* add class "active" to matching pages, remove from non-matching */

    for (let page of thisApp.pages) {
      // if(page.id == pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }
      page.classList.toggle(_settings.classNames.pages.active, page.id == pageId); //to samo co powyzszy kod
    }
    /* add class "active" to matching links, remove from non-matching */


    for (let link of thisApp.navLinks) {
      //dla kazdego z linkow zapisanych w thisApp.navLinks
      link.classList.toggle( //dodajemy lub usuwamy 
      _settings.classNames.nav.active, //klase active 
      link.getAttribute('href') == '#' + pageId); //w zaleznosci od tego czy atrybut href tego linka jest rowny # oraz id podstrony podanej jako argument w metodzie activatePage
    }
  },
  initBoxes: function initBoxes() {
    const thisApp = this;
    thisApp.boxesLinks = document.querySelectorAll(_settings.select.boxes.links);

    for (let link of thisApp.boxesLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const clickedLink = this;
        const linkHref = clickedLink.getAttribute('href').replace('#/', '');
        thisApp.activatePage(linkHref);
        window.location.hash = '#/' + linkHref;
      });
    }
  },
  initMenu: function initMenu() {
    //metoda wywolywana po iniData, bo korzysta z przygotowanej wczesniej referencji do danych (thisApp.data)
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      //jej zadaniem jest przejscie po wszystkich obiektach produktow z thisApp.data.products i utworzenie dla kazdego z nich instacji klasy Product
      //new Product(productData, thisApp.data.products[productData]);
      new _Product.default(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function initData() {
    //przugotowuje latwy dostep do danych, przypisuje do app.data (wlasciwosci calego obiketu app) referencje do dataSource
    const thisApp = this; //thisApp.data = dataSource; //referencja do dataSource, danych z ktorych korzystamy, znajduje sie tam m.in. products ze struktura produktow

    thisApp.data = {};
    const url = _settings.settings.db.url + '/' + _settings.settings.db.products;
    fetch(url).then(function (rawResponse) {
      return rawResponse.json();
    }).then(function (parsedResponse) {
      //console.log('parsedResponse', parsedResponse);

      /* save parsedResponse as thisApp.data.products */
      thisApp.data.products = parsedResponse;
      /* execute initMenu method */

      thisApp.initMenu();
    }); // console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function initCart() {
    const thisApp = this;
    const cartElem = document.querySelector(_settings.select.containerOf.cart);
    thisApp.cart = new _Cart.default(cartElem);
    thisApp.productList = document.querySelector(_settings.select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product.prepareCartProduct());
    });
  },
  initBooking: function initBooking() {
    const thisApp = this;
    const widgetBooking = document.querySelector(_settings.select.containerOf.booking);
    thisApp.bookingElem = new _Booking.default(widgetBooking);
  },
  // initHome: function(){
  //   const thisApp = this;
  //   const home = document.querySelector(select.containerOf.smallBoxes);
  //   thisApp.homeBoxes = new Home (home);
  // },
  init: function init() {
    const thisApp = this; // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initBoxes(); //thisApp.initMenu();

    thisApp.initCart();
    thisApp.initBooking();
  }
};
app.init();