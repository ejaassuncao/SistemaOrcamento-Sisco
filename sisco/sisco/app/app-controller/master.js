angular.module('app')
        .controller('masterCtrl', ['$scope', 'helper', 'upload', function ($scope, helper, upload) {
              $scope.view = {
                 senha2: '',
                 senhaCheck: '',
                 alterarSenha: false,
                 senhaOK: false,
                 fotoDefault: helper.loadImage("cliente.png")
              };

              $scope.clear = function () {
                 return{
                    id: null,
                    nome: null,
                    email: null,
                    senha: null
                 };
              };

              $scope.dados = $scope.clear();

              $scope.itemBackup = $scope.clear();

              $scope.grade = {
                 lista: []
              };

              function init() {
                 helper.get("Master/Listar", $scope.dados.id, function (dados) {
                    $scope.grade.lista = dados;
                 });
              }

              init();

              $scope.onClickCarregarFoto = function (id) {
                 var parametro = {
                    server: "User/AtualizarFoto",
                    limiteArquivos: 1,
                    formData: id,
                    autoClose: true
                 };
                 upload.open(parametro, function () {
                    init();
                 });
              };

              $scope.onClickSalvar = function () {
                 if (!validaSenha())
                    return;

                 if ($scope.dados.id > 0) {
                    editar(function (dados) {
                       $scope.grade.lista = dados.Entidade;
                       helper.mensagem(dados.Mensagem);
                    });
                 } else {
                    cadastrar(function (dados) {
                       $scope.grade.lista = dados.Entidade;
                       helper.mensagem(dados.Mensagem);
                       $scope.dados = $scope.clear();
                       $scope.view.senha2 = '';
                    });
                 }
              };

              $scope.onClickEditarUsuario = function (item) {
                 $scope.itemBackup = angular.copy(item);
                 $scope.dados = item;
                 alterarSenha();
              };

              $scope.onClickDesfazer = function () {
                 var index = $scope.grade.lista.indexOf($scope.dados);
                 $scope.grade.lista[index] = angular.copy($scope.itemBackup);
                 $scope.itemBackup = $scope.clear();
                 $scope.dados = $scope.clear();
                 alterarSenha();
              };

              $scope.checaSenha = function () {
                 if ($scope.view.senhaCheck.length > 0) {
                    var dados = {
                       usuario_id: $scope.dados.id,
                       senha1: $scope.view.senhaCheck
                    };
                    helper.post("User/ChecaSenha", dados, function (status) {
                       if (parseInt(status) !== 1) {
                          helper.msgAdvertencia('Senha não confere');
                          $scope.view.senhaOK = false;
                       } else {
                          $scope.view.senhaOK = true;
                       }
                    });
                 }
              };

              //private	
              function alterarSenha() {
                 $scope.view.alterarSenha = false;
                 $scope.view.senhaOK = false;
                 $scope.view.senha2 = '';
                 $scope.view.senhaCheck = '';
              }

              function cadastrar(sucess) {
                 helper.post("Master/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("Master/Editar", $scope.dados, sucess);
              }

              function validaSenha() {
                 if (!$scope.view.alterarSenha)
                    return true;
                 if (String().isNullOrEmpty($scope.dados.senha)) {
                    helper.msgAdvertencia('Digita sua senha.');
                    return false;
                 }
                 if ($scope.dados.senha !== $scope.view.senha2) {
                    helper.msgAdvertencia('Senhas não conferem');
                    return false;
                 }
                 return true;
              }
           }]);
