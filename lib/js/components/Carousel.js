"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _settings = require("../settings.js");

var _tinySlider = require("/node_modules/tiny-slider/src/tiny-slider");

// import { tns } from '../../node_modules/tiny-slider/src/tiny-slider';
class Carousel {
  constructor(element) {
    const thisCarousel = this;
    thisCarousel.render(element);
    thisCarousel.initPlugin();
  }

  render(element) {
    const thisCarousel = this;
    thisCarousel.dom = {};
    thisCarousel.dom.wrapper = element;
    thisCarousel.dom.container = document.querySelector(_settings.select.containerOf.Carousel);
  }

  initPlugin() {
    const thisCarousel = this;
    const slider = (0, _tinySlider.tns)({
      container: thisCarousel.dom.container,
      items: 3,
      autoplay: true
    });
    thisCarousel.dom.container = slider;
  }

}

var _default = Carousel;
exports.default = _default;