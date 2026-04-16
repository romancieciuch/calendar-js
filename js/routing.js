export function load_view (ver = 1) {
	const hash = window.location.hash.replace(/^#\/?/, "");
	const parts = hash.split("/");

	const view = parts[0] || "home";
	const params = parts.slice(1);

	const app = document.querySelector("#app");

	fetch(`views/${view}.html?v=${ver}`)
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
		const script = document.createElement("script");
		script.src = `views/${view}.js?v=${ver}`;
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