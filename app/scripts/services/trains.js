'use strict';

angular.module('pubTran')
  .factory('Trains', ['$http', 'x2js', 'bartKey', 'Idb', 'routeNumbers', function ($http, x2js, bartKey, Idb, routeNumbers) {
    function jsonify(xml) {
      return x2js.xml_str2json(xml);
    }

    function getRoutesFromServer() {
      return routeNumbers.map(number => {
        let routesUrl = 'http://api.bart.gov/api/sched.aspx?cmd=routesched&route=' + number + '&key=' + bartKey;

        return $http({
          method: 'GET',
          url: routesUrl
        })
      });
    }

    function storeTrainsInIdb(routePromises) {
      return Promise.all(routePromises).then(routes => {
        let trainId = -1;

        return dbPromise.then(function (db) {
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

    function getTrainsFromIdb() {
      return dbPromise.then(function (db) {
        if (!db) {
          return;
        }

        var tx = db.transaction('trains');
        var trainsStore = tx.objectStore('trains');

        return trainsStore.getAll();
      });
    }

    let dbPromise = Idb.connectionPromise;

    let Trains = {};

    Trains.getAll = function () {
      return getTrainsFromIdb().then(trains => {
        if (!trains.length) {
          return getRoutesFromServer().then(routePromises => {
              storeTrainsInIdb(routePromises).then(() => getTrainsFromIdb());
            }
          )
        } else {
          return trains;
        }
      })
    };

    return Trains;
  }]);

