'use strict';

angular.module('pubTran')
  .controller('mainController', ['$scope', '$timeout', 'Schedules', 'Stations', 'Trains',
    function ($scope, $timeout, Schedules, Stations, Trains) {

      function filterByStations(trains, departureStation, arrivalStation) {

        return trains
          .filter(train => {
            let departureIndex = 0,
              arrivalIndex = 0;

            train.stops.forEach((stop, index) => {
              if (stop._station === departureStation) {
                departureIndex = index;
              }

              if (stop._station === arrivalStation) {
                arrivalIndex = index;
              }
            });

            return departureIndex > 0 && (arrivalIndex - departureIndex > 0);
          })
          .map(train => {
            return train.stops.filter(stop => {
              return stop._station === departureStation || stop._station === arrivalStation;
            })
          });
      }

      function getRealTimeSchedule(departureStation, arrivalStation) {
        if (departureStation === arrivalStation) {
          $scope.error = "Departure and arrival stations must be different";
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

            $timeout(() => {
              $scope.localSchedules = filterByStations(Trains.trainsList, departureStation.abbr, arrivalStation.abbr);
              console.log($scope.localSchedules);
            });
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
