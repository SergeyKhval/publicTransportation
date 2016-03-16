'use strict';

angular.module('pubTran')
  .factory('Schedule', ['$http', 'x2js', 'bartKey', function ($http, x2js, bartKey) {
    var Schedule = {};

    Schedule.getSchedule = function (departureStation, arrivalStation) {
      var scheduleUrl = 'http://api.bart.gov/api/sched.aspx?cmd=arrive&orig=' + departureStation + '&dest=' + arrivalStation + '&key=' + bartKey;

      return $http({
        method: 'GET',
        url: scheduleUrl
      }).then(function (response) {
        return x2js.xml_str2json(response.data);
      });
    };

    return Schedule;
  }]);
