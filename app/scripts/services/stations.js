'use strict';

angular.module('pubTran')
  .factory('Stations', ['$http', 'x2js', 'bartKey', 'Idb', function ($http, x2js, bartKey, Idb) {
    var Stations = {};
    var dbPromise = Idb.connectionPromise;

    function getStationsFromServer() {
      return $http({
        method: 'GET',
        url: 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartKey
      })
    }

    function getStationsFromIdb() {
      return dbPromise.then(function (db) {
        if (!db) {
          return;
        }

        var tx = db.transaction('stations');
        var stationsStore = tx.objectStore('stations');

        return stationsStore.getAll();
      });
    }

    function saveStationsToIdb(stations) {
      dbPromise.then(function (db) {
        if (!db) {
          return;
        }

        var tx = db.transaction('stations', 'readwrite');
        var stationsStore = tx.objectStore('stations');

        stations.forEach(function (station) {
          stationsStore.put(station);
        });
      });
    }

    Stations.getAll = function () {
      return getStationsFromIdb().then(stations => {
        if (!stations.length) {
          return getStationsFromServer().then(function (response) {
            let stations = x2js.xml_str2json(response.data).root.stations.station;

            saveStationsToIdb(stations);

            return stations;
          })
        } else {
          return stations;
        }
      })

    };

    return Stations;
  }]);
