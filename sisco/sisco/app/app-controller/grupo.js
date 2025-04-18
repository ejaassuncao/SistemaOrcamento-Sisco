angular.module('app')
        .controller('grupoCtrl', ['$scope', 'helper', function ($scope, helper) {
              $scope.view = {
                 editar: false
              };

              $scope.dados = {
                 id: null,
                 descricao: null,
                 categoria_id: null

              };

              $scope.backup = {
                 id: null,
                 descricao: null,
                 categoria_id: null
              };

              $scope.lov = [];

              $scope.grade = {
                 lista: [],
              };

              helper.get("Grupo/Listar", $scope.dados.id, function (dados) {
                 $scope.grade.lista = dados.Entidade;
                 $scope.lov = dados.Lov;
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
                 $scope.backup.id = angular.copy(item.id);
                 $scope.backup.descricao = angular.copy(item.id);
                 $scope.backup.categoria_id = angular.copy(item.id);

                 $scope.dados.id = item.id;
                 $scope.dados.descricao = item.descricao;
                 $scope.dados.categoria_id = item.categoria_id;

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
                 helper.post("Grupo/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("Grupo/Editar", $scope.dados, sucess);
              }
           }]);
