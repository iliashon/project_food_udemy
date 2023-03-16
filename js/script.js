require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

import tabs  from './modules/tabs';
import modal  from './modules/modal';
import timer  from './modules/timer';
import cards from './modules/cards';
import forms  from './modules/forms';
import slider  from './modules/slider';
import calc  from './modules/calc';
import { openModal } from './modules/modal';

window.addEventListener('DOMContentLoaded', () =>{
  const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 5000);

  tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
  cards();
  modal("[data-modal]", ".modal", modalTimerId);
  calc();
  forms('form');
  slider({
    container: ".offer__slider",
    nextArrow: ".offer__slider-next",
    prevArrow: ".offer__slider-prev",
    totalCounter: "#total",
    slide: ".offer__slide",
    wrapper: ".offer__slider-wrapper",
    currentCounter: "#current",
    field: ".offer__slider-inner"
  });
  timer('.timer', '2023-05-14');

});