// ============================================================================
// Service Worker для PWA «Бизнес-аналитик»
// Простое объяснение: этот файл работает как локальный сервер внутри телефона.
// Он сохраняет дизайн, логику и иконки в память устройства, чтобы приложение
// моментально открывалось даже в авиарежиме или без интернета.
// ============================================================================

const CACHE_NAME = 'biz-analyst-v2';

// Список файлов, которые сохраняются в память телефона при первой установке
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './app.css',
  './app.js',
  './app-tools.js',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// 1. Установка: скачиваем и сохраняем все файлы в кэш устройства
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Активация: удаляем старые версии кэша, если приложение обновилось
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Обработка запросов: отдаем файлы из кэша телефона без ожидания сети
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Живые курсы валют и ИИ не кэшируем — они идут напрямую через интернет
  if (url.hostname.includes('open.er-api.com') || url.pathname.includes('/rates') || url.pathname.includes('/api/')) {
    return;
  }

  // Обрабатываем только стандартные GET-запросы
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Если файл уже есть в памяти телефона — отдаем его мгновенно
      if (cachedResponse) {
        // Фоновое обновление: в тихом режиме проверяем новую версию
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {
          // Если интернета нет — спокойно работаем на сохраненном кэше
        });
        return cachedResponse;
      }

      // Если файла не было в кэше — загружаем из сети и кэшируем
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Резервный возврат на главную страницу при потере связи
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
