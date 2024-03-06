import Placeholders from '../components/placeholders/placeholders.js';
import Slider from '../components/slider/slider.js';

import Scroll from '../utils/scroll.js';

import { constants, instances } from '../store/index.js';

import '../css/index.scss'

constants.isDevice = 'ontouchstart' in window;
constants.isDevice && document.body.classList.add('is-device');

// set vh css var
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

instances.scroll = new Scroll();
instances.scroll.init();

const placeholders = new Placeholders();
placeholders.init();

instances.slider = new Slider();
instances.slider.init();
