/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren */
'use strict';





/* eslint-disable quotes, comma-spacing */
var PrecacheConfig = [["./bower_components/angular-animate/angular-animate.js","e0075760ba05050607529b083de23c32"],["./bower_components/angular-animate/angular-animate.min.js","93dbd24c0c76dbe4100211e2479d21c9"],["./bower_components/angular-animate/index.js","eca59ea32960ae595dd18ad9480185b1"],["./bower_components/angular-route/angular-route.js","4245c950d1ac7a51bbd5dda023b7a3e7"],["./bower_components/angular-route/angular-route.min.js","4179b3162edf10fbf41c42ec31fcc829"],["./bower_components/angular-route/index.js","a3320f99fcd749cc422bb5add3888b34"],["./bower_components/angular-touch/angular-touch.js","0b73e54fe7952925fe0b0e4123fca64c"],["./bower_components/angular-touch/angular-touch.min.js","0e361f156e89d2a18e804292c3d6f86d"],["./bower_components/angular-touch/index.js","2ed479f5ff6578774996a934adb591fd"],["./bower_components/angular-x2js/Gruntfile.js","d09008189885a90d03f11a92a4e6f8a5"],["./bower_components/angular-x2js/karma.conf.js","65969948032b4dd9d65210ce2d40641e"],["./bower_components/angular/angular.js","44a4f42184a6be6859dd330395da10c8"],["./bower_components/angular/angular.min.js","5e2d2057d96976d43c756dcc1efaa1dc"],["./bower_components/angular/index.js","0d848853205d22ab8be985876aec948a"],["./bower_components/bootstrap-material-design/Gruntfile.js","8efffe798e7263e50d1b87f294ae2bb0"],["./bower_components/bootstrap/Gruntfile.js","6c579e9f45fb5565878fae7b6cdbe7ef"],["./bower_components/bootstrap/package.js","8f57300af9e3783e6cff370c614ddc92"],["./bower_components/chai/chai.js","30d489ee518c9c2867c7be8720e5bf5f"],["./bower_components/chai/karma.conf.js","d140f549d38a66b5c396b1ac75471c3f"],["./bower_components/chai/karma.sauce.js","28beac4bef01f913bf4dbd902fb9099e"],["./bower_components/chai/sauce.browsers.js","3d4eafd91699694a13e6ed18efd76c86"],["./bower_components/indexeddb-promised/gulpfile.js","5249de6f71180750123361b06eaf8faa"],["./bower_components/mocha/mocha.js","20ebb5c9ca8a8ed8316024f6c0974d7f"],["./bower_components/tether/gulpfile.js","7564ed33d4a4356e36fd9cbf87576361"],["./bower_components/x2js/xml2json.js","e99b51d0bf5b41097ec891156b7c9de9"],["./bower_components/x2js/xml2json.min.js","cdfcd39bf10750b6f60e0c5db009805a"],["/apple-touch-icon.png","9727d3c28dd4c771ad00419b749a9f75"],["/index.html","5e1bd65cb8536d63e0cc989edce5b59a"],["/scripts/config/config.js","8bc198ff0ae91f69fefd6c64c28d7e34"],["/scripts/controllers/main.js","895496f56752e965e201a45e984b7254"],["/scripts/main.js","46c0afaed964cdc0e38ed27bfc457e72"],["/scripts/routes.js","c83b191402c58c21f40c38d0c8f945ab"],["/scripts/services/idb.js","1b791da7b8cd019b1ec860b4c3cc615b"],["/scripts/services/realTimeSchedule.js","0c29ee06ab150ab5725f522d338fb563"],["/scripts/services/stations.js","f38e2250ca47ef891d7a84589486a492"],["/scripts/services/sw.js","bbe7414583b2e05b3b3ca2f6b955a74c"],["/scripts/services/trains.js","e794a1a3be11a8e887ac467374372bed"],["/service-worker.js","5cd34ef18400ff3bfb44198114e037cd"],["/views/main.html","b0d15ce1c35392b82de5902ac10eeef6"]];
/* eslint-enable quotes, comma-spacing */
var CacheNamePrefix = 'sw-precache-v1--' + (self.registration ? self.registration.scope : '') + '-';


var IgnoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var getCacheBustedUrl = function (url, now) {
    now = now || Date.now();

    var urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.search += (urlWithCacheBusting.search ? '&' : '') +
      'sw-precache=' + now;

    return urlWithCacheBusting.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var populateCurrentCacheNames = function (precacheConfig,
    cacheNamePrefix, baseUrl) {
    var absoluteUrlToCacheName = {};
    var currentCacheNamesToAbsoluteUrl = {};

    precacheConfig.forEach(function(cacheOption) {
      var absoluteUrl = new URL(cacheOption[0], baseUrl).toString();
      var cacheName = cacheNamePrefix + absoluteUrl + '-' + cacheOption[1];
      currentCacheNamesToAbsoluteUrl[cacheName] = absoluteUrl;
      absoluteUrlToCacheName[absoluteUrl] = cacheName;
    });

    return {
      absoluteUrlToCacheName: absoluteUrlToCacheName,
      currentCacheNamesToAbsoluteUrl: currentCacheNamesToAbsoluteUrl
    };
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var mappings = populateCurrentCacheNames(PrecacheConfig, CacheNamePrefix, self.location);
var AbsoluteUrlToCacheName = mappings.absoluteUrlToCacheName;
var CurrentCacheNamesToAbsoluteUrl = mappings.currentCacheNamesToAbsoluteUrl;

function deleteAllCaches() {
  return caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  });
}

self.addEventListener('install', function(event) {
  var now = Date.now();

  event.waitUntil(
    caches.keys().then(function(allCacheNames) {
      return Promise.all(
        Object.keys(CurrentCacheNamesToAbsoluteUrl).filter(function(cacheName) {
          return allCacheNames.indexOf(cacheName) === -1;
        }).map(function(cacheName) {
          var urlWithCacheBusting = getCacheBustedUrl(CurrentCacheNamesToAbsoluteUrl[cacheName],
            now);

          return caches.open(cacheName).then(function(cache) {
            var request = new Request(urlWithCacheBusting, {credentials: 'same-origin'});
            return fetch(request).then(function(response) {
              if (response.ok) {
                return cache.put(CurrentCacheNamesToAbsoluteUrl[cacheName], response);
              }

              console.error('Request for %s returned a response with status %d, so not attempting to cache it.',
                urlWithCacheBusting, response.status);
              // Get rid of the empty cache if we can't add a successful response to it.
              return caches.delete(cacheName);
            });
          });
        })
      ).then(function() {
        return Promise.all(
          allCacheNames.filter(function(cacheName) {
            return cacheName.indexOf(CacheNamePrefix) === 0 &&
                   !(cacheName in CurrentCacheNamesToAbsoluteUrl);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      });
    }).then(function() {
      if (typeof self.skipWaiting === 'function') {
        // Force the SW to transition from installing -> active state
        self.skipWaiting();
      }
    })
  );
});

if (self.clients && (typeof self.clients.claim === 'function')) {
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
}

self.addEventListener('message', function(event) {
  if (event.data.command === 'delete_all') {
    console.log('About to delete all caches...');
    deleteAllCaches().then(function() {
      console.log('Caches deleted.');
      event.ports[0].postMessage({
        error: null
      });
    }).catch(function(error) {
      console.log('Caches not deleted:', error);
      event.ports[0].postMessage({
        error: error
      });
    });
  }
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    var urlWithoutIgnoredParameters = stripIgnoredUrlParameters(event.request.url,
      IgnoreUrlParametersMatching);

    var cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    var directoryIndex = 'index.html';
    if (!cacheName && directoryIndex) {
      urlWithoutIgnoredParameters = addDirectoryIndex(urlWithoutIgnoredParameters, directoryIndex);
      cacheName = AbsoluteUrlToCacheName[urlWithoutIgnoredParameters];
    }

    var navigateFallback = '';
    // Ideally, this would check for event.request.mode === 'navigate', but that is not widely
    // supported yet:
    // https://code.google.com/p/chromium/issues/detail?id=540967
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1209081
    if (!cacheName && navigateFallback && event.request.headers.has('accept') &&
        event.request.headers.get('accept').includes('text/html') &&
        /* eslint-disable quotes, comma-spacing */
        isPathWhitelisted([], event.request.url)) {
        /* eslint-enable quotes, comma-spacing */
      var navigateFallbackUrl = new URL(navigateFallback, self.location);
      cacheName = AbsoluteUrlToCacheName[navigateFallbackUrl.toString()];
    }

    if (cacheName) {
      event.respondWith(
        // Rely on the fact that each cache we manage should only have one entry, and return that.
        caches.open(cacheName).then(function(cache) {
          return cache.keys().then(function(keys) {
            return cache.match(keys[0]).then(function(response) {
              if (response) {
                return response;
              }
              // If for some reason the response was deleted from the cache,
              // raise and exception and fall back to the fetch() triggered in the catch().
              throw Error('The cache ' + cacheName + ' is empty.');
            });
          });
        }).catch(function(e) {
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});




