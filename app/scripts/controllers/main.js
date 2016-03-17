'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Schedule', function ($scope, Stations, Schedule) {

    $scope.loadingForm = true;
    $scope.loadingSchedules = false;
    $scope.error = '';

    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[1];

      $scope.loadingForm = false;
    });

    $scope.getSchedule = function () {
      $scope.loadingSchedules = true;
      $scope.schedules = {};

      if($scope.selectedDeparture.abbr === $scope.selectedArrival.abbr){
        $scope.loadingSchedules = false;
        return;
      }

      Schedule.getSchedule($scope.selectedDeparture.abbr, $scope.selectedArrival.abbr).then(function (data) {
        $scope.schedules = data.root.schedule.request.trip;
        $scope.loadingSchedules = false;
      });
    };

    $scope.validate = function(){
      $scope.error = '';

      if($scope.selectedDeparture.abbr === $scope.selectedArrival.abbr){
        $scope.error = 'Please, select different departure and arrival stations';
      }
    }
  }]);
