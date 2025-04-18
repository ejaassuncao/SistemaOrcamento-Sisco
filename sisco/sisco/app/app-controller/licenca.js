angular.module('app')
        .controller('licencaCtrl', ['$scope', 'helper', function ($scope, helper) {
              helper.get("User/Chave", null, function (chave) {
                 $scope.ChaveGerada = chave;
              });
           }]);
        
