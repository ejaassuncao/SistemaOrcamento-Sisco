angular.module('app')
        .controller('pedidoListarCtrl', ['$scope', 'helper', '$routeParams', function ($scope, helper, $routeParams) {
              $scope.view = {
                 pesquisa: null,
                 filtroUnico: null,
                 placeholder: 'Pesquisar por: N° da Solicitação - Descricão - Nome Fantasia - Categoria - Situação - Data Criação - Placa',
                 dados: [],
                 buscaColor1: 'red'
              };
              $scope.dadosLov = {situacao: "", categoria: ""};
              $scope.dados = null;

              helper.get("Pedido/CarregarLovListar", null, function (dados) {
                 $scope.dadosLov.situacao = dados.situacao;
                 $scope.dadosLov.categoria = dados.categoria;
              });

              if ($routeParams.id !== undefined) {
                 $scope.view.pesquisa = {pedido_id: $routeParams.id};
              }

              $scope.promessa(function () {
                 if (!$scope.UserNivel().In(1)) {
                    listar($scope.view.pesquisa);
                 }
              });

              $scope.onKeyPressListar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    listar($scope.view.filtroUnico);
                 }
              };

              $scope.onClickListar = function () {
                 listar($scope.view.filtroUnico, 0);
              };

              $scope.onClickListarAvancada = function () {
                 listar($scope.dados, 1);
              };

              function listar(dados, v) {
                 var url = v === 1 ? 'Pedido/BuscaAvancada' : 'Pedido/Listar';
                 helper.post(url, dados, function (dados) {
                    $scope.view.dados.clearGrid();
                    $scope.view.dados = $scope.toList(dados);
                 });
              }

              $scope.onClickEnviar = function (id, $index) {
                 var dados = {
                    id: id,
                    situacao_id: 3
                 };
                 helper.post("Pedido/AlterarSituacao", dados, function (dados) {
                    helper.mensagem(dados.Mensagem);
                    //atualizar apena a linha corrente.	
                    $scope.view.dados[$index] = dados.Entidade;
                 });
              };

              $scope.onClickCancelar = function (id, $index) {
                 var dados = {
                    id: id,
                    situacao_id: 4
                 };
                 helper.post("Pedido/AlterarSituacao", dados, function (dados) {
                    helper.mensagem(dados.Mensagem);
                    //atualizar apena a linha corrente.	
                    $scope.view.dados[$index] = dados.Entidade;
                 });
              };

           }]);
