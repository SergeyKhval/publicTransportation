'use strict';

angular.module('pubTran')
  .controller('mainController', function ($scope, Stations) {
    Stations.getAll().then(function(data){
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[0];
    });
  });
