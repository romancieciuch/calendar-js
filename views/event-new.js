window.view = (params) => {

	const form = document.querySelector(".form");
	const error_box = form.querySelector(".error");
	const good_box = form.querySelector(".good");

	const categories = form.querySelector("#category");
	categories.innerHTML = window.calendar.populate_category_select();

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
			const event = calendar.event_dto(data);
			let res = calendar.create_event(event);

			form.reset();

			good_box.textContent = "Wydarzenie zostało dodane";
			setTimeout(() => {
				good_box.textContent = "";
			}, 3000);

			console.log("Nowe wydarzenie: ");
			console.log(res);

		} catch (err) {
			error_box.textContent = err.message;
		}
	});

};