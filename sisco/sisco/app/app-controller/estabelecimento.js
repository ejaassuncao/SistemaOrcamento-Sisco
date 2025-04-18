angular.module('app')
        .controller('estabelecimentoCtrl', ['$scope', 'helper', 'servico', '$routeParams', 'userService', 'upload', function ($scope, helper, servico, $routeParams, userService, upload) {

              $scope.view = {
                 aba: 1,
                 title: $scope.pagina.titulo,
                 legenda: $scope.pagina.legenda,
                 page: "Estabelecimento",
                 fotoDefault: helper.loadImage("cliente.png")
              };

              $scope.dados = {
                 id: null
              };

              $scope.dados.id = ($routeParams.id > 0) ? $routeParams.id : 0;

              // carrega os dados default
              helper.get("Estabelecimento/Buscar", $scope.dados.id, function (dados) {
                 $scope.dados = dados.Entidade;
                 $scope.dadosLov = dados.Lov;
                 $scope.onChangeCarregaCidades($scope.dados.uf_id);
              });

              // functios
              $scope.onChangeCarregaCidades = function (id) {

                 if (id > 0) {
                    servico.getMunicipios(id, function (dados) {
                       $scope.dadosLov.cidade = dados;
                       $scope.dadosLov.cidade_id = $scope.dados.cidade_id;
                    });
                 }
              };

              $scope.onClickSalvar = function () {
                 if ($scope.dados.id > 0) {
                    editar();

                 } else {
                    cadastrar(function (dados) {

                       $scope.dados.id = dados.Entidade.id;
                       helper.mensagem(dados.Mensagem);

                       var param = {
                          tabela_id: $scope.dados.id,
                          tabela_nome: 'estabelecimento',
                          usuario_id: 0,
                          nivel: 3,
                          funcao: atualizarUsuario
                       };
                       userService.abrirModal(param);

                    });
                 }
              };

              $scope.onClickCarregarFoto = function (id) {
                 var parametro = {
                    server: "User/AtualizarFoto",
                    limiteArquivos: 1,
                    formData: id,
                    autoClose: true
                 };
                 upload.open(parametro, function () {
                    atualizarUsuario();
                 });
              };

              $scope.onClickEditarUsuario = function (usuario) {
                 var param = {
                    tabela_id: $scope.dados.id,
                    tabela_nome: 'estabelecimento',
                    usuario_id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    nivel: 3,
                    funcao: atualizarUsuario
                 };

                 userService.abrirModal(param);
              };

              $scope.onClickCadastrarUsuario = function () {
                 var param = {
                    tabela_id: $scope.dados.id,
                    tabela_nome: 'estabelecimento',
                    usuario_id: 0,
                    nivel: 3,
                    funcao: atualizarUsuario
                 };
                 userService.abrirModal(param);
              };

              function atualizarUsuario() {
                 var dados = {
                    id: $scope.dados.id,
                    tabela: "estabelecimento"
                 };
                 helper.post("User/BuscarUsuarioDaTabela", dados, function (dados) {
                    $scope.dadosLov.usuario = dados.Entidade;
                 });
              }

              function cadastrar(sucess) {
                 helper.post("Estabelecimento/Cadastrar", $scope.dados, sucess);
              }

              function editar() {
                 helper.post("Estabelecimento/Editar", $scope.dados, function (msg) {
                    helper.mensagem(msg);
                 });
              }
           }]);
