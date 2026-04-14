import { routing }  from './routing.js?v=1';
import { misc }     from './misc.js?v=1';
import { Calendar } from './calendar.js?v=1';

window.calendar = new Calendar();

document.addEventListener("DOMContentLoaded", () => {
	routing();
	misc();
});