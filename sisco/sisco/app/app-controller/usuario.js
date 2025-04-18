angular.module('app')
        .controller('usuarioCtrl', ['$scope', 'helper', '$modalInstance', 'param', function ($scope, helper, $modalInstance, param) {
              //init	
              $scope.view = {
                 titulo: "Cadastrar Usuário",
                 email: "Entre com seu email",
                 senha1: "Entre com sua senha",
                 senha2: "Repita sua senha",
                 senha3: "Repita a Nova Senha",
                 alterarSenha: false,
                 senhaChecadas: false
              };

              $scope.dados = {
                 usuario_id: param.usuario_id,
                 tabela_id: param.tabela_id,
                 tabela_nome: param.tabela_nome,
                 nome: (param.nome === undefined) ? '' : param.nome,
                 email: (param.email === undefined) ? '' : param.email,
                 nivel: param.nivel,
                 senha1: '',
                 senha2: '',
                 senha3: '',
                 editarEmailEhSenha: (param.editarEmailEhSenha !== undefined) ? param.editarEmailEhSenha : true
              };

              if ($scope.dados.usuario_id > 0) {
                 $scope.view.titulo = "Editar Usuário";
                 $scope.view.senha1 = "Digite sua senha antiga";
                 $scope.view.senha2 = "Digite sua nova senha";
              }

              //functions
              $scope.salvar = function () {
                 if ($scope.dados.senha2 !== $scope.dados.senha3) {
                    var mensagem = [{Tipo: 3, Mensagem: "senhas não confererem"}];
                    helper.mensagem(mensagem);
                    return;
                 }

                 if ($scope.dados.usuario_id > 0) {
                    editar();
                 } else {
                    cadastrar();
                 }
              };

              $scope.checaSenha = function () {
                 if ($scope.dados.senha1 === null)
                    return;

                 if ($scope.dados.senha1.length > 0) {
                    helper.post("User/ChecaSenha", $scope.dados, function (status) {
                       if (parseInt(status) !== 1) {
                          helper.msgAdvertencia('Senha não confere');
                          $scope.dados.senha1 = null;
                          $scope.view.senhaChecadas = false;
                       } else {
                          $scope.view.senhaChecadas = true;
                       }
                    });
                 }
              };
              $scope.keyChecaSenha = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    $scope.checaSenha();
                 }
              };

              function executar() {
                 if (param.funcao) {
                    param.funcao();
                 }
                 $scope.onClickFecharModal();
              }

              function cadastrar() {
                 helper.post("User/Cadastrar", MontaDadosCadastrar(), function (msg) {
                    helper.mensagem(msg);
                    executar();
                 });
              }

              function editar() {

                 if ($scope.view.alterarSenha === true) {

                    if ($scope.dados.senha1 === $scope.dados.senha3) {

                       helper.msgAdvertencia('Senha atual igual a senha nova. Digite senhas diferentes.');
                       return;
                    }

                 }

                 helper.post("User/Editar", MontaDadosEditar(), function (msg) {
                    helper.mensagem(msg);
                    executar();
                 });

              }

              function MontaDadosCadastrar() {
                 return {
                    Entidade: {
                       nome: $scope.dados.nome,
                       email: $scope.dados.email,
                       senha: $scope.dados.senha2,
                       nivel: $scope.dados.nivel,
                       token: null
                    },
                    TabelaParaVincular: {
                       usuario_id: $scope.dados.usuario_id,
                       tabela_id: $scope.dados.tabela_id,
                       tabela_nome: $scope.dados.tabela_nome,
                       ativo: 1
                    }
                 };
              }
              function MontaDadosEditar() {
                 return {
                    id: $scope.dados.usuario_id,
                    nome: $scope.dados.nome,
                    email: $scope.dados.email,
                    senha: $scope.dados.senha2,
                    nivel: $scope.dados.nivel,
                    token: null
                 };
              }

              $scope.onClickFecharModal = function () {
                 $modalInstance.dismiss('cancel');
              };
           }]);

