'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Schedule', function ($scope, Stations, Schedule) {
    var paginationDefaultCount = 10;
    var itemsPerStationSchedulePage = 20;
    var paginationLength = paginationDefaultCount / itemsPerStationSchedulePage;

    $scope.loadingForm = true;
    $scope.loadingSchedules = false;
    $scope.loadingStationSchedules = false;
    $scope.error = '';
    $scope.currentPage = 1;

    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[1];

      $scope.getRealTimeSchedule();

      $scope.loadingForm = false;
    });

    $scope.getRealTimeSchedule = function () {
      $scope.loadingSchedules = true;
      $scope.schedules = {};
      $scope.error = '';

      if ($scope.selectedDeparture.abbr === $scope.selectedArrival.abbr) {
        $scope.error = 'Please, select different departure and arrival stations';
        $scope.loadingSchedules = false;
        return;
      }

      Schedule.getRealTimeSchedule($scope.selectedDeparture.abbr, $scope.selectedArrival.abbr).then(function (data) {
        $scope.schedules = data.root.schedule.request.trip;
        $scope.loadingSchedules = false;
      });
    };

    $scope.getStationSchedule = function () {
      $scope.loadingStationSchedules = true;

      Schedule.getStationSchedule($scope.selectedDeparture.abbr).then(function (data) {
        $scope.currentPage = 1;
        $scope.stationSchedule = data.root.station.item;
        $scope.stationSchedulePage = $scope.stationSchedule.slice(0, itemsPerStationSchedulePage);
        $scope.totalItems = $scope.stationSchedule.length * paginationLength;
        console.log($scope.stationSchedule);

        $scope.loadingStationSchedules = false;
      });
    };

    $scope.pageChanged = function () {
      var begin = itemsPerStationSchedulePage * ($scope.currentPage - 1);
      var end = begin + itemsPerStationSchedulePage;

      $scope.stationSchedulePage = $scope.stationSchedule.slice(begin, end);
    };


  }]);
