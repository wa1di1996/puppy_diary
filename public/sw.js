// Self-destruct: unregister old Service Workers
self.addEventListener('install', () => {
  self.skipWaiting()
})
self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => self.clients.matchAll({ type: 'window' })
      .then(clients => clients.forEach(c => c.navigate(c.url))))
})
