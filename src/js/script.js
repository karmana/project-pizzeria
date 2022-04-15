/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = { // obiekt
    templateOf: { //obiekt
      menuProduct: '#template-menu-product', // wlasciwosc obiektu, ktora zawiera selektor do szablonu produktu 
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML), //metoda menuProduct jest tworzona za pomoca biblioteki Handlebars
  };

  class Product{ //klasa, wzorzec wedle, ktotrego tworzona jet kazda instancja
    constructor(id, data){
      const thisProduct = this;
      
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu(); //konstruktor uruchomi funckje renderInMenu od razu po utworzeniu instancji
      
      console.log('new Product:', thisProduct);
    }
    renderInMenu(){ //metoda, ktora renderuje, czyli tworzy produkty na stronie
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data); /* generate HTML based on template */ // wywoluje metode templates.menuProduct i przekazuje jej dane produktu, HTML - zwykly string
      
      thisProduct.element = utils.createDOMFromHTML(generatedHTML); /* create element using utils.createElementsFromHTML */ 
      // element DOM to obiekt wygenerowany przez przegladarke na podstawie kodu HTML
      // stworzony element DOM zapisujemy od razu jako wlasciwosc instancji, dzieki czemu bedziemy mieli do niej dostep w innych metodach instancji

      const menuContainer = document.querySelector(select.containerOf.menu);/* find menu container */
      
      menuContainer.appendChild(thisProduct.element); /* add element to menu */ //metoda appendChild dodaje stworzony element fo menu
      }

  }

  const app = {
    initMenu: function(){ //metoda wywolywana po iniData, bo korzysta z przygotowanej wczesniej referencji do danych (thisApp.data)
      const thisApp = this;
      console.log('thisAppData:', thisApp.data);

      for(let productData in thisApp.data.products){; //jej zadaniem jest przejscie po wszystkich obiektach produktow z thisApp.data.products i utworzenie dla kazdego z nich instacji klasy Product
        new Product(productData, thisApp.data.products[productData]);
      } 
    },
    
    initData: function(){ //przugotowuje latwy dostep do danych, przypisuje do app.data (wlasciwosci calego obiketu app) referencje do dataSource
      const thisApp = this;

      thisApp.data = dataSource; //referencja do dataSource, danych z ktorych korzystamy, znajduje sie tam m.in. products ze struktura produktow
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
