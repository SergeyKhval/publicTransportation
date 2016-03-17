'use strict';

angular.module('pubTran')
  .factory('Schedule', ['$http', 'x2js', 'bartKey', function ($http, x2js, bartKey) {
    function jsonify(response){
      return x2js.xml_str2json(response.data);
    }

    var Schedule = {};

    Schedule.getRealTimeSchedule = function (departureStation, arrivalStation) {
      var scheduleUrl = 'http://api.bart.gov/api/sched.aspx?cmd=arrive&orig=' + departureStation + '&dest=' + arrivalStation + '&key=' + bartKey;

      return $http({
        method: 'GET',
        url: scheduleUrl
      }).then(jsonify);
    };

    Schedule.getStationSchedule = function (station) {
      var requestUrl = 'http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=' + station + '&key=' + bartKey;

      return $http({
        method: 'GET',
        url: requestUrl
      }).then(jsonify);
    };

    return Schedule;
  }]);
