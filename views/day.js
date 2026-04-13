window.view = (params) => {

	const date = params[0] ?? 0;
	const day = window.calendar.get_day_view(date);
	if (!day)
		window.location.hash = "404";

	document.querySelector("[data-title]").innerHTML = day.nice_date;

	console.log(day);

	let html = ``;
	for (let el of day.timed)
		html += `
			<a class="day-event" href="#event/${el.id}"
				style="top: calc((${el.start_hour} - 6) * var(--hour-height)); height: calc(${el.duration_hours} * var(--hour-height)); background-color: ${el.color}">
				${el.start} ${el.title}
			</a>
		`;

	document.querySelector("[data-events]").innerHTML = html;

};