angular.module('pubTran')
  .factory('Stations', function(x2js){
    var Stations = {};

    Stations.getAll = function(){
      return fetch('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V').then(function(response){
        return response.text();
      }).then(function(data){
        return x2js.xml_str2json(data);
      });
    };

    return Stations;
  });
