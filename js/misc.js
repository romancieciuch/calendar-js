export function misc () {

	{
		/* Menu mobilne */
		const toggle = document.querySelector('.menu-toggle');
		const nav = document.querySelector('.nav');
		const links = document.querySelectorAll('.nav a');

		toggle.addEventListener('click', () => {
			nav.classList.toggle('open');
			toggle.classList.toggle('active');
		});

		for (let el of links)
			el.addEventListener("click", () => {
				if (window.matchMedia('(max-width: 760px)').matches)
					toggle.click();
			});
	}

}