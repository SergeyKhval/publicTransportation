'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', 'Stations', 'Trains', function ($scope, Stations, Trains) {

    function filterByFirstStation(routes, station) {
      let result = [];

      for (let route in routes) {
        let stops = routes[route].filter(train => {
          return train.stop.filter(stop => {
              return stop._station === station;
            }).length > 0
        });

        if (stops.length) {
          result.push(stops);
        }
      }

      return result;
    }

    function filterBySecondStation(routes, firstStation, secondStation) {
      let filteredByFirstStation = filterByFirstStation(routes, firstStation),
        resultTrains = [];

      filteredByFirstStation.forEach(trains => {
        trains.forEach(train => {
          let seenFirstStation = false,
            seenFirstBeforeSecond = false;

          for (let i = 0; i < train.stop.length; i++) {
            if (train.stop[i]._station === firstStation) seenFirstStation = true;
            if (train.stop[i]._station === secondStation && seenFirstStation) seenFirstBeforeSecond = true;
          }

          if (seenFirstBeforeSecond) resultTrains.push(train);
        });
      });

      return resultTrains;
    }

    function filterUnneededStation(trains, departureStation, arrivalStation) {
      let result = [];

      trains.forEach(train => {
        result.push(train.stop.filter(stop => {
          return (stop._station === departureStation || stop._station === arrivalStation);
        }))
      });

      return result;
    }

    $scope.stationSchedule = [];

    $scope.loadingForm = true;
    $scope.loadingStationSchedules = true;
    $scope.error = '';

    $scope.itemsPerPage = 20;
    $scope.totalItems = $scope.stationSchedule.filter(function (item) {
      return item._trainHeadStation === $scope.selectedArrival.abbr;
    }).length;
    $scope.currentPage = 1;

    $scope.$watch('selectedArrival', function (newVal) {
      $scope.totalItems = $scope.stationSchedule.filter(function (item) {
        return item._trainHeadStation === newVal.abbr;
      }).length;
    });


    Stations.getAll().then(function (data) {
      $scope.stations = data;
      $scope.selectedDeparture = $scope.stations[0];
      $scope.selectedArrival = $scope.stations[1];

      $scope.loadingForm = false;
    });

    $scope.getStationSchedule = function () {
      $scope.loadingStationSchedules = false;
    };

    Trains.getAll().then(trains => console.log(trains));
  }]);
