angular.module('pubTran')
  .factory('Gtfs', function(){
    var GTFS = {};

    GTFS.getLocations = function(){
      return fetch('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=12th&key=MW9S-E7SL-26DU-VV8V');
    };

    return GTFS;
  });
