angular.module('app')
        .controller('produtoCtrl', ['$scope', 'helper', '$routeParams', function ($scope, helper, $routeParams) {
              $scope.view = {
                 codigo: 0,
                 bloquearCampos: false
              };

              function ObjectGetInstance() {
                 return {
                    id: null,
                    categoria_id: null,
                    grupo_id: null,
                    sub_grupo_id: null,
                    codigo: null,
                    descricao: null,
                    modelo: null,
                    produto_preco: {
                       estabelecimento_id: null,
                       produto_id: null,
                       preco_unitario: null,
                       data_fabricacao: null,
                       estoque: null
                    }
                 };
              }

              $scope.lov = {
                 categoria: [],
                 grupo: [],
                 sub_grupo: [],
                 estabelecimento: null
              };

              var dados = {
                 produto_id: ($routeParams.produto_id > 0) ? $routeParams.produto_id : 0,
                 estabelecimento_id: ($routeParams.estabelecimento_id > 0) ? $routeParams.estabelecimento_id : 0
              };

              $scope.dados = ObjectGetInstance();

              init(dados);

              function init(dados) {
                 helper.post("Produto/Buscar", dados, function (dados) {
                    $scope.lov = dados.Lov;
                    $scope.dados = dados.Entidade;
                    $scope.onChangeCarregaGrupo($scope.dados.categoria_id);
                    $scope.onChangeCarregaSubGrupo($scope.dados.grupo_id);
                 });
              }

              $scope.onClickSalvar = function () {
                 if ($scope.dados.id > 0) {
                    editar(function (dados) {
                       helper.mensagem(dados.Mensagem);
                       $scope.dados = ObjectGetInstance();
                       $scope.view.bloquearCampos = false;
                    });
                 } else {
                    cadastrar(function (dados) {
                       $scope.dados.id = dados.Entidade.id;
                       helper.mensagem(dados.Mensagem);
                       $scope.dados = ObjectGetInstance();
                       $scope.view.bloquearCampos = false;
                    });
                 }
              };
              $scope.onClickDesfazerSalvar = function () {
                 $scope.dados = ObjectGetInstance();
                 $scope.view.bloquearCampos = false;
              };

              $scope.onChangeObterProduto = function () {
                 if ($scope.view.codigo > 0 && $scope.view.codigo !== $scope.dados.id) {
                    dados.produto_id = $scope.view.codigo;
                    init(dados);
                    $scope.view.bloquearCampos = true;
                 }
              };

              // functios
              $scope.onChangeCarregaGrupo = function (id) {
                 if (id > 0) {
                    helper.get("Grupo/BuscarPorCategoria", id, function (dados) {
                       $scope.lov.grupo = dados;
                    });
                 }
              };

              $scope.onChangeCarregaSubGrupo = function (id) {
                 if (id > 0) {
                    helper.get("SubGrupo/BuscarPorGrupo", id, function (dados) {
                       $scope.lov.sub_grupo = dados;
                    });
                 }
              };

              //private	
              function cadastrar(sucess) {
                 helper.post("Produto/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("Produto/Editar", $scope.dados, sucess);
              }

           }]);
