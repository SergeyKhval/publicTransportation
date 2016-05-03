'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', '$timeout', 'Schedules', 'Stations', 'Trains',
    function ($scope, $timeout, Schedules, Stations, Trains) {

      function filterByStations(trains, firstStation, secondStation) {

        return trains.filter(train => {
          return train.stops.some(stop => {
            return stop._station === firstStation;
          });
        }).filter(train => {
          return train.stops.some(stop => {
            return stop._station === secondStation;
          });
        })
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

      function getRealTimeSchedule(departureStation, arrivalStation) {
        if (departureStation === arrivalStation) {
          $scope.error = "Please, choose different departure and arrival stations";
          return;
        }

        $scope.error = "";

        Schedules.getSchedule(departureStation.abbr, arrivalStation.abbr)
          .then(json => {
            $timeout(() => {
              $scope.schedules = json.root.schedule.request.trip;
            });
          })
          .catch(() => {
            $scope.schedules = false;

            console.log($scope.trains);
            let filteredStations = filterByStations($scope.trains, departureStation.abbr, arrivalStation.abbr);
            console.log(filteredStations);
          })
      }

      $scope.loadingForm = true;

      $scope.getRealTimeSchedule = getRealTimeSchedule;

      Stations.getAll().then(function () {
        $timeout(() => {
          $scope.stations = Stations.stationList;
          $scope.selectedDeparture = $scope.stations[0];
          $scope.selectedArrival = $scope.stations[1];
          $scope.loadingForm = false;
          getRealTimeSchedule($scope.selectedDeparture, $scope.selectedArrival);
        })
      });

      Trains.getAll().then(() => {
        $timeout(() => {
          $scope.trains = Trains.trainsList;
        });
      })
    }]);
