class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value(){ //getter, metoda wykonywana przy kazdej probie odczytania wlasciwosci wartosci value
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value){
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value); // konwertuje wartosc na liczbe calkowita !! bo kazdy input, nawet o typie number zwraca wrtosc w formiacie tekstowym

    if(newValue != thisWidget.correctValue && thisWidget.isValid(newValue)){ 
      thisWidget.correctValue = newValue; // zapisuje we wlasciwosci thisWidget.correctValue wartosc przekazanego argumentu
      thisWidget.announce(); // wywoluje metode announce
    }
    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){  //metoda ktora sluzy do wyswietlania na stronie wartosci widgetu
    const thisWidget = this;
    thisWidget.dom.wrapper.innerHTML = thisWidget.value; //aktualizuje wartosc inputu
  } 

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;