angular.module('app')
        .controller('configuracaoCtrl', ['$scope', 'helper', 'upload', function ($scope, helper, upload) {
              $scope.view = {
                 aba: 1
              };
              $scope.dados = {
                 id: null,
                 empresa: null,
                 smtp_host: null,
                 smtp_user: null,
                 smtp_pass: null,
                 smtp_port: null,
                 smtp_timeout: null,
                 myhost: null
              };

              helper.post("Configuracao/Buscar", null, function (dados) {
                 $scope.dados = dados.Entidade;
                 $scope.image = dados.Lov[0];
                 $scope.view.aba = $scope.UserNivel().In(1) ? 1 : 4;
              });

              $scope.onClickSalvar = function () {
                 if ($scope.dados.id > 0) {
                    editar(function (msg) {
                       helper.mensagem(msg);
                    });
                 } else {
                    cadastrar(function (msg) {
                       helper.mensagem(msg);
                    });
                 }
              };
              $scope.onUpload = function () {
                 var parametro = {
                    server: "Configuracao/Upload",
                    limiteArquivos: 1,
                    //dropZone: true,
                    formData: $scope.UserCodigo()
                 };
                 upload.open(parametro, function (image) {
                    $scope.image = image;
                 });
              };

              //private	
              function cadastrar(sucess) {
                 helper.post("Configuracao/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("Configuracao/Editar", $scope.dados, sucess);
              }
           }]);
