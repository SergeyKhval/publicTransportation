angular.module('pubTran')
  .controller('mainController', function (Sw) {
    var workerReg;

    Sw.initWorker().then(function (reg) {
      console.log('registered worker with scope: ', reg.scope);
      workerReg = reg;
      console.log(workerReg);
    }).catch(function () {
      console.log('failed to register worker');
    });


  });
