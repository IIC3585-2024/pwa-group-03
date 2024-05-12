// Nombre del caché que almacenará nuestros archivos estáticos
const cacheName = 'pwa-conf-v2';

// Lista de recursos estáticos para cachear
const staticAssets = [
    './',
    './index.html',
    './about.html',
    './notePads.html',
    './editNote.html',
    './styles.css',
    './scripts/main.js',
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-512x512.png',
    './components/navbar.html',
    './components/footer.html',
    './anonynote.json',
];

/**
 * Evento 'install': Se dispara una vez cuando el SW se instala.
 * Se utiliza para preparar el SW cachéando los activos estáticos necesarios.
 */
self.addEventListener('install', async event => {
    // Abrimos el caché
    const cache = await caches.open(cacheName);
    // Añadimos todos los activos estáticos al caché
    await cache.addAll(staticAssets); 
    // Forza a que el SW se active inmediatamente después de la instalación
    return self.skipWaiting();
});

/**
 * Evento 'activate': Se dispara después de que el   SW ha sido instalado y proporciona
 * un punto donde se puede tomar el control de la página sin esperar a la próxima carga.
 */
self.addEventListener('activate', event => {
    // Permite que el SW tome control de la página de forma inmediata
    self.clients.claim();
})

/**
 * Evento 'fetch': Se dispara cada vez que se realiza una petición de red.
 * Aquí definimos cómo responder a estas peticiones, ya sea sirviendo desde caché o red.
 */
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Sirve desde caché si la petición es para un recurso almacenado en el mismo origen
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        // Para recursos de otro origen, intenta obtener de la red y guarda en caché
        event.respondWith(networkAndCache(request));
    }
});

/**
 * cacheFirst(request): Intenta responder con el recurso desde el caché primero.
 * Si el recurso no está en el caché, entonces lo busca en la red.
 * @param {Request} request - El request del recurso que se desea obtener.
 * @returns {Response} La respuesta desde el caché o la red.
 */
async function cacheFirst(request) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || fetch(request);
}

/**
 * networkAndCache(request): Realiza una petición a la red y almacena la respuesta en caché.
 * Si la red falla, intenta servir el recurso desde el caché.
 * @param {Request} request - El request del recurso que se desea obtener.
 * @returns {Response} La respuesta desde la red o el caché.
 */
async function networkAndCache(request) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(request);
        await cache.put(request, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(request);
        return cached;
    }
}

