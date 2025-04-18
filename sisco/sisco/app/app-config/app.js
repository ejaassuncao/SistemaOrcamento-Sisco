/* global angular */

angular.module('app', ['toaster', 'rotas', 'httpInterceptor', 'api', 'ui.utils.masks', 'customFilter', 'bootstrapLightbox']);

angular.module('app').run(['$rootScope', 'helper', 'userService', 'anonymous', '$modal', '$timeout', '$injector', 'servico',
   function ($rootScope, helper, userService, anonymous, $modal, $timeout, $injector, servico) {
      $(document).ready(function () {
         //ao iniciar
         $(".jquery-waiting-base-container").fadeOut("slow");
         //ao fechar ou atualizar navegador...
         //  $(window).bind('beforeunload',$rootScope.onClickDeslogar());
      });

      //-----Metodos Globais utilizado para configurar o sistema

      $rootScope.promessa = function (sucesso) {
         $timeout(function () {
            sucesso();
         });
      };

      $rootScope.lovStatus = servico.lovStatus();

      $rootScope.toList = function (objeto) {
         return helper.toList(objeto);
      };

      $rootScope.sistema = {
         titulo: 'SISCO - Sistema de Controle de Orçamento',
         saudacao: 'Bem vindo',
         rodape1: '&nbsp;&nbsp;&regSISCO - Sistema de Controle de Orçamento',
         rodape2: '&copy;Todos os direitos reservados',
         version: '1.6.1.0',       
         lancamento: "14/03/2016",
         display:mostarAte('2016/03/31'),
         autor: 'suporte@ewati.com.br',
         product: 'Produzido pela: <a style="color:#ffff;" href="http://cbasistema.com.br" target="_blank">cbasistema.com.br</a>',
         menu: false,
         tela: {titulo: '', legenda: ''}
      };

      $rootScope.pagina = {
         titulo: '',
         legenda: ''
      };

      //-----Componetes globais

      $rootScope.abrirModal = function (template, controller, size, param) {
         $modal.open({
            templateUrl: template,
            controller: controller,
            size: size,
            keyboard: false,
            backdrop: 'static',
            resolve: {
               param: function () {
                  return param;
               }
            }
         });
      };

      $rootScope.confirm = function (titulo, funcao) {

         var param = {titulo: titulo, funcao: funcao};

         $modal.open({
            templateUrl: helper.loadTemplat("confirm.html"),
            controller: ['$scope', '$modalInstance', 'param', function ($scope, $modalInstance, param) {
               $scope.view = {titulo: param.titulo};
               $scope.Ok = function () {
                  param.funcao();
                  $modalInstance.dismiss('cancel');
               };
               $scope.No = function () {
                  $modalInstance.dismiss('cancel');
               };
               $scope.onClickFecharModal = function () {
                  $modalInstance.dismiss('cancel');
               };
            }],
            size: null,
            keyboard: false,
            backdrop: 'static',
            resolve: {
               param: function () {
                  return param;
               }
            }
         });
      };

      $rootScope.ImprimirNoBrower = function (divId) {
         var conteudo = document.getElementById(divId).innerHTML;
         tela_impressao = window.open('about:blank');
         tela_impressao.document.write(conteudo);
         tela_impressao.window.print();
         tela_impressao.window.close();
      };

      //-----Metodos da Tela de Autenticação e Usuario    

      permissao = $injector.get('permissao');
      $rootScope.user = {Nivel: ''};
      $rootScope.consultarSessao = 0;
      var temposessao = (60 * 6);

      $rootScope.UserNivel = function () {
         return parseInt(userService.get().Nivel);
      };

      $rootScope.UserAtivo = function () {
         return parseInt(userService.get().Ativo);
      };

      $rootScope.UserCodigo = function () {
         return parseInt(userService.get().Id);
      };

      $rootScope.onClickDeslogar = function () {
         helper.get("User/Deslogar", null, function () {
            $rootScope.deslogar();
         });
      };

      $rootScope.deslogar = function () {
         $rootScope.sistema.menu = false;
         $rootScope.chat.fechar();
         userService.destroy();
         helper.redirecionar("/");
      };

      helper.post("User/BuscarUsuarioLogado", $rootScope.sistema, function () {
      });

      $rootScope.EditarSenha = function () {
         var param = {
            tabela_id: 1,
            tabela_nome: (userService.get().Nivel === '2') ? 'cliente' : 'estabelecimento',
            usuario_id: userService.get().Id,
            nome: userService.get().Nome,
            nivel: userService.get().Nivel,
            email: userService.get().Login,
            editarEmailEhSenha: false
         };
         userService.abrirModal(param);
      };

      timer();

      function mostarAte(v) {
         date1 = new Date(v);
         date2 = new Date();
         return date1 - date2; //diferença em milésimos e positivo       
      }
      
      function timer() {
         $rootScope.dataHora = new Date();
         $rootScope.consultarSessao = parseInt($rootScope.consultarSessao) + 1;

         //A cada 6 minutos checa sessão.		
         if (parseInt($rootScope.consultarSessao) === temposessao) {
            userService.isLogado(function (logado) {
               if (!logado) {
                  helper.redirecionar("/");
               }
               $rootScope.consultarSessao = 0;
            });
         }
         $timeout(timer, 1000);
      }

      //-----filter
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
         var pagina = event.currentScope.pagina;
         pagina.titulo = '';
         pagina.legenda = '';
         var dadosPagina = next.pagina;

         if (dadosPagina !== undefined) {
            pagina.titulo = dadosPagina.titulo;
            pagina.legenda = dadosPagina.legenda;
         }

         var rota = (next.$$route !== undefined) ? next.$$route.originalPath : '';

         if (rota !== '' && rota !== undefined) {
            userService.isLogado(function (logado) {
               if (anonymous.get(rota)) {
                  if (rota === "/" && logado === true) {
                     event.preventDefault();
                     helper.redirecionar('home');
                  }
               } else {
                  if (logado) {
                     $rootScope.user = userService.get();
                     $rootScope.sistema.menu = true;
                     if (!permissao.isPermition(rota)) {
                        helper.redirecionar('home');
                     }
                  } else {
                     $rootScope.deslogar();
                  }
               }
            });
         }
      });


   }]);

