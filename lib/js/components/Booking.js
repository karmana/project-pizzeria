"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.promise.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.json.stringify.js");

var _settings = require("../settings.js");

var _utils = _interopRequireDefault(require("../utils.js"));

var _AmountWidget = _interopRequireDefault(require("./AmountWidget.js"));

var _DatePicker = _interopRequireDefault(require("./DatePicker.js"));

var _HourPicker = _interopRequireDefault(require("./HourPicker.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.tableChosen = '';
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startDateParam = _settings.settings.db.dateStartParamKey + '=' + _utils.default.dateToStr(thisBooking.datePicker.minDate);

    const endDateParam = _settings.settings.db.dateEndParamKey + '=' + _utils.default.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      // dla kazdego z adresow url dodajemy nowa tablice, w ten sposob bedzie nam wygodniej zapisc parametry 
      booking: [startDateParam, endDateParam],
      eventsCurrent: [_settings.settings.db.notRepeatParam, startDateParam, endDateParam],
      eventsRepeat: [_settings.settings.db.repeatParam, endDateParam]
    }; // console.log('getData params', params);

    const urls = {
      bookings: _settings.settings.db.url + '/' + _settings.settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: _settings.settings.db.url + '/' + _settings.settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: _settings.settings.db.url + '/' + _settings.settings.db.event + '?' + params.eventsRepeat.join('&')
    }; // console.log('getData urls', urls);

    Promise.all([//operacja ktora ma byc wykonana to zestaw operacji
    fetch(urls.bookings), fetch(urls.eventsCurrent), fetch(urls.eventsRepeat)]).then(function (allResponses) {
      const bookingsResponse = allResponses[0];
      const eventsCurrentResponse = allResponses[1];
      const eventsRepeatResponse = allResponses[2];
      return Promise.all([bookingsResponse.json(), eventsCurrentResponse.json(), eventsRepeatResponse.json()]);
    }).then(function (_ref) {
      let [bookings, eventsCurrent, eventsRepeat] = _ref;
      //potraktuj pierwszy argument jako tablicy i pierwszy element z tej tablicy zapisz w zmiennej bookings
      // console.log('bookings:', bookings);
      // console.log('eventsCurrent', eventsCurrent);
      // console.log('eventsRepeat', eventsRepeat);
      thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
    });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = _utils.default.addDays(loopDate, 1)) {
          thisBooking.makeBooked(_utils.default.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    } // console.log('thisBooking.booked', thisBooking.booked);


    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = _utils.default.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      //   console.log('loop', hourBlock);
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value; //zapisujemy wlasciwosci date i hour w oparciu o nasze widgety - czyli dane ktore wybral uzytkownik

    thisBooking.hour = _utils.default.hourToNumber(thisBooking.hourPicker.value);
    let allAvailable = false; //zmienna bedzie oznaczac ze tego dnia o kazdej godzinie wszystkie stoliki sa dostepne, na wstepie false

    if (typeof thisBooking.booked[thisBooking.date] == 'undefined' //jesli dla tej daty 
    || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined' // i dla tej daty i godziny nie ma tablicy
    ) {
      allAvailable = true; // zmieniamy allAvailable na true 
    }

    for (let table of thisBooking.dom.tables) {
      // petla iteruje przez wszystkie stoliki
      let tableId = table.getAttribute(_settings.settings.booking.tableIdAttribute); //pobieramy tableId zapisane w settings

      if (!isNaN(tableId)) {
        //sprawdzamy czy tableId jest liczbą
        tableId = parseInt(tableId);
      }

      if (!allAvailable //czy ktorys stolik jest zajety
      && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) //jesli tableId jest w tablicy thisBooking.bookes tzn ze jest zarezerwowany
      ) {
        table.classList.add(_settings.classNames.booking.tableBooked);
      } else {
        table.classList.remove(_settings.classNames.booking.tableBooked);
      }
    }
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = _settings.templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML; //element.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(_settings.select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(_settings.select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(_settings.select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(_settings.select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(_settings.select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(_settings.select.booking.floorPlan);
    thisBooking.dom.name = thisBooking.dom.wrapper.querySelector(_settings.select.booking.name);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(_settings.select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(_settings.select.booking.address);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(_settings.select.booking.starters);
    thisBooking.dom.startersCheck = thisBooking.dom.wrapper.querySelectorAll(_settings.select.booking.startersCheck);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(_settings.select.booking.form); //thisBooking.dom.form = element.querySelector(select.booking.form);

    thisBooking.dom.submit = document.querySelector(_settings.select.booking.submit);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new _AmountWidget.default(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new _AmountWidget.default(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new _DatePicker.default(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new _HourPicker.default(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function (event) {
      thisBooking.updateDOM();
      thisBooking.resetTable();
      thisBooking.initTables(event);
    });
    thisBooking.dom.floorPlan.addEventListener('click', function (event) {
      thisBooking.initTables(event);
    });
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
    console.log(thisBooking);
  }

  initTables(event) {
    const thisBooking = this;
    const clickedElement = event.target;
    const chosenTableId = clickedElement.getAttribute(_settings.settings.booking.tableIdAttribute); // sprawdzam czy faktycznie kliknięto stolik i czy stolik jest wolny 

    if (clickedElement.classList.contains('table') && !clickedElement.classList.contains(_settings.classNames.booking.tableBooked)) {
      //jesli tak, to sprawdzam, czy stolik nie ma nadanej klasy selected 
      if (!clickedElement.classList.contains(_settings.classNames.booking.tableSelected)) {
        thisBooking.resetTable(clickedElement); // jesli tak to dodaje do stolika klase selected            

        clickedElement.classList.add(_settings.classNames.booking.tableSelected); // i przypisuje numer stolika do wlasciwosci thisBooking.tableChosen

        thisBooking.tableChosen = chosenTableId;
      } else {
        clickedElement.classList.remove(_settings.classNames.booking.tableSelected);
        thisBooking.tableChosen = '';
      }
    } else if (clickedElement.classList.contains(_settings.classNames.booking.tableBooked)) {
      // jesli nie pokazuje alert, z komunikatem o zajetosci stolika 
      alert('W wybranym terminie ten stolik jest zajęty');
    }
  }

  resetTable(chosenTableId) {
    const thisBooking = this;

    for (let table of thisBooking.dom.tables) {
      const tableId = table.getAttribute(_settings.settings.booking.tableIdAttribute);

      if (tableId === chosenTableId) {// console.log('tableId', tableId);
      } else if (table.classList.contains(_settings.classNames.booking.tableSelected)) table.classList.remove(_settings.classNames.booking.tableSelected);
    }
  }

  resetBooking() {
    const thisBooking = this;
    alert('Twoja rezerwacja została wysłana. Do zobaczenia!');

    for (let checkbox of thisBooking.dom.startersCheck) {
      checkbox.checked = false;
    }

    thisBooking.peopleAmountWidget.value = 1;
    thisBooking.hoursAmountWidget.value = 1;
    thisBooking.dom.name.value = '';
    thisBooking.dom.phone.value = '';
    thisBooking.dom.address.value = '';
  }

  sendBooking() {
    const thisBooking = this;
    const url = _settings.settings.db.url + '/' + _settings.settings.db.booking; //console.log('url', url);

    const payload = {};
    console.log('payload', payload);
    payload.date = thisBooking.datePicker.value; // data wybrana w datePickerze

    payload.hour = thisBooking.hourPicker.value; //thisBooking.hourPicker.value; // godzina wybrana w hourPicekrze w formacie HH:ss

    payload.table = parseInt(thisBooking.tableChosen); // LICZBA - numer wybranego stolika lub null jesli nic nie wybrano

    payload.duration = parseInt(thisBooking.hoursAmountWidget.value); // LICZBA -liczba godzin wybrana przez klienta 

    payload.ppl = parseInt(thisBooking.peopleAmountWidget.value); // LICZBA - wybrana liczba osob 

    payload.starters = [];
    payload.name = thisBooking.dom.name.value;
    payload.phone = thisBooking.dom.phone.value; // numer telefonu z formualrza

    payload.address = thisBooking.dom.address.value; // adres z formualrza 

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked) {
        payload.starters.push(starter.value);
      }
    }

    console.log('payload:', payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    fetch(url, options).then(function (response) {
      return response.json();
    }).then(function (parsedResponse) {
      thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
      thisBooking.updateDOM();
      thisBooking.resetTable();
      thisBooking.resetBooking();
      console.log('parsedResponse', parsedResponse);
    });
  }

}

var _default = Booking;
exports.default = _default;