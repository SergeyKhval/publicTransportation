'use strict';

angular.module('pubTran')
  .factory('Stations', ['$http', 'x2js', 'bartKey', 'Idb', function ($http, x2js, bartKey, Idb) {
    var Stations = {};
    var dbPromise = Idb.openConnection();

    Stations.getAll = function () {
      return $http({
        method: 'GET',
        url: 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartKey
      }).then(function (response) {
        var stations = x2js.xml_str2json(response.data).root.stations.station;

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

        return stations;
      });
    };

    return Stations;
  }]);
