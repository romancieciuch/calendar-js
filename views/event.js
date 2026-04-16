window.view = (params) => {

	const event_id = params[0] ?? 0;
	const event = calendar.get_event(event_id);
	if (!event)
		window.location.hash = "404";

	document.querySelector("[data-title]").innerHTML = event.title;
	document.querySelector("[data-dates]").innerHTML = calendar.format_event_date(event);

	document.querySelector("[data-category]").href = event.category ? `#category/${event.category}` : `#event/${event.id}`;
	document.querySelector("[data-category-title]").innerHTML = event.category_info?.title ?? "Bez kategorii";
	document.querySelector("[data-category-color]").style.backgroundColor = event.category_info?.color ?? "#000";

	document.querySelector("[data-desc]").innerHTML = event.desc;

	document.querySelector("[data-button-export]").dataset.id = event.id;
	document.querySelector("[data-button-edit]").href = `#event-edit/${event.id}`;
	document.querySelector("[data-button-delete]").href = `#event-delete/${event.id}`;
	document.querySelector("[data-button-day]").href = `#day/${calendar.toYMD(event.start)}`;

	document.querySelector("[data-button-export]").addEventListener("click", () => {
		calendar.export_events_to_ics(event.id);
	});
};