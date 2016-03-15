'use strict';

angular.module('pubTran')
  .factory('Sw', function () {
    var SW = {};

    function initWorker() {
      if (!navigator.serviceWorker) {
        return;
      }

      return navigator.serviceWorker.register('/sw.js').then(function (reg) {
        console.log('registered worker with scope: ', reg.scope);
      }).catch(function () {
        console.log('failed to register worker');
      });
    }

    SW.worker = initWorker();

    return SW;
  });
