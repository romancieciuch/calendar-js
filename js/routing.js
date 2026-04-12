export function routing () {

	function load_view () {
		let hash = window.location.hash.replace(/^#\/?/, "");
		let parts = hash.split("/");

		let view = parts[0] || "home";
		let params = parts.slice(1);

		let app = document.querySelector("#app");

		fetch(`views/${view}.html`)
		.then(r => {
			if (!r.ok) throw new Error();
			return r.text();
		})
		.then(html => {
			console.log(`Ładuję widok: ${view}`);
			console.log(`Parametry: ${params}`);

			// Załaduj HTML
			app.innerHTML = html;

			// Załaduj JS
			let script = document.createElement("script");
			script.src = `views/${view}.js`;
			script.onload = () => {
				if (window["view"])
					window["view"](params);

				console.log(`Załadowano JS dla widoku: ${view}`);
			};
			script.onerror = () => {
				console.log(`Brak JS dla widoku: ${view}`);
			};

			app.appendChild(script);
		})
		.catch(() => {
			app.innerHTML = "404";
		});
	}

	window.addEventListener("hashchange", load_view);
	load_view();
}