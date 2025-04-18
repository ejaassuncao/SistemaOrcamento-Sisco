angular.module('app')
        .controller('imagemCtrl', ['$scope', 'helper', '$routeParams', function ($scope, helper, $routeParams) {

              $scope.view = {
                 isImagem: false,
                 id: $routeParams.id
              };


              init();
//<!----funções---------------------------------

              function init() {
                 $scope.images = [];
                 helper.post("Orcamento/BuscarImagem", {id: $scope.view.id}, function (imagens) {
                    $scope.images = imagens;
                    $scope.view.isImagem = (imagens.length > 0) ? '' : 'Não existe imagem cadastrada.';
                 });
              }

//<!----funções---------------------------------

           }]);

