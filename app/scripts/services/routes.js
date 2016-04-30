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
        let trainId = -1;

        dbPromise.then(function (db) {
          if (!db) {
            return;
          }

          var tx = db.transaction('trains', 'readwrite');
          var trainsStore = tx.objectStore('trains');

          routes.forEach(route => {
            let routeJson = jsonify(route.data);
            let routeNumber = routeJson.root.uri.split('=').pop();

            routeJson.root.route.train.forEach(train => {
              let trainObj = {
                routeNumber: routeNumber,
                stops: train.stop
              };

              trainsStore.put(trainObj, ++trainId);
            });

          });
        });
      });
    }

    let dbPromise = Idb.connectionPromise;

    let Routes = {};

    Routes.storeRoutes = function () {
      storeRoutesInDb(getRoutesFromNet());
    };

    return Routes;
  }]);

