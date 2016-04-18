'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Schedule', function ($scope, Stations, Schedule) {
    var paginationDefaultCount = 10;
    var itemsPerStationSchedulePage = 20;
    var paginationLength = paginationDefaultCount / itemsPerStationSchedulePage;

    $scope.loadingForm = true;
    $scope.loadingStationSchedules = true;
    $scope.error = '';
    $scope.currentPage = 1;

    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];

      $scope.getStationSchedule();

      $scope.loadingForm = false;
    });

    $scope.getStationSchedule = function () {
      $scope.loadingStationSchedules = true;

      Schedule.getStationSchedule($scope.selectedDeparture.abbr).then(function (data) {
        $scope.currentPage = 1;
        $scope.stationSchedule = data.root.station.item;
        $scope.stationSchedulePage = $scope.stationSchedule.slice(0, itemsPerStationSchedulePage);
        $scope.totalItems = $scope.stationSchedule.length * paginationLength;

        $scope.loadingStationSchedules = false;
      });
    };


    $scope.pageChanged = function () {
      var begin = itemsPerStationSchedulePage * ($scope.currentPage - 1);
      var end = begin + itemsPerStationSchedulePage;

      $scope.stationSchedulePage = $scope.stationSchedule.slice(begin, end);
    };


  }]);
