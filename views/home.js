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
            const date = new Date(el.start);
            const day = date.getDate();
            const month = window.calendar.polish_month_name(date.getMonth());

            let desc = ``;
            if (el.desc) desc = `<p class="event-desc">${el.desc}</p>`;

            html += `
                <a class="list-event" href="#event/${el.id}">
                    <div class="event-date">
                        <span class="event-day">${day}</span>
                        <span class="event-month">${month}</span>
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