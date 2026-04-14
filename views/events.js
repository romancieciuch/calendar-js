window.view = (params) => {

	// Zaznacz wszystkie
	document.querySelector("button[data-select-all]").addEventListener("click", () => {
		for (let el of document.querySelectorAll(".list-event"))
			el.querySelector("input").checked = true;

		console.log("Wszystkie zaznaczone");
	});

	// Odznacz wszystkie
	document.querySelector("button[data-deselect-all]").addEventListener("click", () => {
		for (let el of document.querySelectorAll(".list-event"))
			el.querySelector("input").checked = false;

		console.log("Wszystkie odznaczone");
	});

	// Eksportuj zaznaczone
	document.querySelector("button[data-export-selected]").addEventListener("click", () => {
		const ids = [...document.querySelectorAll(".list-event input:checked")]
						.map(el => el.value);

		window.calendar.export_events_to_ics(ids);

		console.log("Eksportuję wydarzenia: ");
		console.log(ids);
	});

	// Usuń zaznaczone
	document.querySelector("button[data-delete-selected]").addEventListener("click", () => {
		for (let el of document.querySelectorAll(".list-event input:checked")) {

			let res = window.calendar.delete_event(el.value);
			el.closest(".list-event").remove();

			console.log(`Usuwam wydarzenie: ${el.value} (${res})`);
		}
	});

	// Filtrowanie listy
	const limit = 5;
	let offset = 0;
	let loading = false;

	const observer = new IntersectionObserver((entries) => {
		const entry = entries[0];
		if (!entry.isIntersecting || loading) return;

		offset += limit;
		render();
	}, {
		root: null,
		rootMargin: "100px",
		threshold: 0
	});

	observer.observe(document.querySelector("[data-events-list-sentinel]"));

	render();


	// Obsługa szukajki
	let search_timeout;

	document.querySelector("[data-search]").addEventListener("input", () => {
		clearTimeout(search_timeout);

		search_timeout = setTimeout(() => {
			offset = 0;
			loading = false;

			document.querySelector("[data-events-list]").innerHTML = "";

			observer.disconnect();
			observer.observe(document.querySelector("[data-events-list-sentinel]"));

			render();
		}, 300);
	});


	function render () {
		if (loading) return;
		loading = true;

		const events_list = document.querySelector("[data-events-list]");
		const search = document.querySelector("[data-search]");
		const events = window.calendar.get_events_by_range("0000-01-01", "9999-12-31", offset, limit, search.value ?? null);

		if (events.length === 0) {
			observer.disconnect();
			loading = false;
			return;
		}

		let html = ``;

		for (let el of events) {
			const date_info = window.calendar.superdate(el.start);

			let desc = ``;
			if (el.desc) desc = `<p class="event-desc">${el.desc}</p>`;

			html += `
				<div class="list-event">
					<div class="event-checkbox checkbox">
						<input type="checkbox" id="${el.id}" name="events[]" value="${el.id}">
						<label for="${el.id}" class="checkbox-box"></label>
					</div>
					<div class="event-date" style="background-color: ${el.category_info?.color || '#000000'}">
						<span class="event-day">${date_info.day}</span>
						<span class="event-month">${date_info.month_short}</span>
					</div>

					<div class="event-content">
						<h3 class="event-title">
							<a href="#event/${el.id}">
								${el.title}
							</a>
						</h3>
						<span class="event-time">${window.calendar.format_event_date(el)}</span>
						${desc}
					</div>
				</div>
			`;
		}

		events_list.insertAdjacentHTML("beforeend", html);
		loading = false;
	}

};