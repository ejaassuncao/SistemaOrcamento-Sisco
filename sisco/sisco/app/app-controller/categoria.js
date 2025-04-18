angular.module('app')
        .controller('categoriaCtrl', ['$scope', 'helper', function ($scope, helper) {
              $scope.view = {
                 editar: false
              };

              $scope.dados = {
                 id: null,
                 descricao: null,
                 ativo: null
              };

              $scope.backup = {
                 id: null,
                 descricao: null,
                 ativo: null
              };

              $scope.lovSituacao = [{id: "2", descricao: "Inativo"}, {id: "1", descricao: "Ativo"}];

              $scope.grade = {
                 lista: []
              };

              helper.get("Categoria/Listar", $scope.dados.id, function (dados) {
                 $scope.grade.lista = dados;
              });

              $scope.onClickSalvar = function () {
                 if ($scope.dados.id > 0) {
                    editar(function (dados) {
                       $scope.grade.lista = dados.Entidade;
                       helper.mensagem(dados.Mensagem);
                       $scope.view.editar = false;
                       $scope.view.editar = false;
                       $scope.dados = {};
                    });
                 } else {
                    cadastrar(function (dados) {
                       $scope.grade.lista = dados.Entidade;
                       helper.mensagem(dados.Mensagem);
                       $scope.dados = {};
                    });
                 }
              };

              $scope.onClickEditarItem = function (item) {
                 $scope.backup = angular.copy(item);
                 $scope.dados = item;
                 $scope.view.editar = true;
              };

              $scope.onClickDesfazerSalvar = function () {
                 $scope.view.editar = false;
                 var index = $scope.grade.lista.indexOf($scope.dados);
                 $scope.grade.lista[index] = angular.copy($scope.backup);
                 $scope.backup = {};
                 $scope.dados = {};
              };

              //private	
              function cadastrar(sucess) {
                 helper.post("Categoria/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("Categoria/Editar", $scope.dados, sucess);
              }
           }]);
