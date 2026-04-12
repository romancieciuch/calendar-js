window.view = (params) => {

	const categories_list = document.querySelector("[data-categories-list]");
    const categories = window.calendar.get_categories();
	let html = ``;

	for (let el of categories)
		html += `
			<a class="category" href="#category/${el.id}">
				<span class="category-color" style="background: ${el.color};"></span>
				<span class="category-name">${el.title}</span>
			</a>
		`;

	categories_list.innerHTML = html;

};