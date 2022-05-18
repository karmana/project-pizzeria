import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
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
    thisBooking.dom.hoursPickerWidget = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePickerWidget = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
  } 

  initWidgets(){
    const thisBooking = this;
    
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    //thisBooking.dom.peopleAmountWidget.addEventListener('', function(){});

    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    // thisBooking.dom.hoursAmountWidget.addEventListener('', function(){});

    thisBooking.hoursPickerWidget = new HourPicker(thisBooking.dom.hoursPickerWidget);
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePickerWidget);
  }
}

export default Booking;