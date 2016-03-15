angular.module('pubTran')
  .factory('Gtfs', function(){
    var GTFS = {};

    GTFS.getLocations = function(){
      return fetch('http://api.bart.gov/api/sched.aspx?cmd=depart&orig=24th&dest=rock&key=MW9S-E7SL-26DU-VV8V');
    };

    return GTFS;
  });
