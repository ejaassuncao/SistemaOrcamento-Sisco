angular.module('app')
        .controller('veiculoCtrl', ['$scope', 'helper', '$routeParams', 'serviceModel', function ($scope, helper, $routeParams, serviceModel) {
              $scope.view = {
                 editar: false
              };
              $scope.dados = serviceModel.veiculo();
              $scope.dadosLov = null;
              $scope.dados.id = ($routeParams.id) ? $routeParams.id : 0;

              helper.get("Veiculo/Buscar", $scope.dados.id, function (retorno) {
                 $scope.dados = retorno.Entidade;
                 $scope.dadosLov = retorno.Lov;
              });

              $scope.onClickSalvar = function () {
                 if ($scope.dados.id > 0) {
                    helper.post("Veiculo/Editar", $scope.dados, function (retorno) {
                       helper.mensagem(retorno.Mensagem);
                       $scope.view.editar = false;
                       $scope.view.editar = false;
                    });
                 } else {
                    helper.post("Veiculo/Cadastrar", $scope.dados, function (retorno) {
                       helper.mensagem(retorno.Mensagem);
                       $scope.dados = serviceModel.veiculo();
                    });
                 }
              };
           }]);
