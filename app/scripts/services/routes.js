'use strict';

angular.module('pubTran')
  .factory('Routes', ['$http', 'x2js', 'bartKey', 'Idb', 'routeNumbers', function ($http, x2js, bartKey, Idb, routeNumbers) {
    function jsonify(xml) {
      return x2js.xml_str2json(xml);
    }

    function getRoutesFromNet() {
      return routeNumbers.map(number => {
        let routesUrl = 'http://api.bart.gov/api/sched.aspx?cmd=routesched&route=' + number + '&key=' + bartKey;

        return $http({
          method: 'GET',
          url: routesUrl
        })
      });
    }

    function storeRoutesInDb(routePromises) {
      Promise.all(routePromises).then(routes => {
        dbPromise.then(function (db) {
          if (!db) {
            return;
          }

          var tx = db.transaction('routes', 'readwrite');
          var routesStore = tx.objectStore('routes');

          routes.forEach(route => {
            let routeJson = jsonify(route.data);
            routesStore.put(routeJson);
          });
        });
      });
    }

    let dbPromise = Idb.openConnection();

    let Routes = {};

    Routes.storeRoutes = function () {
      storeRoutesInDb(getRoutesFromNet());
    };

    return Routes;
  }]);

