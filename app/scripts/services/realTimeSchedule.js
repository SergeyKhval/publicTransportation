'use strict';

angular.module('pubTran')
  .factory('Schedules', ['$http', 'x2js', 'bartApi', 'bartKey', function ($http, x2js, bartApi, bartKey) {
    let Schedule = {};

    Schedule.getSchedule = function (departure, arrival) {
      return $http({
        method: 'GET',
        url: `${bartApi}sched.aspx?cmd=depart&orig=${departure}&dest=${arrival}&key=${bartKey}`
      }).then(response => x2js.xml_str2json(response.data));
    };

    return Schedule;
  }]);
