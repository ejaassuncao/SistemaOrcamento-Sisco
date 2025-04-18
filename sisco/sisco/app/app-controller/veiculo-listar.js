angular.module('app')
        .controller('veiculoListarCtrl', ['$scope', 'helper', function ($scope, helper) {

              $scope.view = {
                 filtroUnico: '',
                 placeholder: 'Pesquisar por: Código - Placa - Marca/Modelo - Cliente',
                 dados: []
              };

              $scope.promessa(function () {
                 if (!$scope.UserNivel().In(1)) {
                    listar();
                 }
              });

              $scope.onKeyPressListar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    listar();
                 }
              };

              $scope.onClickListar = function () {
                 listar();
              };

              function listar() {
                 helper.post("Veiculo/Listar", $scope.view.filtroUnico, function (dados) {
                    $scope.view.dados.clearGrid();
                    $scope.view.dados = $scope.toList(dados);
                 });
              }
           }]);
