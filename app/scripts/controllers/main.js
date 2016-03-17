'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Schedule', function ($scope, Stations, Schedule) {
    var itemsPerStationSchedulePage = 10;

    $scope.loadingForm = true;
    $scope.loadingSchedules = false;
    $scope.error = '';
    $scope.currentPage = 1;

    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[1];

      $scope.loadingForm = false;
    });

    $scope.validate = function () {
      $scope.error = '';

      if ($scope.selectedDeparture.abbr === $scope.selectedArrival.abbr) {
        $scope.error = 'Please, select different departure and arrival stations';
      }
    };

    $scope.getRealTimeSchedule = function () {
      $scope.loadingSchedules = true;
      $scope.schedules = {};

      if ($scope.selectedDeparture.abbr === $scope.selectedArrival.abbr) {
        $scope.loadingSchedules = false;
        return;
      }

      Schedule.getRealTimeSchedule($scope.selectedDeparture.abbr, $scope.selectedArrival.abbr).then(function (data) {
        $scope.schedules = data.root.schedule.request.trip;
        $scope.loadingSchedules = false;
      });
    };

    $scope.getStationSchedule = function () {
      Schedule.getStationSchedule($scope.selectedDeparture.abbr).then(function (data) {
        $scope.currentPage = 1;
        $scope.stationSchedule = data.root.station.item;
        $scope.stationSchedulePage = $scope.stationSchedule.slice(0, itemsPerStationSchedulePage);
        $scope.totalItems = $scope.stationSchedule.length;
        console.log($scope.stationSchedule);
      });
    };

    $scope.pageChanged = function () {
      $scope.stationSchedulePage = $scope.stationSchedule.slice(itemsPerStationSchedulePage * ($scope.currentPage - 1), itemsPerStationSchedulePage * ($scope.currentPage - 1) + itemsPerStationSchedulePage);
    }


  }]);
