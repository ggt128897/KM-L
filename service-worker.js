const CACHE_NAME = 'fuel-tracker-cache-v1';
const urlsToCache = [
  'fuel_tracker_final.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 安裝 service worker，並將指定的資源添加到快取中
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache); // 快取資源
    })
  );
});

// 處理 fetch 請求，首先檢查快取中是否存在資源，若無則從網絡請求
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)  // 檢查是否有匹配的快取
      .then(function(response) {
        // 如果有匹配的快取，則返回快取的資源；如果沒有，則進行網絡請求
        return response || fetch(event.request).then(function(fetchResponse) {
          // 可選：將網絡資源加入快取（根據需要）
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, fetchResponse.clone()); // 將新資源存入快取
            return fetchResponse;
          });
        });
      })
  );
});
