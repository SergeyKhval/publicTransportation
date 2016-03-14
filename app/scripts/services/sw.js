'use strict';

angular.module('pubTran')
  .factory('Sw', function () {
    var SW = {};

    SW.initWorker = function () {
      if (!navigator.serviceWorker) {return; }

      return navigator.serviceWorker.register('/sw.js');
    };

    return SW;
  });
