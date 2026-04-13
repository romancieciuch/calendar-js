export class Calendar {
	#events_storage = "events";
	#categories_storage = "categories";

	// Ogólne

	generate_id (prefix = "evt-") {
		return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2);
	}

	save (type, data) {
		localStorage.setItem(type, JSON.stringify(data));
	}

	format_event_date (event) {
		if (!event.start || !event.end) return "Brak daty";

		const startDate = new Date(event.start);
		const endDate = new Date(event.end);

		if (event.all_day) {
			const formatter = new Intl.DateTimeFormat('pl-PL', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				timeZone: 'UTC'
			});

			return formatter.formatRange(startDate, endDate);
		} else {
			const formatter = new Intl.DateTimeFormat('pl-PL', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});

			return formatter.formatRange(startDate, endDate);
		}
	}

	format_for_datetime_local (utcString) {
		if (!utcString) return "";

		const date = new Date(utcString);
		const tzOffset = date.getTimezoneOffset() * 60000;
		const localDatetime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

		return localDatetime;
	}

	polish_month_name (number = 0) {
		const months = ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"];
		return months[number];
	}

	polish_date (date) {
		date = new Date(date);

		if (isNaN(date)) return "";

		return date.toLocaleDateString("pl-PL", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	}

	get_date_prev_next (date) {
		date = new Date(date);

		if (isNaN(date)) return null;

		// klon daty, żeby nie ruszać oryginału, na podstawie liczby sekund
		const clone = (d) => new Date(d.getTime());

		// dzień
		const prevDay = clone(date);
		prevDay.setDate(prevDay.getDate() - 1);

		const nextDay = clone(date);
		nextDay.setDate(nextDay.getDate() + 1);

		// miesiąc
		const prevMonth = clone(date);
		prevMonth.setMonth(prevMonth.getMonth() - 1);

		const nextMonth = clone(date);
		nextMonth.setMonth(nextMonth.getMonth() + 1);

		// rok
		const prevYear = clone(date);
		prevYear.setFullYear(prevYear.getFullYear() - 1);

		const nextYear = clone(date);
		nextYear.setFullYear(nextYear.getFullYear() + 1);

		return {
			current: date,

			day: {
				prev: this.toYMD(prevDay),
				next: this.toYMD(nextDay)
			},

			month: {
				prev: this.toYM(prevMonth),
				next: this.toYM(nextMonth)
			},

			year: {
				prev: this.toY(prevYear),
				next: this.toY(nextYear)
			}
		};
	}

	toYMD (date) {
		const d = new Date(date);
		if (isNaN(d)) return "";

		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");

		return `${y}-${m}-${day}`;
	}

	toYM (date) {
		const d = new Date(date);
		if (isNaN(d)) return "";

		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");

		return `${y}-${m}`;
	}

	toY (date) {
		const d = new Date(date);
		if (isNaN(d)) return "";
		return d.getFullYear();
	}



	// Wydarzenia

	event_dto (args = {}) {
		const title = typeof args.title === 'string' ? args.title.trim() : "";
		const desc = typeof args.desc === 'string' ? args.desc.trim() : "";
		const all_day = !!args.all_day;

		if (!title) throw new Error("Wprowadź nazwę wydarzenia");
		if (!args.start) throw new Error("Podaj datę rozpoczęcia");

		const start = new Date(args.start);
    	const end = new Date(args.end || args.start);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new Error("Wprowadź poprawne daty");
		if (start > end) throw new Error("Data zakończenia musi być późniejsza lub równa dacie rozpoczęcia");

		return {
			title:    title,
			desc:     desc,
			start:    all_day ? start.toISOString().split('T')[0] : start.toISOString(),
			end:      all_day ? end.toISOString().split('T')[0] : end.toISOString(),
			all_day:  all_day,
			category: args.category ?? null
		};
	}

	get_events () {
		return JSON.parse(localStorage.getItem(this.#events_storage) ?? "[]");
	}

	get_events_by_range (start_date, end_date, offset = 0, limit = null, search = null) {
		const events = this.get_events();

		const start = new Date(start_date ?? Date.now());
		const end = new Date(end_date ?? "9999-12-31");

		if (isNaN(start) || isNaN(end)) throw new Error("Wprowadź poprawne daty zakresu");

		const arr = events
			.map(e => {
				let category_info = null;
				if (e.category)
					category_info = this.get_category(e.category);

				return {
					...e,
					start: new Date(e.start),
					end: new Date(e.end),
					category_info: category_info
				};
			})
			.filter(e => {
				return e.start <= end && e.end >= start;
			})
			.filter(e => {
				if (!search) return true;

				const query = search.toLowerCase();
				return e.title?.toLowerCase().includes(query) ?? true;
			})
			.sort((a, b) => a.start - b.start);

		if (limit)
			return arr.slice(offset, offset + limit);

		return arr.slice(offset);
	}

	get_event (id) {
		const events = this.get_events();

		const event = events.find(c => c.id === id);
		if (!event) return null;

		// Pobieramy informacje o kategorii
		let category_info = null;
		if (event.category)
			category_info = this.get_category(event.category);

    	return {
			...event,
			category_info: category_info
		}
	}

	create_event (event_dto) {
		const events = this.get_events();

		const new_event = {
			...event_dto,
			id: this.generate_id("evt-")
		};

		events.push(new_event);
		this.save(this.#events_storage, events);

		return new_event;
	}

	update_event (id, event_dto) {
		const events = this.get_events();

		// Szukamy po ID
		const index = events.findIndex(c => c.id === id);
		if (index === -1) return null;

		const updated_event = {
			...event_dto,
			id: id
		};

		// Podmieniamy wydarzenie
		events[index] = updated_event;

		// Zapisujemy zmiany
		this.save(this.#events_storage, events);

		return updated_event;
	}

	delete_event (id) {
		const events = this.get_events();

		// Szukamy po ID
		const index = events.findIndex(c => c.id === id);
		if (index === -1) return false;

		// Filtrujemy z wykluczeniem naszego ID
		const updated_events = events.filter(c => c.id !== id);

		// Zapisujemy zmiany
		this.save(this.#events_storage, updated_events);

		return true;
	}



	// Kategorie

	category_dto (args = {}) {
		return {
			title: (args.title?.trim()) ?? "Bez nazwy",
			color: args.color ?? "#000000"
		};
	}

	get_categories () {
		return JSON.parse(localStorage.getItem(this.#categories_storage) ?? "[]");
	}

	get_category (id) {
		const categories = this.get_categories();
    	return categories.find(category => category.id === id) ?? null;
	}

	create_category (category_dto) {
		const categories = this.get_categories();

		const new_category = {
			...category_dto,
			id: this.generate_id("cat-")
		};

		categories.push(new_category);
		this.save(this.#categories_storage, categories);

		return new_category;
	}

	update_category (id, category_dto) {
		const categories = this.get_categories();

		// Szukamy po ID
		const index = categories.findIndex(c => c.id === id);
		if (index === -1) return null;

		// Znaleziona, robimy płaską kopię bez referencji
		const updated_category = {
			...category_dto,
			id: id
		};

		// Podmieniamy kategorię
		categories[index] = updated_category;

		// Zapisujemy zmiany
		this.save(this.#categories_storage, categories);

		return updated_category;
	}

	delete_category (id) {
		const categories = this.get_categories();

		// Szukamy po ID
		const index = categories.findIndex(c => c.id === id);
		if (index === -1) return false;

		// Filtrujemy z wykluczeniem naszego ID
		const updated_categories = categories.filter(c => c.id !== id);

		// Zapisujemy zmiany
		this.save(this.#categories_storage, updated_categories);


		// Odpinanie kategorii od wydarzeń
		const events = this.get_events();
		const updated_events = events.map(e => {
			if (e.category === id) {
				return {
					...e,
					category: null
				};
			}
			return e;
		});
		this.save(this.#events_storage, updated_events);
		//

		return true;
	}

	populate_category_select (active = null) {
		const categories = this.get_categories();
		let html = `<option value="">Bez kategorii</option>`;

		for (let cat of categories)
			if (active && active === cat.id)
				html += `<option value="${cat.id}" selected>${cat.title}</option>`;
			else
				html += `<option value="${cat.id}">${cat.title}</option>`;

		return html;
	}



	// Eksport do ICS

	export_events_to_ics (ids = []) {
		const events = this.get_events()
			.filter(e => ids.includes(e.id));

		const ics = [];

		ics.push("BEGIN:VCALENDAR");
		ics.push("VERSION:2.0");
		ics.push("PRODID:-//Mój Kalendarz//PL");

		for (const e of events) {

			const formatDate = (d) => {
				// all_day → YYYYMMDD
				if (!e.all_day) {
					const date = new Date(d);
					return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
				}

				// all-day
				return d.replace(/-/g, "");
			};

			ics.push("BEGIN:VEVENT");
			ics.push(`UID:${e.id}`);
			ics.push(`SUMMARY:${e.title}`);

			if (e.desc)
				ics.push(`DESCRIPTION:${e.desc}`);

			// ALL DAY
			if (e.all_day) {
				ics.push(`DTSTART;VALUE=DATE:${formatDate(e.start)}`);
				ics.push(`DTEND;VALUE=DATE:${formatDate(e.end)}`);
			}

			// TIME EVENT
			else {
				ics.push(`DTSTART:${formatDate(e.start)}`);
				ics.push(`DTEND:${formatDate(e.end)}`);
			}

			ics.push("END:VEVENT");
		}

		ics.push("END:VCALENDAR");

		const blob = new Blob([ics.join("\r\n")], { type: "text/calendar" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "events.ics";
		a.click();

		URL.revokeObjectURL(url);
	}



	// Widoki

	get_day_view (date) {
		date = new Date(date);

		if (isNaN(date)) throw new Error("Niepoprawna data");

		const start_of_day = new Date(date);
		start_of_day.setHours(0, 0, 0, 0);

		const end_of_day = new Date(date);
		end_of_day.setHours(23, 59, 59, 999);

		const events = this.get_events_by_range(start_of_day, end_of_day);

		const all_day = [];
		const timed = [];

		events.forEach(e => {
			if (e.all_day) {

				const start = new Date(e.start);
				const end = new Date(e.end);

				const duration_days =
					Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

				all_day.push({
					...e,
					duration_days: duration_days,
					color: e.category_info.color ?? "#000000"
				});

			} else {

				const start = new Date(e.start);
				const end = new Date(e.end);

				const effective_start = start < start_of_day ? start_of_day : start;
				const effective_end = end > end_of_day ? end_of_day : end;

				const duration_hours = (effective_end - effective_start) / (1000 * 60 * 60);

				timed.push({
					...e,
					start_hour: start.getHours(),
					start_minutes: start.getMinutes(),
					start: start.getHours() + ":" + String(start.getMinutes()).padStart(2, "0"),
					end: end.getHours() + ":" + String(end.getMinutes()).padStart(2, "0"),
					duration_hours: duration_hours,
					color: e.category_info.color ?? "#000000"
				});
			}
		});

		timed.sort((a, b) => new Date(a.start) - new Date(b.start));

		return {
			date: date,
			nice_date: this.polish_date(date),
			all_day: all_day,
			timed: timed
		};
	}
}