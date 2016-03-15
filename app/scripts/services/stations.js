angular.module('pubTran')
  .factory('Stations', function(){
    var Stations = {};

    Stations.getAll = function(){
      return fetch('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V');
    };

    return Stations;
  });
