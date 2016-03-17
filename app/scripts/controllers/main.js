'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Schedule', function ($scope, Stations, Schedule) {

    $scope.loading = true;
    $scope.error = '';

    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[0];

      $scope.loading = false;
    });

    $scope.getSchedule = function () {
      $scope.schedules = {};
      $scope.error = '';

      if($scope.selectedDeparture.abbr === $scope.selectedArrival.abbr){
        $scope.error = 'Please, select different departure and arrival stations';
        return;
      }

      Schedule.getSchedule($scope.selectedDeparture.abbr, $scope.selectedArrival.abbr).then(function (data) {
        $scope.schedules = data.root.schedule.request.trip;
      });
    };
  }]);
