var resourcesToCache = [
  '/',
  'views/main.html',

  'styles/main.css',

  'scripts/vendor.js',
  'scripts/main.js',
  'scripts/routes.js',
  'scripts/config/config.js',
  'scripts/services/idb.js',
  'scripts/services/sw.js',
  'scripts/services/stations.js',
  'scripts/services/schedule.js',
  'scripts/controllers/main.js',
  'scripts/templates/uibPagination.js',

  'bower_components/jquery/dist/jquery.js',
  'bower_components/angular/angular.js',
  'bower_components/angular-animate/angular-animate.js',
  'bower_components/angular-route/angular-route.js',
  'bower_components/angular-touch/angular-touch.js',
  'bower_components/tether/dist/js/tether.js',
  'bower_components/bootstrap/dist/js/bootstrap.js',
  'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  'bower_components/x2js/xml2json.min.js',
  'bower_components/angular-x2js/dist/x2js.min.js',
  'bower_components/indexeddb-promised/lib/idb.js',

  'bower_components/font-awesome/fonts/fontawesome-webfont.woff?v=4.5.0',
  'bower_components/font-awesome/fonts/fontawesome-webfont.woff2?v=4.5.0',
  'bower_components/font-awesome/fonts/fontawesome-webfont.eot?v=4.5.0',
  'bower_components/font-awesome/fonts/fontawesome-webfont.svg?v=4.5.0',
  'bower_components/font-awesome/fonts/fontawesome-webfont.ttf?v=4.5.0',
  'bower_components/font-awesome/fonts/FontAwesome.otf?v=4.5.0'
];

var staticCacheName = 'pubTran-static-v1';

var allCaches = [
  staticCacheName
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(resourcesToCache)
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('pubTran-') &&
            !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
