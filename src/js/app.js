import {settings, select, classNames, templates} from './settings.js'; //importuj obiekty settings,select itd. z pliku ./settings.js
import Product from './components/Product.js'; //bez {}, nawiasow uzywamy wtedy kiedy importujemy wiecej niz 1 obiekt, product.js importujemy jako domyslny, moze byc bez {}
import Cart from './components/Cart.js';

const app = {
  initMenu: function(){ //metoda wywolywana po iniData, bo korzysta z przygotowanej wczesniej referencji do danych (thisApp.data)
    const thisApp = this;
      
    for(let productData in thisApp.data.products){ //jej zadaniem jest przejscie po wszystkich obiektach produktow z thisApp.data.products i utworzenie dla kazdego z nich instacji klasy Product
      //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    } 
  },
    
  initData: function(){ //przugotowuje latwy dostep do danych, przypisuje do app.data (wlasciwosci calego obiketu app) referencje do dataSource
    const thisApp = this;

    //thisApp.data = dataSource; //referencja do dataSource, danych z ktorych korzystamy, znajduje sie tam m.in. products ze struktura produktow
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();

      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product.prepareCartProduct());
    });
  },

  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    
  },
};

app.init();
