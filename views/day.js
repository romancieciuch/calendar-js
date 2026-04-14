window.view = (params) => {

	const date = params[0] ?? 0;
	const day = window.calendar.get_day_view(date);
	if (!day)
		window.location.hash = "404";

	document.querySelector("[data-title]").innerHTML = day.nice_date;

	console.log(day);


	// Nawigacja
	const navi = window.calendar.get_date_prev_next(date);
	document.querySelector("[data-prev]").href = `#day/${navi.day.prev}`;
	document.querySelector("[data-next]").href = `#day/${navi.day.next}`;


	document.querySelector("[data-events]").innerHTML = render_day_timed_events();
	document.querySelector("[data-all-day-events]").innerHTML = render_day_all_day_events();


	function render_day_timed_events () {
		// Wydarzenia godzinowe
		let html = ``;
		let n = 0;
		for (let el of day.timed) {
			html += `
				<a class="day-event" href="#event/${el.id}"
					style="top: calc(((${el.start_hour} + ${el.start_minutes / 60}) - 6) * var(--hour-height));
					left: calc((${n}) * var(--event-width));
					width: calc(var(--event-width));
					height: calc(${el.duration_hours} * var(--hour-height));
					background-color: ${el.color}">
					${el.start} &bull; ${el.title}
				</a>
			`;
			n++;
		}

		return html;
	}

	function render_day_all_day_events () {
		// Wydarzenia całodniowe
		let html = ``;
		for (let el of day.all_day)
			html += `
				<a class="day-event day-event__all-day" href="#event/${el.id}" style="background-color: ${el.color}">
					${window.calendar.format_event_date(el)} &bull; ${el.title}
				</a>
			`;

		return html;
	}

};