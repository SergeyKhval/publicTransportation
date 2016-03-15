angular.module('pubTran')
  .factory('Stations', function(x2js, bartKey){
    var Stations = {};

    Stations.getAll = function(){
      return fetch('http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartKey).then(function(response){
        return response.text();
      }).then(function(data){
        return x2js.xml_str2json(data);
      });
    };

    return Stations;
  });
