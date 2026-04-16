window.view = (params) => {

	const week = params[0] ?? "";
	const days = calendar.get_week_view(week);
	if (!days)
		window.location.hash = "404";

	console.log(days);

	document.querySelector("[data-title]").innerHTML = days.nice_date;


	// Nawigacja
	const navi = calendar.get_date_prev_next(week);


	document.querySelector("[data-prev]").href = `#week/${navi.week.prev}`;
	document.querySelector("[data-next]").href = `#week/${navi.week.next}`;

	document.querySelector("[data-week-header]").innerHTML = render_week_header(week);
	document.querySelector("[data-week-body]").innerHTML += render_week_events(days);

	function render_week_events (week) {
		let html = "";

		week.days.forEach(day => {
			let dayHTML = "";

			let n = 0;
			day.all_day.forEach(e => {
				const top = `calc(${n} * var(--event-height) + ${n * 2}px)`;

				let multiday_class = ` week-event__all_day`;
				if (e.is_multi_day) {
					if (e.is_first_day) multiday_class = ` week-event__multi_day week-event__first_day`;
					if (e.is_middle_day) multiday_class = ` week-event__multi_day week-event__middle_day`;
					if (e.is_last_day) multiday_class = ` week-event__multi_day week-event__last_day`;
				}

				dayHTML += `
					<a
						class="week-event${multiday_class}"
						href="#event/${e.id}"
						style="top: ${top}; background:${e.color};"
						title="${e.title}"
					>
						${e.title}
					</a>
				`;

				n++;
			});

			n = 0;
			day.timed.forEach(e => {
				const start = new Date(`${day.ymd}T${e.start}`);
				const end = new Date(e.end);

				const startHour = start.getHours() + start.getMinutes() / 60;
				const endHour = end.getHours() + end.getMinutes() / 60;

				const duration = endHour - startHour;

				// 🔥 pozycja względem siatki (zakładamy start od 6:00)
				const top = `calc((${startHour} - 5) * var(--hour-height))`;
				const left = `${n * (1 / day.timed.length) * 100}%`;
				const width = `${(1 / day.timed.length) * 100}%`;
				const height = `calc(${duration} * var(--hour-height))`;

				const time =
					String(start.getHours()).padStart(2, "0") +
					":" +
					String(start.getMinutes()).padStart(2, "0");

				dayHTML += `
					<a
						class="week-event"
						href="#event/${e.id}"
						style="top: ${top};
							left: ${left};
							width: ${width};
							height: ${height};
							background:${e.color};"
						title="${time} &bull; ${e.title}"
					>
						${time} &bull; ${e.title}
					</a>
				`;

				n++;
			});

			html += `<div class="week-day${day.is_today ? ' today' : ''}">${dayHTML}</div>`;
		});

		return html;
	}

	function render_week_header (date = new Date()) {
		let d = new Date(date);
		if (isNaN(d)) d = new Date(Date.now());

		// znajdź poniedziałek
		const day = d.getDay() || 7;
		const monday = new Date(d);
		monday.setDate(d.getDate() - day + 1);

		const daysShort = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
		const monthsShort = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];

		let html = `<div></div>`; // puste pole (godziny)

		for (let i = 0; i < 7; i++) {
			const dayDate = new Date(monday);
			dayDate.setDate(monday.getDate() + i);

			const ymd = calendar.toYMD(dayDate);
			const dayNum = dayDate.getDate();
			const month = monthsShort[dayDate.getMonth()];

			html += `
				<div>
					<a href="#day/${ymd}">
						${daysShort[i]}, ${dayNum} ${month}
					</a>
				</div>
			`;
		}

		return html;
	}

};