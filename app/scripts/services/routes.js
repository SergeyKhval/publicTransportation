'use strict';

angular.module('pubTran')
  .factory('Routes', ['$http', 'x2js', 'bartKey', function ($http, x2js, bartKey) {
    function jsonify(response) {
      return x2js.xml_str2json(response.data);
    }

    let Routes = {},
      routeNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 19, 20];

    Routes.routes = {};

    Routes.getAll = function () {
      let routePromise = Promise.resolve();

      routeNumbers.forEach(number => {
        let routesUrl = 'http://api.bart.gov/api/sched.aspx?cmd=routesched&route=' + number + '&key=' + bartKey;

        routePromise = routePromise.then(() => {
          return $http({
            method: 'GET',
            url: routesUrl
          }).then(jsonify).then(result => {
            Routes.routes[number] = result.root.route.train;
          })
        })
      });

      return routePromise;
    };

    return Routes;
  }]);
