window.view = (params) => {

	const date = params[0] ?? 0;
	const day = window.calendar.get_day_view(date);
	if (!day)
		window.location.hash = "404";

	document.querySelector("[data-title]").innerHTML = day.nice_date;

	console.log(day);

	// Wydarzenia godzinowe
	let html = ``;
	let n = 0;
	for (let el of day.timed) {
		html += `
			<a class="day-event" href="#event/${el.id}"
				style="top: calc((${el.start_hour} - 6) * var(--hour-height));
				left: calc((${n}) * var(--event-width));
				width: calc(var(--event-width));
				height: calc(${el.duration_hours} * var(--hour-height));
				background-color: ${el.color}">
				${el.start} &bull; ${el.title}
			</a>
		`;
		n++;
	}

	document.querySelector("[data-events]").innerHTML = html;

	// Wydarzenia całodniowe
	let html2 = ``;
	for (let el of day.all_day)
		html2 += `
			<a class="day-event day-event__all-day" href="#event/${el.id}" style="background-color: ${el.color}">
				${window.calendar.format_event_date(el)} &bull; ${el.title}
			</a>
		`;

	document.querySelector("[data-all-day-events]").innerHTML = html2;

};