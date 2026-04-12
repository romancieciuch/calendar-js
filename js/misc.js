export function misc () {

	{
		/* Menu mobilne */
		const toggle = document.querySelector('.menu-toggle');
		const nav = document.querySelector('.nav');

		toggle.addEventListener('click', () => {
			nav.classList.toggle('open');
			toggle.classList.toggle('active');
		});
	}

}