window.view = (params) => {

	const month = params[0] ?? "";
	const days = calendar.get_month_view(month);
	if (!days)
		window.location.hash = "404";

	console.log(days);

	document.querySelector("[data-title]").innerHTML = days.nice_date;


	// Nawigacja
	const navi = calendar.get_date_prev_next(month);
	document.querySelector("[data-prev]").href = `#month/${navi.month.prev}`;
	document.querySelector("[data-next]").href = `#month/${navi.month.next}`;

	document.querySelector("[data-month]").innerHTML = render_month_events();

	function render_month_events () {
		let html = ``;
		for (let el of days.days) {

			// Całodzienne
			let all_day = ``;
			for (let event of el.all_day) {
				let multiday_class = ``;

				if (event.is_multi_day) {
					if (event.is_first_day) multiday_class = ` month-event__multi_day month-event__first_day`;
					if (event.is_middle_day) multiday_class = ` month-event__multi_day month-event__middle_day`;
					if (event.is_last_day) multiday_class = ` month-event__multi_day month-event__last_day`;
				}

				all_day += `
					<a
						class="month-event month-event__all_day${multiday_class}"
						href="#event/${event.id}" style="background: ${event.color}"
						title="${event.title}"
					>
						${event.title}
					</a>
				`;
			}

			// Godzinowe
			let timed = ``;
			for (let event of el.timed)
				timed += `
					<a
						class="month-event month-event__timed"
						href="#event/${event.id}" style="border-color: ${event.color}"
						title="${event.start} &bull; ${event.title}"
					>
						${event.start} &bull; ${event.title}
					</a>
				`;

			html += `
				<div class="day ${el.type}-month ${el.is_today ? ' today' : ''}">
					<a href="#day/${el.ymd}" class="day-number">${el.date.getDate()}</a>
					${all_day}
					${timed}
				</div>
			`;
		}

		return html;
	}

};