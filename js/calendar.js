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

	polish_week (date) {
		const d = new Date(date);
		if (isNaN(d)) return "";

		// znajdź poniedziałek
		const day = d.getDay() || 7;
		const monday = new Date(d);
		monday.setDate(d.getDate() - day + 1);

		// niedziela
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);

		const sameMonth = monday.getMonth() === sunday.getMonth();

		const dayStart = monday.getDate();
		const dayEnd = sunday.getDate();

		const monthStart = monday.toLocaleDateString("pl-PL", { month: "long" });
		const monthEnd = sunday.toLocaleDateString("pl-PL", { month: "long" });

		const year = sunday.getFullYear();

		let result;

		if (sameMonth) {
			// 13–19 kwietnia 2026
			result = `${dayStart}–${dayEnd} ${monthStart} ${year}`;
		} else {
			// 29 marca – 4 kwietnia 2026
			result = `${dayStart} ${monthStart} – ${dayEnd} ${monthEnd} ${year}`;
		}

		return result.charAt(0).toUpperCase() + result.slice(1);
	}

	polish_month_and_year (date) {
		const d = new Date(date);
		if (isNaN(d)) return "";

		const str = d.toLocaleDateString("pl-PL", {
			month: "long",
			year: "numeric"
		});

		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	get_date_prev_next (date = new Date()) {
		date = new Date(date);
		if (isNaN(date)) date = new Date();

		const clone = (d) => new Date(d.getTime());

		// znajdź poniedziałek
		const base = clone(date);
		const day = base.getDay() || 7; // niedziela → 7
		base.setDate(base.getDate() - day + 1);
		base.setHours(0, 0, 0, 0);

		// dzień
		const prevDay = clone(date);
		prevDay.setDate(prevDay.getDate() - 1);

		const nextDay = clone(date);
		nextDay.setDate(nextDay.getDate() + 1);

		// tydzień (liczony od poniedziałku)
		const prevWeek = clone(base);
		prevWeek.setDate(prevWeek.getDate() - 7);

		const nextWeek = clone(base);
		nextWeek.setDate(nextWeek.getDate() + 7);

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
			week_start: this.toYMD(base), // zawsze poniedziałek

			day: {
				prev: this.toYMD(prevDay),
				next: this.toYMD(nextDay)
			},

			week: {
				prev: this.toYMD(prevWeek),
				next: this.toYMD(nextWeek)
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

	get_month_view (date = new Date()) {
		date = new Date(date);
		if (isNaN(date)) date = new Date();

		const year = date.getFullYear();
		const month = date.getMonth();

		const todayStr = this.toYMD(new Date());
		const firstDay = new Date(year, month, 1);
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		let startWeekDay = firstDay.getDay();
		if (startWeekDay === 0) startWeekDay = 7; // niedziela → 7

		const days = [];

		// DNI Z POPRZEDNIEGO MIESIĄCA
		const prevMonthDays = startWeekDay - 1;

		for (let i = prevMonthDays; i > 0; i--) {
			const d = new Date(year, month, 1 - i);

			days.push(buildDay(d, "prev"));
		}

		// DNI BIEŻĄCEGO MIESIĄCA
		for (let i = 1; i <= daysInMonth; i++) {
			const d = new Date(year, month, i);

			days.push(buildDay(d, "current"));
		}

		// DNI Z NASTĘPNEGO MIESIĄCA (do pełnych 6 tygodni = 42 dni)
		while (days.length < 42) {
			const last = days[days.length - 1].date;
			const d = new Date(last);
			d.setDate(d.getDate() + 1);
			days.push(buildDay(d, "next"));

			// Przerwanie, żeby za dużo przyszłego miesiąca nie zasysało
			if (d.getDay() === 0) break;
		}

		return {
			nice_date: this.polish_month_and_year(date),
			year,
			month,
			days
		};


		// helper
		function buildDay (d, type) {

			const start = new Date(d);
			start.setHours(0, 0, 0, 0);

			const end = new Date(d);
			end.setHours(23, 59, 59, 999);

			const events = window.calendar.get_events_by_range(start, end);

			const all_day = [];
			const timed = [];

			events.forEach(e => {
				const eventStart = new Date(e.start);
				const eventEnd = new Date(e.end);
				const current = new Date(d);

				eventStart.setHours(0,0,0,0);
				eventEnd.setHours(0,0,0,0);
				current.setHours(0,0,0,0);

				const is_multi_day = eventStart.getTime() !== eventEnd.getTime();
				const is_first_day = current.getTime() === eventStart.getTime();
				const is_middle_day = current > eventStart && current < eventEnd;
				const is_last_day = current.getTime() === eventEnd.getTime();

				if (e.all_day)
					all_day.push({
						...e,
						is_multi_day: is_multi_day,
						is_first_day: is_first_day,
						is_middle_day: is_middle_day,
						is_last_day: is_last_day,
						color: e.category_info.color ?? "#000000"
					});
				else
					timed.push({
						...e,
						is_multi_day: is_multi_day,
						is_first_day: is_first_day,
						is_middle_day: is_middle_day,
						is_last_day: is_last_day,
						color: e.category_info.color ?? "#000000",
						start: new Date(e.start).getHours() + ":" + String(new Date(e.start).getMinutes()).padStart(2, "0")
					});
			});

			return {
				date: d,
				ymd: window.calendar.toYMD(d),

				is_today: window.calendar.toYMD(d) === todayStr,
				type, // prev | current | next

				all_day,
				timed
			};
		}
	}

	get_week_view (date = new Date()) {
		date = new Date(date);
		if (isNaN(date)) date = new Date();

		const todayStr = this.toYMD(new Date());

		// znajdź poniedziałek
		const day = date.getDay() || 7; // niedziela → 7
		const monday = new Date(date);
		monday.setDate(date.getDate() - day + 1);

		const days = [];

		// 7 dni tygodnia
		for (let i = 0; i < 7; i++) {
			const d = new Date(monday);
			d.setDate(monday.getDate() + i);

			// typ względem miesiąca (opcjonalnie)
			let type = "current";
			if (d.getMonth() < date.getMonth()) type = "prev";
			if (d.getMonth() > date.getMonth()) type = "next";

			days.push(buildDay(d, type));
		}

		return {
			nice_date: this.polish_week(date),
			week_start: this.toYMD(monday),
			days
		};


		// helper
		function buildDay(d, type) {

			const start = new Date(d);
			start.setHours(0, 0, 0, 0);

			const end = new Date(d);
			end.setHours(23, 59, 59, 999);

			const events = window.calendar.get_events_by_range(start, end);

			const all_day = [];
			const timed = [];

			events.forEach(e => {

				const eventStart = new Date(e.start);
				const eventEnd = new Date(e.end);
				const current = new Date(d);

				eventStart.setHours(0,0,0,0);
				eventEnd.setHours(0,0,0,0);
				current.setHours(0,0,0,0);

				const is_multi_day = eventStart.getTime() !== eventEnd.getTime();
				const is_first_day = current.getTime() === eventStart.getTime();
				const is_middle_day = current > eventStart && current < eventEnd;
				const is_last_day = current.getTime() === eventEnd.getTime();

				if (e.all_day) {
					all_day.push({
						...e,
						is_multi_day,
						is_first_day,
						is_middle_day,
						is_last_day,
						color: e.category_info?.color ?? "#000000"
					});
				} else {
					timed.push({
						...e,
						is_multi_day,
						is_first_day,
						is_middle_day,
						is_last_day,
						color: e.category_info?.color ?? "#000000",
						start: new Date(e.start).getHours() + ":" +
							String(new Date(e.start).getMinutes()).padStart(2, "0")
					});
				}
			});

			return {
				date: d,
				ymd: window.calendar.toYMD(d),

				is_today: window.calendar.toYMD(d) === todayStr,
				type,

				all_day,
				timed
			};
		}
	}

}