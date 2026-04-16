window.view = (params) => {

	const event_id = params[0] ?? 0;
	const event = calendar.get_event(event_id);
	if (!event)
		window.location.hash = "404";

	for (let el of document.querySelectorAll("[data-title]"))
		el.innerHTML = event.title;

	document.querySelector("[data-dates]").innerHTML = calendar.format_event_date(event);

	document.querySelector("[data-button-view]").href = `#event/${event.id}`;
	document.querySelector("[data-button-delete]").dataset.id = event.id;


	// Usuwanie
	const page = document.querySelector(".page");

	document.querySelector("[data-button-delete]").addEventListener("click", () => {
		const res = calendar.delete_event(event_id);

		if (res)
			page.innerHTML = `
				<p class="acenter">Wydarzenie zostało usunięte.</p>
				<p class="acenter"><a class="button" href="#home">Powrót</a></p>
			`;
		else
			page.innerHTML = `<p class="error">Problem z usuwaniem wydarzenia</p>`;
	});
};