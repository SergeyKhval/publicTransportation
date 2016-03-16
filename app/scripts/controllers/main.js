'use strict';

angular.module('pubTran')
  .controller('mainController', function ($scope, x2js, Stations, Schedule) {
    Stations.getAll().then(function(data){
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[0];
    });

    $scope.getSchedule = function(){
      Schedule.getSchedule($scope.selectedDeparture.abbr, $scope.selectedArrival.abbr).then(function(data){
        $scope.schedule = data.root.schedule.request.trip;
        console.log($scope.schedule);
      });
    }
  });
