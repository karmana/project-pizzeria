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
      defaultMin: 0,
      defaultMax: 10,
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
      thisProduct.getElements();
      thisProduct.initAccordion(); 
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder(); 

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
   
    getElements(){ // tworze metode getElements, ktora szuka elementow w konterze produktu -> by nie wyszukiwac tych samych elementow wielokrotnie
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){ // tworze metode initAccordion 
      const thisProduct = this;
  
      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable); /* find the clickable trigger (the element that should react to clicking) */
      // wykorzystuje elementy z metody getElements - definiowanie nowej zmiennej jest zbedne 
      // clickableTrigger.addEventListener('click', function(event) {
      
      thisProduct.accordionTrigger.addEventListener('click', function(event) { /* START: add event listener to clickable trigger on event click */
      
      event.preventDefault();  /* prevent default action for event */

        const activeProduct = document.querySelector(select.all.menuProductsActive); /* find active product (product that has active class) */
        //console.log('active produts:', activeProduct);

        if(activeProduct != null && thisProduct.element) {  /* if there is active product and it's not thisProduct.element, remove class active from it */
          activeProduct.classList.remove('active'); /* != null sprawdza czy element DOM udalo sie znalezc, !=thisProduct.element - sprawdza czy aktywny produkt jest rozny od elementu biezacego */
          }
  
        thisProduct.element.classList.toggle('active');    /* toggle active class on thisProduct.element */  /* toogle - jesli danej klasy nie ma - dodaje, jesli jest - zabiera */                                          
    });

    }

    initOrderForm(){ // tworze metode initOrderForm, ktora jest odpowiedzialna za dodanie listenerow evntow do formularza, jego kontrolek, guzika add to cart
      const thisProduct = this;

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault(); // blokuje domyslna akcje, czyli wyslanie strony z przeladowaniem formularza
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault(); // blokuje domyslana akcje, czyli zmiane adresu strony po kliknieciu w link
        thisProduct.processOrder();
      });

      //console.log('initOrderForm');

    }

    processOrder(){ // tworze metode processOrder
      const thisProduct = this;

    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);

      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
       //console.log(paramId, param);

        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          //console.log('option', optionId, option);
              
          /* weryfikacja czy dana opcja jest zaznaczona */
          /* 1. czy obiekt formData zawiera wlasciwosc o klczu takim jak klucz parametru (powinien)  */
          /* 2. czy w tablicy zapisnej pod tym kluczem znajduje sie klucz opcji */
          /* jesli 1 i 2 sa prawdziwe to znaczy ze opcja jest zaznaczona */  
           const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
           //console.log('Selected?', optionSelected);

            if(optionSelected){
                // sprawdzam czy opcja nie jest domyslna 
               if(!option.default == true){
                 //dodaje cene opcji do zmiennej price
                 price += option.price;
               }
              }
            else{
                //sprawdzam czy opcja jest domyslna
                if(option.default == true){
                  price -= option.price;
                }
               }
            
            /* dodaje czesc odpowiedzialna za obsluge obrazkow */ 
               //szukam obrazka w divie z obrazkami
               const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
               //console.log(thisProduct.imageWrapper);

              if(optionImage){
                if(optionSelected){
                optionImage.classList.add(classNames.menuProduct.imageVisible);
              }
              else{
                optionImage.classList.remove(classNames.menuProduct.imageVisible);
              }
            }
            }
        }
      /* multiply price by amount */
      price *= thisProduct.amountWidget.value; 

      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder(); //po wykryciu eventu updated zostanie uruchomiona metoda processOrder
      });
    }
  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;
      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value); // dzieki temu na starcie instancja ma juz info co jest w inpucie, przez zmianami jakie wprowadzi uzytkownik 
      thisWidget.initActions();

      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);
    }

    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.value = settings.amountWidget.defaultValue;
    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value); // konwertuje wartosc na liczbe calkowita !! bo kazdy input, nawet o typie number zwraca wrtosc w formiacie tekstowym

      if(
        thisWidget.value !== newValue 
        && !isNaN(newValue)
        && newValue >= settings.amountWidget.defaultMin
        && newValue <= settings.amountWidget.defaultMax
        ){
        
        thisWidget.value = newValue; // zapisuje we wlasciwosci thisWidget.value wartosc przekazanego argumentu
      
      }
      
      thisWidget.announce(); // wywoluje metode announce

      thisWidget.input.value = thisWidget.value; //aktualizuje wartosc inputu

    }

    initActions(){
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input);
      });

      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1) 
      });

      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1) 
      });

    }

    announce(){
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }

  }

  const app = {
    initMenu: function(){ //metoda wywolywana po iniData, bo korzysta z przygotowanej wczesniej referencji do danych (thisApp.data)
      const thisApp = this;
     // console.log('thisAppData:', thisApp.data);

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
