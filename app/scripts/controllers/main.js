angular.module('pubTran')
  .controller('mainController', function ($scope, Stations) {
    Stations.getAll().then(function(data){
      $scope.stations = data.root.stations.station;
      $scope.selected = $scope.stations[0];
      $scope.$apply();
    });
  });
