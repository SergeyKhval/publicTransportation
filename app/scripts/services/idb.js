'use strict';

angular.module('pubTran')
  .factory('Idb', ['idbName', 'idbVersion', function (idbName, idbVersion) {
    var Idb = {};

    function openConnection() {
      // If the browser doesn't support service worker,
      // we don't care about having a database
      if (!navigator.serviceWorker) {
        return Promise.resolve();
      }

      return idb.open(idbName, idbVersion, function (upgradeDb) {
        switch (upgradeDb.oldVersion) {
          case 0:
            upgradeDb.createObjectStore('stations', {keyPath: 'abbr'});
          case 1:
            upgradeDb.createObjectStore('trains');
        }
      });
    }

    Idb.connectionPromise = openConnection();

    return Idb;
  }]);
