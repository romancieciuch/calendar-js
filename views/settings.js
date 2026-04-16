window.view = (params) => {

	const form = document.querySelector(".form");

	const token_field = document.querySelector("[data-token]");
	const sync_status_field = document.querySelector("[data-sync]");

	const error_box = form.querySelector(".error");
	const good_box = form.querySelector(".good");

	const settings = calendar.get_settings();

	// Status synchronizacji
	if (settings.sync)
		sync_status_field.value = 1;

	// Generowanie tokenu
	if (!settings.token)
		token_field.value = calendar.generate_random_string(32);
	else
		token_field.value = settings.token;


	form.addEventListener("submit", (e) => {
		e.preventDefault();

		error_box.textContent = "";
		good_box.textContent = "";

		const formData = new FormData(form);
		const data = {
			token: formData.get("token"),
			sync:  formData.get("sync")
		};

		try {
			const settings = calendar.settings_dto(data);
			let res = calendar.update_settings(settings);

			good_box.textContent = "Ustawienia zostały zapisane";
			setTimeout(() => {
				good_box.textContent = "";
			}, 3000);

		} catch (err) {
			error_box.textContent = err.message;
		}
	});

};