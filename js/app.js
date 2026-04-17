const ver = 10;

import { load_view }  from './routing.js?v=9';
import { misc }       from './misc.js?v=9';
import { Calendar }   from './calendar.js?v=9';

window.calendar = new Calendar();

document.addEventListener("DOMContentLoaded", () => {

	window.addEventListener("hashchange", () => {
		calendar.update_local_data();
		load_view(ver);
	});

	load_view(ver);
	misc();
});