angular.module('pubTran')
  .controller('mainController', function (Sw, Gtfs) {
    var workerReg;

    Sw.initWorker().then(function (reg) {
      console.log('registered worker with scope: ', reg.scope);
      workerReg = reg;
      console.log(workerReg);
    }).catch(function () {
      console.log('failed to register worker');
    });

    Gtfs.getLocations().then(function(response){
      return (response.text());
    }).then(function(data){
      console.log(jQuery.parseXML(data));
    })
  });
