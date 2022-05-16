import {settings, select} from '../settings.js';

class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value); // dzieki temu na starcie instancja ma juz info co jest w inpucie, przez zmianami jakie wprowadzi uzytkownik 
    thisWidget.initActions();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
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
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });

  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;