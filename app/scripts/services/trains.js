'use strict';

angular.module('pubTran')
  .factory('Trains', ['$http', '$q', 'x2js', 'bartKey', 'Idb', 'routeNumbers', function ($http, $q, x2js, bartKey, Idb, routeNumbers) {
    let dbPromise = Idb.connectionPromise;
    let Trains = {
      trainsList: []
    };

    function jsonify(xml) {
      return x2js.xml_str2json(xml);
    }

    function getRoutesFromServer() {
      return routeNumbers.map(number => {
        let routesUrl = 'http://api.bart.gov/api/sched.aspx?cmd=routesched&route=' + number + '&key=' + bartKey;

        return $http({
          method: 'GET',
          url: routesUrl
        });
      });
    }

    function storeTrainsInIdb(routePromises) {
      return Promise.all(routePromises).then(routes => {
        console.log(routes);
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

        let trainsPromise = trainsStore.getAll();

        trainsPromise.then(trains => {
          Trains.trainsList = trains;
        });

        return trainsPromise;
      });
    }

    Trains.getAll = function () {
      return getTrainsFromIdb().then(trains => {
        if (!trains.length) {
          return storeTrainsInIdb(getRoutesFromServer()).then(() => getTrainsFromIdb());
        } else {
          let promise = $q.defer();
          this.trainsList = trains;
          return promise.resolve(trains);
        }
      });
    };

    return Trains;
  }]);

