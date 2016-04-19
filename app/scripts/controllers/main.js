'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Schedule', function ($scope, Stations, Schedule) {

    $scope.stationSchedule = [];

    $scope.loadingForm = true;
    $scope.loadingStationSchedules = true;
    $scope.error = '';

    $scope.itemsPerPage = 20;
    $scope.totalItems = $scope.stationSchedule.filter(function(item){return item._trainHeadStation === $scope.selectedArrival.abbr;}).length;
    $scope.currentPage = 1;

    $scope.$watch('selectedArrival', function(newVal){
      $scope.totalItems = $scope.stationSchedule.filter(function(item){return item._trainHeadStation === newVal.abbr;}).length;
    });


    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[1];

      $scope.getStationSchedule();

      $scope.loadingForm = false;
    });

    $scope.getStationSchedule = function () {
      $scope.loadingStationSchedules = true;

      Schedule.getStationSchedule($scope.selectedDeparture.abbr).then(function (data) {
        $scope.currentPage = 1;
        $scope.stationSchedule = data.root.station.item;
        $scope.totalItems = $scope.stationSchedule.length;

        $scope.loadingStationSchedules = false;
      });
    };


  }]);
