/*eslint consistent-return: 1*/
'use strict';

angular.module('pubTran')
  .factory('Sw', function () {
    var Sw = {};

    function initWorker() {
      if (!navigator.serviceWorker) {
        return;
      }

      return navigator.serviceWorker.register('/service-worker.js').then(function (reg) {
        console.log('registered worker with scope: ', reg.scope);
        return reg;
      }).catch(function (err) {
        console.log('failed to register worker with error: ' + err);
      });
    }

    Sw.worker = initWorker();

    return Sw;
  });
