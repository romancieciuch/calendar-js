window.view = (params) => {

	const event_id = params[0] ?? 0;
	const event = calendar.get_event(event_id);
	if (!event)
		window.location.hash = "404";


	const form = document.querySelector(".form");
	const error_box = form.querySelector(".error");
	const good_box = form.querySelector(".good");

	const categories = form.querySelector("#category");
	categories.innerHTML = calendar.populate_category_select(event.category);


	for (let el of document.querySelectorAll("[data-title]"))
		el.innerHTML = event.title;

	document.querySelector("#title").value = event.title;
	document.querySelector("#desc").value = event.desc;

	document.querySelector("#start").value = calendar.format_for_datetime_local(event.start);
	document.querySelector("#end").value = calendar.format_for_datetime_local(event.end);
	document.querySelector("#all_day").checked = event.all_day;


	form.addEventListener("submit", (e) => {
		e.preventDefault();

		error_box.textContent = "";
		good_box.textContent = "";

		const formData = new FormData(form);
		const data = {
			title:    formData.get("title"),
			desc:     formData.get("desc"),
			start:    formData.get("start"),
			end:      formData.get("end"),
			all_day:  formData.get("all_day") === "1",
			category: formData.get("category")
		};

		try {
			const new_event = calendar.event_dto(data);
			let res = calendar.update_event(event_id, new_event);

			good_box.textContent = "Wydarzenie zostało zaktualizowane";
			setTimeout(() => {
				good_box.textContent = "";
			}, 3000);

			console.log("Nowe dane wydarzenia: ");
			console.log(res);

		} catch (err) {
			error_box.textContent = err.message;
		}
	});
};