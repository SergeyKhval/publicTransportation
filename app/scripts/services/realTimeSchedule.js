'use strict';

angular.module('pubTran')
  .factory('Schedule', ['$http', 'x2js', 'bartKey', function ($http, x2js, bartKey) {
    let Schedule = {};

    function getRealTimeSchedule(departure, arrival) {
      return $http({
        method: 'GET',
        url: `http://api.bart.gov/api/sched.aspx?cmd=depart&orig=${departure}&dest=${arrival}&key=${bartKey}`
      })
    }

    Schedule.getSchedule = getRealTimeSchedule;

    return Schedule;
  }]);
