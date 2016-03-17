'use strict';

angular.module('pubTran')
  .config(['$routeProvider', 'SwProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
      })
  }])
  .run(['Sw', angular.noop]);
