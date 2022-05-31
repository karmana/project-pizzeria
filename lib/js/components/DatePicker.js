"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseWidget = _interopRequireDefault(require("../components/BaseWidget.js"));

var _utils = _interopRequireDefault(require("../utils.js"));

var _settings = require("../settings.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DatePicker extends _BaseWidget.default {
  constructor(wrapper) {
    super(wrapper, _utils.default.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(_settings.select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date();
    thisWidget.maxDate = _utils.default.addDays(thisWidget.minDate, _settings.settings.datePicker.maxDaysInFuture); // eslint-disable-next-line no-undef

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        firstDayOfWeek: 1
      },
      disable: [function (date) {
        return date.getDay() === 1;
      }],
      onChange: function onChange(selectedDates, dateStr) {
        thisWidget.value = dateStr;
      }
    });
  }

  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {}

}

var _default = DatePicker;
exports.default = _default;