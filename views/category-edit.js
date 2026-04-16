window.view = (params) => {

	const category_id = params[0] ?? 0;
	const category = calendar.get_category(category_id);
	if (!category)
		window.location.hash = "404";


	const form = document.querySelector(".form");
	const error_box = form.querySelector(".error");
	const good_box = form.querySelector(".good");


	for (let el of document.querySelectorAll("[data-title]"))
		el.innerHTML = category.title;

	document.querySelector("#title").value = category.title;
	document.querySelector("#color").value = category.color;


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
			const new_category = calendar.category_dto(data);
			let res = calendar.update_category(category_id, new_category);

			good_box.textContent = "Kategoria została zaktualizowana";
			setTimeout(() => {
				good_box.textContent = "";
			}, 3000);

			console.log("Nowe dane kategorii: ");
			console.log(res);

		} catch (err) {
			error_box.textContent = err.message;
		}
	});
};