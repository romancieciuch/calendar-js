window.view = (params) => {

	const week = params[0] ?? "";
	const days = window.calendar.get_week_view(week);
	if (!days)
		window.location.hash = "404";

	console.log(days);

	document.querySelector("[data-title]").innerHTML = days.nice_date;


	// Nawigacja
	const navi = window.calendar.get_date_prev_next(week);

	console.log(navi);

	document.querySelector("[data-prev]").href = `#week/${navi.week.prev}`;
	document.querySelector("[data-next]").href = `#week/${navi.week.next}`;


	// <div class="week-day">
	// 	<a
	// 		class="week-event"
	// 		href="#event/12345678"
	// 		style="top: calc((9 - 8) * var(--hour-height)); height: calc(1 * var(--hour-height));"
	// 	>9:00 Spotkanie</a>
	// </div>


	// let html = ``;
	// for (let el of days.days) {

	// 	// Całodzienne
	// 	let all_day = ``;
	// 	for (let event of el.all_day) {
	// 		let multiday_class = ``;

	// 		if (event.is_multi_day) {
	// 			if (event.is_first_day) multiday_class = ` month-event__multi_day month-event__first_day`;
	// 			if (event.is_middle_day) multiday_class = ` month-event__multi_day month-event__middle_day`;
	// 			if (event.is_last_day) multiday_class = ` month-event__multi_day month-event__last_day`;
	// 		}

	// 		all_day += `
	// 			<a class="month-event month-event__all_day${multiday_class}" href="#event/${event.id}" style="background: ${event.color}">
	// 				${event.title}
	// 			</a>
	// 		`;
	// 	}

	// 	// Godzinowe
	// 	let timed = ``;
	// 	for (let event of el.timed)
	// 		timed += `
	// 			<a class="month-event month-event__timed" href="#event/${event.id}" style="border-color: ${event.color}">
	// 				${event.start} &bull; ${event.title}
	// 			</a>
	// 		`;

	// 	html += `
	// 		<div class="day ${el.type}-month ${el.is_today ? ' today' : ''}">
	// 			<a href="#day/${el.ymd}" class="day-number">${el.date.getDate()}</a>
	// 			${all_day}
	// 			${timed}
	// 		</div>
	// 	`;
	// }

	// document.querySelector("[data-month]").innerHTML = html;




};