'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', '$timeout', 'Schedules', 'Stations', 'Trains',
    function ($scope, $timeout, Schedules, Stations, Trains) {

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

      $scope.loadingForm = true;

      $scope.getRealTimeSchedule = function (departureStation, arrivalStation) {
        Schedules.getSchedule(departureStation.abbr, arrivalStation.abbr)
          .then(json => {
            $timeout(() => {
              $scope.schedules = json.root.schedule.request.trip;
              console.log($scope.schedules);
            });
          })
          .catch(() => {
            $scope.schedules = false;
          })
      };

      Stations.getAll().then(function () {
        $timeout(() => {
          $scope.stations = Stations.stationList;
          $scope.selectedDeparture = $scope.stations[0];
          $scope.selectedArrival = $scope.stations[1];
          $scope.loadingForm = false;
        })
      });

      Trains.getAll().then(() => {
        $scope.trains = Trains.trainsList;
      })
    }]);
