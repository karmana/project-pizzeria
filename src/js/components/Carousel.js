import { select } from '../settings.js';
// import { tns } from '../../node_modules/tiny-slider/src/tiny-slider';
import { tns } from '/node_modules/tiny-slider/src/tiny-slider';



class Carousel{
  constructor(element){
    const thisCarousel = this;
      
    thisCarousel.render(element);
    thisCarousel.initPlugin();
  }

  render(element){
    const thisCarousel = this;

    thisCarousel.dom = {};
    thisCarousel.dom.wrapper = element;
    thisCarousel.dom.container = document.querySelector(select.containerOf.Carousel);

  }

  initPlugin(){
    const thisCarousel = this;

    const slider = tns({
      container: thisCarousel.dom.container,
      items: 3,
      autoplay: true,
    });

    thisCarousel.dom.container = slider;

  }
}


export default Carousel;