angular.module('app').service("userService", ['$rootScope', 'helper', function ($rootScope, helper) {

      var _user = {Id: '', Nome: '', Login: '', Nivel: '', Ativo: ''};
      var _retorno;

      var userService = {};

      userService.criarUser = function (user) {
         _user.Id = user.id;
         _user.Nome = user.nome;
         _user.Login = user.email;
         _user.Nivel = user.nivel;
         _user.Ativo = user.ativo; //1 ativo; 2 - indimplente       
      };

      userService.destroy = function () {
         _user = {Id: '', Nome: '', Login: '', Nivel: '', Ativo: ''};
         $rootScope.MeuMenu = null;
      };

      userService.get = function () {
         return _user;
      };

      userService.existeUsuario = function () {
         return (_user.Id > 0);
      };

      userService.isLogado = function (callback) {

         helper.get("User/BuscarUsuarioLogado", null, function (user) {
            if (user === 'notLicence') {
               helper.redirecionar('/licenca');
               return;
            }
            if (user.id > 0 && user.id !== null && user.id !== undefined && user.id !== '') {
               userService.criarUser(user);
               callback(true);
            } else {
               userService.destroy();
               callback(false);
            }
         });
      };

      userService.abrirModal = function (param) {
         $rootScope.abrirModal("view-partial/usuario.html", 'usuarioCtrl', null, param);
      };

      return userService;

   }]);

//servicoes gerais de Lovs
angular.module('app').service("servico", ['helper', function (helper) {
      return {
         getMunicipios: function (id, sucess) {
            helper.get("Endereco/Cidade", id, sucess);
         },
         lovStatus: function () {
            return angular.copy([{id: '', descricao: '***Selecione***'}, {id: "1", descricao: 'Ativo'}, {id: "2", descricao: 'Inativo'}]);
         }
      };
   }]);


