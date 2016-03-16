angular.module('pubTran')
  .controller('mainController', function ($scope, Stations) {
    Stations.getAll().then(function(data){
      $scope.stations = data.root.stations.station;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[0];
      $scope.$apply();
    });
  });
