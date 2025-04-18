angular.module('app')
        .controller('produtoListarModalCtrl', ['$scope', 'helper', '$modalInstance', 'param', function ($scope, helper, $modalInstance, param) {
              $scope.view = {
                 pesquisa: null,
                 filtroUnico: null,
                 placeholder: 'Pesquisar por: Codigo Interno - Código Inventário - Nome Produto - Modelo - Categoria - Grupo - Sub-Grupo',
                 dados: [],
              };

              $scope.promessa(function () {
                 if (!$scope.UserNivel().In(1)) {
                    //listar($scope.view.filtroUnico);
                 }
              });

              $scope.onKeyPressListar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    listar($scope.view.filtroUnico);
                 }
              };

              $scope.onClickListar = function () {
                 listar($scope.view.filtroUnico);
              };

              function listar(dados) {
                 helper.post("Produto/Listar", dados, function (dados) {
                    $scope.view.dados.clearGrid();
                    $scope.view.dados = $scope.toList(dados);
                 });
              }

              $scope.onClickFecharModal = function () {
                 $modalInstance.dismiss('cancel');
              };

              $scope.onClickAssociar = function (id, preco, descricao) {
                 param.item.produto_id = angular.copy(id);
                 param.item.descricao = angular.copy(descricao);
                 $modalInstance.dismiss('cancel');
              };
           }]);
