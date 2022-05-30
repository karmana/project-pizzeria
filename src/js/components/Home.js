//import Carousel from './Carousel.js';
import { select, classNames } from '../settings.js';


class Home{
  constructor(element){
    const thisHome = this;
      
    thisHome.render();
  }

  //   render(element){
  //     const thisHome = this;

  //     thisHome.dom.wrapper = element;
  //     // thisHome.dom.slider = document.querySelector(select.containerOf.slider);
  //     thisHome.dom.smallBoxes = document.querySelectorAll(select.containerOf.smallBoxes);
  //   }

  //   initWidget(){
  //     const thisHome = this;

  //     thisHome.tinySlider = new Carousel(thisHome.dom.slider);
  //   }


  render(){
    const thisHome = this;

    thisHome.boxes = document.querySelector(select.containerOf.boxes),
    thisHome.smallBoxes = document.querySelectorAll(select.boxes.smallBoxes);
    thisHome.boxesLinks = document.querySelectorAll(select.boxes.links);
  }

  
  activatePage(pageId){ //metoda, bedaca funkcja przyjmujaca jeden argument pageId
    const thisHome = this;

    /* add class "active" to matching pages, remove from non-matching */
    for(let page of thisHome.pages){
      // if(page.id == pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }

      page.classList.toggle(classNames.pages.active, page.id == pageId); //to samo co powyzszy kod
    }

    /* add class "active" to matching links, remove from non-matching */

    for(let link of thisHome.navLinks){ //dla kazdego z linkow zapisanych w thisHome.navLinks
      link.classList.toggle( //dodajemy lub usuwamy 
        classNames.nav.active, //klase active 
        link.getAttribute('href') == '#' + pageId); //w zaleznosci od tego czy atrybut href tego linka jest rowny # oraz id podstrony podanej jako argument w metodzie activatePage
    }
  }
}


export default Home;