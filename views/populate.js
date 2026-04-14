window.view = (params) => {


	// Zaludnianie kategorii

	const categories = [
		{ id: "cat-work", title: "Praca", color: "#2563eb" },
		{ id: "cat-private", title: "Prywatne", color: "#16a34a" },
		{ id: "cat-study", title: "Nauka", color: "#f59e0b" },
		{ id: "cat-health", title: "Zdrowie", color: "#ef4444" },
		{ id: "cat-other", title: "Inne", color: "#8b5cf6" }
	];

	localStorage.setItem("categories", JSON.stringify(categories));



	// Zaludnianie wydarzeń

	const events = [
	{
		id: "evt-1",
		title: "Spotkanie z klientem",
		desc: "Omówienie nowego projektu",
		start: "2026-04-13T10:00:00.000Z",
		end: "2026-04-13T11:00:00.000Z",
		all_day: false,
		category: "cat-work"
	},
	{
		id: "evt-2a",
		title: "Spłata kredytu",
		desc: "",
		start: "2026-04-14T00:00:00.000Z",
		end: "2026-04-14T00:00:00.000Z",
		all_day: true,
		category: "cat-private"
	},
	{
		id: "evt-2a",
		title: "Urodziny szefowej",
		desc: "",
		start: "2026-04-14T00:00:00.000Z",
		end: "2026-04-14T00:00:00.000Z",
		all_day: true,
		category: "cat-work"
	},
	{
		id: "evt-2",
		title: "Plan sprintu",
		desc: "",
		start: "2026-04-14T09:00:00.000Z",
		end: "2026-04-14T10:30:00.000Z",
		all_day: false,
		category: "cat-work"
	},
	{
		id: "evt-2b",
		title: "Odwiedziny Aneta",
		desc: "",
		start: "2026-04-14T09:30:00.000Z",
		end: "2026-04-14T11:30:00.000Z",
		all_day: false,
		category: "cat-private"
	},
	{
		id: "evt-3",
		title: "Siłownia",
		desc: "Trening nóg",
		start: "2026-04-14T18:00:00.000Z",
		end: "2026-04-14T19:00:00.000Z",
		all_day: false,
		category: "cat-health"
	},
	{
		id: "evt-4",
		title: "Zakupy",
		desc: "Biedronka",
		start: "2026-04-15",
		end: "2026-04-15",
		all_day: true,
		category: "cat-private"
	},
	{
		id: "evt-5",
		title: "Nauka JS",
		desc: "Map, filter, reduce",
		start: "2026-04-15T17:00:00.000Z",
		end: "2026-04-15T19:00:00.000Z",
		all_day: false,
		category: "cat-study"
	},
	{
		id: "evt-6",
		title: "Dentysta",
		desc: "",
		start: "2026-04-16T12:00:00.000Z",
		end: "2026-04-16T13:00:00.000Z",
		all_day: false,
		category: "cat-health"
	},
	{
		id: "evt-7",
		title: "Weekend w górach",
		desc: "",
		start: "2026-04-18",
		end: "2026-04-20",
		all_day: true,
		category: "cat-private"
	},
	{
		id: "evt-8",
		title: "Code review",
		desc: "",
		start: "2026-04-21T10:00:00.000Z",
		end: "2026-04-21T11:30:00.000Z",
		all_day: false,
		category: "cat-work"
	},
	{
		id: "evt-9",
		title: "Spotkanie zespołu",
		desc: "Weekly sync",
		start: "2026-04-22T09:00:00.000Z",
		end: "2026-04-22T10:00:00.000Z",
		all_day: false,
		category: "cat-work"
	},
	{
		id: "evt-10",
		title: "Nauka SQL",
		desc: "JOINy i indeksy",
		start: "2026-04-22T18:00:00.000Z",
		end: "2026-04-22T20:00:00.000Z",
		all_day: false,
		category: "cat-study"
	},
	{
		id: "evt-11",
		title: "Wizyta u lekarza",
		desc: "",
		start: "2026-04-23T08:30:00.000Z",
		end: "2026-04-23T09:00:00.000Z",
		all_day: false,
		category: "cat-health"
	},
	{
		id: "evt-12",
		title: "Urodziny",
		desc: "Impreza",
		start: "2026-04-24",
		end: "2026-04-24",
		all_day: true,
		category: "cat-private"
	},
	{
		id: "evt-13",
		title: "Refactor projektu",
		desc: "",
		start: "2026-04-25T10:00:00.000Z",
		end: "2026-04-25T13:00:00.000Z",
		all_day: false,
		category: "cat-work"
	},
	{
		id: "evt-14",
		title: "Nauka CSS Grid",
		desc: "",
		start: "2026-04-26T17:00:00.000Z",
		end: "2026-04-26T19:00:00.000Z",
		all_day: false,
		category: "cat-study"
	},
	{
		id: "evt-15",
		title: "Spacer",
		desc: "",
		start: "2026-04-26T20:00:00.000Z",
		end: "2026-04-26T21:00:00.000Z",
		all_day: false,
		category: "cat-private"
	},
	{
		id: "evt-16",
		title: "Konferencja IT",
		desc: "",
		start: "2026-04-27",
		end: "2026-04-29",
		all_day: true,
		category: "cat-work"
	},
	{
		id: "evt-17",
		title: "Medycyna kontrolna",
		desc: "",
		start: "2026-04-30T10:00:00.000Z",
		end: "2026-04-30T11:00:00.000Z",
		all_day: false,
		category: "cat-health"
	},
	{
		id: "evt-18",
		title: "Projekt open source",
		desc: "GitHub issue cleanup",
		start: "2026-05-01T12:00:00.000Z",
		end: "2026-05-01T15:00:00.000Z",
		all_day: false,
		category: "cat-work"
	},
	{
		id: "evt-19",
		title: "Relaks",
		desc: "",
		start: "2026-05-02",
		end: "2026-05-02",
		all_day: true,
		category: "cat-private"
	},
	{
		id: "evt-20",
		title: "Plan tygodnia",
		desc: "Organizacja zadań",
		start: "2026-05-03T18:00:00.000Z",
		end: "2026-05-03T19:00:00.000Z",
		all_day: false,
		category: "cat-study"
	}
	];

	localStorage.setItem("events", JSON.stringify(events));

};