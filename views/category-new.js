window.view = (params) => {

	const form = document.querySelector(".form");
	const error_box = form.querySelector(".error");
	const good_box = form.querySelector(".good");

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		error_box.textContent = "";
		good_box.textContent = "";

		const formData = new FormData(form);
		const data = {
			title: formData.get("title"),
			color: formData.get("color")
		};

		try {
			const category = calendar.category_dto(data);
			let res = calendar.create_category(category);

			form.reset();

			good_box.textContent = "Kategoria została dodana";
			setTimeout(() => {
				good_box.textContent = "";
			}, 3000);

			console.log("Nowa kategoria: ");
			console.log(res);

		} catch (err) {
			error_box.textContent = err.message;
		}
	});

};