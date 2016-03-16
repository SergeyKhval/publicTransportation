angular.module('pubTran')
  .factory('Stations', function($http, x2js, bartKey){
    var Stations = {};

    Stations.getAll = function(){
      return $http({
        method: 'GET',
        url: 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=' + bartKey
      }).then(function(response){
        return x2js.xml_str2json(response.data);
      });
    };

    return Stations;
  });
