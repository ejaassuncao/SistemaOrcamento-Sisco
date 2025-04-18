angular.module('app')
        .controller('autenticacaoCtrl', ['$scope', 'helper', function ($scope, helper) {

              $scope.view = {
                 email: "Entre com seu email",
                 senha: "Entre com sua senha"
              };

              $scope.dados = {
                 email: '',
                 senha: ''
              };

              $scope.logar = function () {
                 helper.post("User/Logar", $scope.dados, function () {
                    helper.redirecionar("home");
                 });
              };

              $scope.keyLogar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    $scope.logar();
                 }
              };
}]);






