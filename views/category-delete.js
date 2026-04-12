window.view = (params) => {

	const category_id = params[0] ?? 0;
	const category = window.calendar.get_category(category_id);
	if (!category)
		window.location.hash = "404";

	for (let el of document.querySelectorAll("[data-title]"))
		el.innerHTML = category.title;

	document.querySelector("[data-button-view]").href = `#category/${category.id}`;
	document.querySelector("[data-button-delete]").dataset.id = category.id;


	// Usuwanie
	const page = document.querySelector(".page");

	document.querySelector("[data-button-delete]").addEventListener("click", () => {
		const res = window.calendar.delete_category(category_id);

		if (res)
			page.innerHTML = `
				<p class="acenter">Kategoria została usunięta.</p>
				<p class="acenter"><a class="button" href="#home">Powrót</a></p>
			`;
		else
			page.innerHTML = `<p class="error">Problem z usuwaniem kategorii</p>`;
	});
};