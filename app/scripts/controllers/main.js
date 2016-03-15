angular.module('pubTran')
  .controller('mainController', function (Sw, Gtfs, Stations) {
    var workerReg;

    Sw.initWorker().then(function (reg) {
      console.log('registered worker with scope: ', reg.scope);
      workerReg = reg;
    }).catch(function () {
      console.log('failed to register worker');
    });

    Stations.getAll().then(function(response){
      return response.text();
    }).then(function(data){
      console.log(jQuery.parseXML(data));
    });
  });
