window.view = (params) => {
    const limit = 5;
    let offset = 0;
    let loading = false;

    const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || loading) return;

        offset += limit;
        render();
    }, {
        root: null,
        rootMargin: "100px",
        threshold: 0
    });

    observer.observe(document.querySelector("[data-events-list-sentinel]"));

    render();

    function render() {
        if (loading) return;
        loading = true;

        const events_list = document.querySelector("[data-events-list]");
        const events = window.calendar.get_events_by_range(Date.now(), "9999-12-31", offset, limit);

        if (events.length === 0) {
            observer.disconnect();
            loading = false;
            return;
        }

        let html = ``;

        for (let el of events) {
			const date_info = window.calendar.superdate(el.start);

            let desc = ``;
            if (el.desc) desc = `<p class="event-desc">${el.desc}</p>`;

            html += `
                <a class="list-event" href="#event/${el.id}">
                    <div class="event-date" style="background-color: ${el.category_info?.color || '#000000'}">
                        <span class="event-day">${date_info.day}</span>
                        <span class="event-month">${date_info.month_short}</span>
                    </div>

                    <div class="event-content">
                        <h3 class="event-title">${el.title}</h3>
                        <span class="event-time">${window.calendar.format_event_date(el)}</span>
                        ${desc}
                    </div>
                </a>
            `;
        }

        events_list.insertAdjacentHTML("beforeend", html);
        loading = false;
    }
};