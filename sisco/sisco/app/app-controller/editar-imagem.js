angular.module('app')
        .controller('editarImagemCtrl', ['$scope', 'helper', '$modalInstance', 'param', function ($scope, helper, $modalInstance, param) {
//<!----Parametros---------------------------------
              $scope.view = {titulo: "Editar Texto"};
              $scope.dados = param.dados;
              //<!----Parametros---------------------------------	


//<!----metodos---------------------------------

              $scope.onClickFecharModal = function () {
                 $modalInstance.dismiss('cancel');
              };

              $scope.onClickSalvar = function () {
                 param.scope.images = [];
                 helper.post("Orcamento/EditarTextoImagem", $scope.dados, function (imagens) {
                    param.scope.images = imagens;
                    $modalInstance.dismiss('cancel');
                 });
              };
//<!----Parametros---------------------------------	

           }]);

