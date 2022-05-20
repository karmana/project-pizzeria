import {classNames, select, settings, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';


class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.tableChosen = '';

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTables();

  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = { // dla kazdego z adresow url dodajemy nowa tablice, w ten sposob bedzie nam wygodniej zapisc parametry 
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ]
    };

    // console.log('getData params', params);

    const urls = {
      bookings:        settings.db.url + '/' + settings.db.booking 
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event   
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event   
                                      + '?' + params.eventsRepeat.join('&'),
    };
    // console.log('getData urls', urls);

    Promise.all([ //operacja ktora ma byc wykonana to zestaw operacji, ktory ma zostac wykonany
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      }) 
      .then(function([bookings, eventsCurrent, eventsRepeat]){ //potraktuj pierwszy argument jako tablicy i pierwszy element z tej tablicy zapisz w zmiennej bookings
        // console.log('bookings:', bookings);
        // console.log('eventsCurrent', eventsCurrent);
        // console.log('eventsRepeat', eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
      
    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    // console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
    //   console.log('loop', hourBlock);
    
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
    
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value; //zapisujemy wlasciwosci date i hour w oparciu o nasze widgety - czyli dane ktore wybral uzytkownik
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable= false; //zmienna bedzie oznaczac ze tego dnia o kazdej godzinie wszystkie stoliki sa dostepne, na wstepie false

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined' //jesli dla tej daty 
          ||
          typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined' // i dla tej daty i godziny nie ma tablicy
    ){
      allAvailable = true; // zmieniamy allAvailable na true 
    }
    for(let table of thisBooking.dom.tables){ // petla iteruje przez wszystkie stoliki
      let tableId = table.getAttribute(settings.booking.tableIdAttribute); //pobieramy tableId zapisane w settings
      if(!isNaN(tableId)){ //sprawdzamy czy tableId jest liczbą
        tableId = parseInt(tableId);  
      }

      if(
        !allAvailable //czy ktorys stolik jest zajety
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) //jesli tableId jest w tablicy thisBooking.bookes tzn ze jest zarezerwowany
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    //element.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
  } 

  initWidgets(){
    const thisBooking = this;
    
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(event){
      thisBooking.updateDOM();
      thisBooking.resetTable();
      thisBooking.initTables(event); 
    });
  }

  initTables(){
    const thisBooking = this;

    thisBooking.dom.floorPlan.addEventListener('click', function(event){
      event.preventDefault();

      const clickedElement = event.target;
      const chosenTableId = clickedElement.getAttribute(settings.booking.tableIdAttribute);
      //   console.log('clickedElement', clickedElement);
      //   console.log('chosenTableId', chosenTableId);
    
      // sprawdzam czy faktycznie kliknięto stolik i czy stolik jest wolny 
      if(clickedElement.classList.contains('table') && !clickedElement.classList.contains(classNames.booking.tableBooked)){
        //jesli tak, to sprawdzam, czy stolik nie ma nadanej klasy selected 
        if(!clickedElement.classList.contains(classNames.booking.tableSelected)){
          thisBooking.resetTable(clickedElement); 
          // jesli tak to dodaje do stolika klase selected            
          clickedElement.classList.add(classNames.booking.tableSelected);
       
          // i przypisuje numer stolika do wlasciwosci thisBooking.tableChosen
          thisBooking.tableChosen = chosenTableId;
        //   console.log('tableChosen', thisBooking.tableChosen);
        } else { 
          clickedElement.classList.remove(classNames.booking.tableSelected);
          thisBooking.tableChosen = '';
        //   console.log('tableChosen', thisBooking.tableChosen);
        }
      }else if (clickedElement.classList.contains(classNames.booking.tableBooked)){ 
        // jesli nie pokazuje alert, z komunikatem o zajetosci stolika 
        alert('W wybranym terminie ten stolik jest zajęty');
      }
    });
  }

  resetTable(chosenTableId){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables){
      const tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(tableId === chosenTableId){
        // console.log('tableId', tableId);
      }
      else if(table.classList.contains(classNames.booking.tableSelected))
        table.classList.remove(classNames.booking.tableSelected);
    }
  }
}

export default Booking;