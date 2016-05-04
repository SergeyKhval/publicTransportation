'use strict';

angular.module('pubTran')
  .factory('Schedules', ['$http', 'x2js', 'bartKey', function ($http, x2js, bartKey) {
    let Schedule = {};

    Schedule.getSchedule = function (departure, arrival) {
      return $http({
        method: 'GET',
        url: `http://api.bart.gov/api/sched.aspx?cmd=depart&orig=${departure}&dest=${arrival}&key=${bartKey}`
      }).then(response => x2js.xml_str2json(response.data));
    };

    return Schedule;
  }]);