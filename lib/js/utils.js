"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.string.trim.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.parse-int.js");

/* global Handlebars, dataSource */
const utils = {}; // eslint-disable-line no-unused-vars

utils.createDOMFromHTML = function (htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

utils.createPropIfUndefined = function (obj, key) {
  let value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (!obj.hasOwnProperty(key)) {
    obj[key] = value;
  }
};

utils.serializeFormToObject = function (form) {
  let output = {};

  if (typeof form == 'object' && form.nodeName == 'FORM') {
    for (let field of form.elements) {
      if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
        if (field.type == 'select-multiple') {
          for (let option of field.options) {
            if (option.selected) {
              utils.createPropIfUndefined(output, field.name);
              output[field.name].push(option.value);
            }
          }
        } else if (field.type != 'checkbox' && field.type != 'radio' || field.checked) {
          utils.createPropIfUndefined(output, field.name);
          output[field.name].push(field.value);
        } else if (!output[field.name]) output[field.name] = [];
      }
    }
  }

  return output;
};

utils.convertDataSourceToDbJson = function () {
  const productJson = [];

  for (let key in dataSource.products) {
    productJson.push(Object.assign({
      id: key
    }, dataSource.products[key]));
  }

  console.log(JSON.stringify({
    product: productJson,
    order: []
  }, null, '  '));
};

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
Handlebars.registerHelper('joinValues', function (input, options) {
  return Object.values(input).join(options.fn(this));
});

utils.queryParams = function (params) {
  return Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
};

utils.numberToHour = function (number) {
  return Math.floor(number) % 24 + ':' + (number % 1 * 60 + '').padStart(2, '0');
};

utils.hourToNumber = function (hour) {
  const parts = hour.split(':');
  return parseInt(parts[0]) + parseInt(parts[1]) / 60;
};

utils.dateToStr = function (dateObj) {
  return dateObj.toISOString().slice(0, 10);
};

utils.addDays = function (dateStr, days) {
  const dateObj = new Date(dateStr);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

var _default = utils;
exports.default = _default;