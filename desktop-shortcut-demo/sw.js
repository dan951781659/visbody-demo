// 最小化 Service Worker，用于满足 Android PWA 安装条件
const CACHE = 'pwa-demo-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
