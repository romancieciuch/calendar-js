import { routing }  from './routing.js';
import { misc }     from './misc.js';
import { Calendar } from './calendar.js';

window.calendar = new Calendar();

document.addEventListener("DOMContentLoaded", () => {
	routing();
	misc();
});