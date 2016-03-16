/*eslint consistent-return: 1*/
'use strict';

angular.module('pubTran')
  .factory('Sw', function () {
    var Sw = {};

    function initWorker() {
      if (!navigator.serviceWorker) {
        return;
      }

      return navigator.serviceWorker.register('/Sw.js').then(function (reg) {
        console.log('registered worker with scope: ', reg.scope);
        return reg;
      }).catch(function () {
        console.log('failed to register worker');
      });
    }

    Sw.worker = initWorker();

    return Sw;
  });
