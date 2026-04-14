window.view = (params) => {

	const categories_list = document.querySelector("[data-categories-list]");
    const categories = window.calendar.get_categories();

	categories_list.innerHTML = render_categories_list();

	function render_categories_list () {
		let html = ``;

		for (let el of categories)
			html += `
				<a class="list-event" href="#category/${el.id}">
                    <div class="event-date" style="background-color: ${el.color}">
						<span class="event-day">1</span>
						<span class="event-month">sty</span>
					</div>

                    <div class="event-content">
                        <h3 class="event-title">${el.title}</h3>
                    </div>
                </a>
			`;

		return html;
	}

};