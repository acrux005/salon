// Service Worker – Web Push dla panelu gabinetów
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Nowe powiadomienie", body: event.data.text(), url: "/" };
  }

  const title = payload.title || "Zabiegi – powiadomienie";
  const options = {
    body: payload.body || "",
    icon: "/images/icon-192.png",
    badge: "/images/icon-96.png",
    data: { url: payload.url || "/oferta/portal/panel/kalendarz" },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(clients.claim())
);
