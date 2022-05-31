"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _settings = require("../settings.js");

var _BaseWidget = _interopRequireDefault(require("./BaseWidget.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AmountWidget extends _BaseWidget.default {
  // zaznaczamy, ze classa AmountWidget jest rozszerzenie klasy BaseWidget
  constructor(element) {
    super(element, _settings.settings.amountWidget.defaultValue); //wskazujemy konstruktor klasy nadrzednej, czyli BaseWidget, i argumenty, ktore basewidget wymaga 

    const thisWidget = this;
    thisWidget.getElements(element); // thisWidget.setValue(thisWidget.dom.input.value); // dzieki temu na starcie instancja ma juz info co jest w inpucie, przez zmianami jakie wprowadzi uzytkownik ; comment - przekazujemy teraz ten argument w kontruktorze

    thisWidget.initActions(); // console.log('AmountWidget:', thisWidget);
    // console.log('constructor arguments:', element); 
  }

  getElements() {
    const thisWidget = this; //thisWidget.dom.wrapper = element; //comment - tym teraz zajmuje sie BaseWidget

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(_settings.select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(_settings.select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(_settings.select.widgets.amount.linkIncrease); //thisWidget.value = settings.amountWidget.defaultValue; //przekazujemy teraz ten argument w kontruktorze
  }

  isValid(value) {
    return !isNaN(value) && value >= _settings.settings.amountWidget.defaultMin && value <= _settings.settings.amountWidget.defaultMax;
  }

  renderValue() {
    //metoda ktora sluzy do wyswietlania na stronie wartosci widgetu
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value; //aktualizuje wartosc inputu
  }

  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function () {
      // thisWidget.setValue(thisWidget.dom.input);
      thisWidget.value = thisWidget.dom.input.value;
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

}

var _default = AmountWidget;
exports.default = _default;