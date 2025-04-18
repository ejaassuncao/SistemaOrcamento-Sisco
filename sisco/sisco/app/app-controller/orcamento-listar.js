angular.module('app')
        .controller('orcamentoListarCtrl', ['$scope', 'helper', '$routeParams', function ($scope, helper, $routeParams) {

              $scope.dados = {
                 pedido_id: $routeParams.pedido_id,
                 cliente_id: $routeParams.cliente_id,
                 cliente: '',
                 descricao: '',
                 pedido_situacao: '',
                 pedido_situacao_id: '',
              };

              $scope.view = {
                 dados: []
              };

              var filtro = {
                 pedido_id: $routeParams.pedido_id,
                 cliente_id: $routeParams.cliente_id
              };

              listar(filtro);

              function listar(filtro) {
                 helper.post("Orcamento/Listar", filtro, function (retorno) {
                    preencherLista(retorno);

                 });
              }

              function preencherLista(dados) {
                 $scope.view.dados.clearGrid();
                 $scope.view.dados = $scope.toList(dados);
                 preencherDados($scope.view.dados);
              }

              $scope.onClickAprovar = function (id, estabelecimento_id) {

                 var dados = {
                    id: id,
                    situacao_id: 5,
                    pedido_id: $routeParams.pedido_id,
                    cliente_id: $routeParams.cliente_id,
                    estabelecimento_id: estabelecimento_id,
                    usuario_aprovou: $scope.UserCodigo()
                 };

                 helper.post("Orcamento/AlterarSituacaoAprovar", dados, function (data) {
                    helper.mensagem(data.Mensagem);
                    preencherLista(data.Entidade);
                 });
              };

              function preencherDados(dados) {
                 $scope.dados.cliente = dados[0].cliente;
                 $scope.dados.descricao = dados[0].observacao;
                 $scope.dados.pedido_situacao = dados[0].pedido_situacao;
                 $scope.dados.pedido_situacao_id = dados[0].pedido_situacao_id;
              }


              $scope.onClickCancelar = function (id, $index, estabelecimento_id) {
                 var dados = {
                    id: id,
                    situacao_id: 4,
                    pedido_id: $scope.dados.pedido_id,
                    estabelecimento_id: estabelecimento_id
                 };

                 helper.post("Orcamento/CancelarPelaListagem", dados, function (dados) {
                    helper.mensagem(dados.Mensagem);
                    //atualizar apena a linha corrente.	
                    $scope.view.dados[$index] = dados.Entidade;
                 });
              };

              $scope.onClickEnviar = function (id, $index, estabelecimento_id) {
                 var dados = {
                    id: id,
                    situacao_id: 6,
                    pedido_id: $scope.dados.pedido_id,
                    estabelecimento_id: estabelecimento_id,
                 };
                 helper.post("Orcamento/EnviarPelaListagem", dados, function (dados) {
                    helper.mensagem(dados.Mensagem);
                    $scope.view.dados[$index] = dados.Entidade;
                 });
              };

           }]);
