angular.module('pubTran')
  .factory('Idb', function(idbName, idbVersion){
    var Idb = {};

    Idb.openConnection = function(){
      // If the browser doesn't support service worker,
      // we don't care about having a database
      if (!navigator.serviceWorker) {
        return Promise.resolve();
      }

      return idb.open(idbName, idbVersion, function(upgradeDb){
        upgradeDb.createObjectStore('stations', {keyPath: 'abbr'});
      });
    };

    return Idb;
  });
