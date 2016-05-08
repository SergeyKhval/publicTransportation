'use strict';

angular.module('pubTran')
  .factory('Trains', ['$http', 'x2js', 'bartApi', 'bartKey', 'Idb', 'routeNumbers', function ($http, x2js, bartApi, bartKey, Idb, routeNumbers) {
    let dbPromise = Idb.connectionPromise;
    let Trains = {
      trainsList: []
    };

    function jsonify(xml) {
      return x2js.xml_str2json(xml);
    }

    function getRoutesFromServer() {
      return routeNumbers.map(number => {
        let routesUrl = bartApi + 'sched.aspx?cmd=routesched&route=' + number + '&key=' + bartKey;

        return $http({
          method: 'GET',
          url: routesUrl
        });
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
          this.trainsList = trains;
          return Promise.resolve(trains);
        }
      });
    };

    return Trains;
  }]);

