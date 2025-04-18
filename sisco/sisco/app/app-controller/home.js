angular.module('app')
        .controller('homeCtrl', ['$scope', 'helper', '$timeout', function ($scope, helper, $timeout) {

              $scope.view = {
                 lista: []
              };

              function Init() {
                 if ($scope.pagina.titulo === 'Home') {
                    helper.get("Home/Listar", null, function (retorno) {
                       $scope.view.lista = retorno;

                    });
                    $timeout(Init, 30000);
                 }
              }

              Init();
              $scope.chat.init();

           }]);
