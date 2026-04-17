const CACHE_NAME = 'calendar-app-v10';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/css/style.css',
    '/js/app.js',
	'/images/calendar.svg',
	'/images/calendar.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});