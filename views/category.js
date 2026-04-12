window.view = (params) => {

	const category_id = params[0] ?? 0;
	const category = window.calendar.get_category(category_id);
	if (!category)
		window.location.hash = "404";

	for (let el of document.querySelectorAll("[data-title]"))
		el.innerHTML = category.title;

	document.querySelector("[data-color]").style.backgroundColor = category.color ?? "#000";

	document.querySelector("[data-button-edit]").href = `#category-edit/${category.id}`;
	document.querySelector("[data-button-delete]").href = `#category-delete/${category.id}`;

};