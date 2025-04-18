angular.module('app')
        .controller('recuperarSenhaCtrl', ['$scope', 'helper', function ($scope, helper) {

              $scope.dados = {
                 email: ''
              };

              $scope.RecuperarSenha = function () {

                 if ($scope.dados.email.isNullOrEmpty()) {
                    var msg = [{
                          Tipo: 3,
                          Mensagem: "Preencha o campo email"
                       }];
                    helper.mensagem(msg);
                    return;
                 }
                 helper.post("User/RecuperarSenha", $scope.dados, function (msg) {
                    helper.mensagem(msg);
                    helper.redirecionar("/", 4);
                 });
              };

           }]);
