angular.module('rotas', ['ngRoute'])

.constant("rotasNaoAutenticadas", ['/', '/recuperar-senha', '/xxxx'])

.config(['$routeProvider', function ($routeProvider) {

      // ********Autenticação - home****************

      $routeProvider.when('/', {
         templateUrl: 'view-partial/autenticacao.html',
         controller: 'autenticacaoCtrl'

      }).when('/recuperar-senha', {
         templateUrl: 'view-partial/recuperar-senha.html',
         controller: 'recuperarSenhaCtrl'

      }).when('/home', {
         templateUrl: 'view-partial/home.html',
         controller: 'homeCtrl',
         pagina: {
            titulo: "Home",
            legenda: "SISCO - Sistema de Controle de Orçamento"
         }

      }).when('/configuracao', {
         templateUrl: 'view-partial/configuracao.html',
         controller: 'configuracaoCtrl',
         pagina: {
            titulo: "Configuração do sistema",
            legenda: "SISCO - Configurar sistema"
         }

         // ********Estabelecimento*******************

      }).when('/estabelecimento/:id', {
         templateUrl: 'view-partial/estabelecimento.html',
         controller: 'estabelecimentoCtrl',
         pagina: {
            titulo: "Editar Estabelecimento",
            legenda: "Dados do estabelecimento"
         }

      }).when('/estabelecimento/new', {
         templateUrl: 'view-partial/estabelecimento.html',
         controller: 'estabelecimentoCtrl',
         pagina: {
            titulo: "Cadastrar Estabelecimento",
            legenda: "Dados do estabelecimento"
         }

      }).when('/estabelecimento', {
         templateUrl: 'view-partial/estabelecimento-listar.html',
         controller: 'estabelecimentoListarCtrl',
         pagina: {
            titulo: "Listar Estabelecimento",
            legenda: "Dados do estabelecimento"
         }

      }).when('/estabelecimento/visualizar/:id', {
         templateUrl: 'view-partial/estabelecimento-visualizar.html',
         controller: 'estabelecimentoCtrl',
         pagina: {
            titulo: "Visualizar Estabelecimento",
            legenda: "Dados do estabelecimento"
         }

         // ********Usuario******************************

      }).when('/usuario', {
         templateUrl: 'view-partial/usuario.html',
         controller: 'usuarioCtrl'

                 // ********Master******************************

      }).when('/master', {
         templateUrl: 'view-partial/master.html',
         controller: 'masterCtrl',
         pagina: {
            titulo: "Cadastrar Master",
            legenda: "Dados do Master"
         }

         // ********Cliente*********************

      }).when('/cliente/:id', {
         templateUrl: 'view-partial/cliente.html',
         controller: 'clienteCtrl',
         pagina: {
            titulo: "Editar Clientes",
            legenda: "Dados do cliente"
         }

      }).when('/cliente/new', {
         templateUrl: 'view-partial/cliente.html',
         controller: 'clienteCtrl',
         pagina: {
            titulo: "Cadastrar Clientes",
            legenda: "Dados do cliente"
         }

      }).when('/cliente/visualizar/:id', {
         templateUrl: 'view-partial/cliente-visualizar.html',
         controller: 'clienteCtrl',
         pagina: {
            titulo: "Visualizar Clientes",
            legenda: "Dados do cliente"
         }

      }).when('/cliente', {
         templateUrl: 'view-partial/cliente-listar.html',
         controller: 'clienteListarCtrl',
         pagina: {
            titulo: "Listar Clientes",
            legenda: "Dados do cliente"
         }

         // ********Categoria*********************

      }).when('/categoria', {
         templateUrl: 'view-partial/categoria.html',
         controller: 'categoriaCtrl',
         pagina: {
            titulo: 'Cadastrar Categoria',
            legenda: 'Dados da Categoria'
         }

         // ********Veiculo*********************
      }).when('/veiculo', {
         templateUrl: 'view-partial/veiculo-listar.html',
         controller: 'veiculoListarCtrl',
         pagina: {
            titulo: 'Listar Veículo',
            legenda: 'Listar Veículo'
         }

      }).when('/veiculo/new', {
         templateUrl: 'view-partial/veiculo.html',
         controller: 'veiculoCtrl',
         pagina: {
            titulo: 'Cadastrar Veículo',
            legenda: 'Dados do Veículo'
         }

      }).when('/veiculo/editar/:id', {
         templateUrl: 'view-partial/veiculo.html',
         controller: 'veiculoCtrl',
         pagina: {
            titulo: 'Editar Veículo',
            legenda: 'Editar Veículo'
         }

      }).when('/veiculo/visualizar/:id', {
         templateUrl: 'view-partial/veiculo-visualizar.html',
         controller: 'veiculoCtrl',
         pagina: {
            titulo: 'Visualizar Veículo',
            legenda: 'Visualizar Veículo'
         }

         // ********Pedido*********************
      }).when('/pedido', {
         templateUrl: 'view-partial/pedido-listar.html',
         controller: 'pedidoListarCtrl',
         pagina: {
            titulo: 'Listar Solicitação de Orçamento (Pedido de cotação de preço)',
            legenda: 'Dados de Solicitação de Orçamento (Pedido de cotação de preço)'
         }
      }).when('/pedido/listar/:id', {
         templateUrl: 'view-partial/pedido-listar.html',
         controller: 'pedidoListarCtrl',
         pagina: {
            titulo: 'Listar Solicitação de Orçamento (Pedido de contação de preço)',
            legenda: 'Dados de Solicitação de Orçamento (Pedido de contação de preço)'
         }

      }).when('/pedido/editar/:id', {
         templateUrl: 'view-partial/pedido.html',
         controller: 'pedidoCtrl',
         pagina: {
            titulo: 'Editar Solitação de Orçamento (Pedido de cotação de preço)',
            legenda: 'Dados de Solicitação de Orçamento (Pedido de cotação de preço)'
         }

      }).when('/pedido/visualizar/:id', {
         templateUrl: 'view-partial/pedido-visualizar.html',
         controller: 'pedidoCtrl',
         pagina: {
            titulo: 'Visualizar Solitação de Orçamento (Pedido de cotação de preço)',
            legenda: 'Dados de Solicitação de Orçamento (Pedido de cotação de preço)'
         }

      }).when('/pedido/new', {
         templateUrl: 'view-partial/pedido.html',
         controller: 'pedidoCtrl',
         pagina: {
            titulo: 'Cadastrar Solicitação de Orçamento (Pedido de cotação de preço)',
            legenda: 'Dados de Solicitação de Orçamento (Pedido de cotação de preço)'
         }

         // ********Orcamento*********************

      }).when('/orcamento/pedido_id=:pedido_id&cliente_id=:cliente_id', {
         templateUrl: 'view-partial/orcamento-listar.html',
         controller: 'orcamentoListarCtrl',
         pagina: {
            titulo: 'Listar Orçamentos',
            legenda: 'Dados do Orçamento'
         }

      }).when('/orcamento/editar/pedido_id=:pedido_id&id=:id&cliente_id=:cliente_id', {
         templateUrl: 'view-partial/orcamento.html',
         controller: 'orcamentoCtrl',
         pagina: {
            titulo: 'Gerenciar Orçamento',
            legenda: 'Dados do Orçamento'
         }

      }).when('/orcamento/visualizar/pedido_id=:pedido_id&id=:id&cliente_id=:cliente_id', {
         templateUrl: 'view-partial/orcamento-visualizar.html',
         controller: 'orcamentoCtrl',
         pagina: {
            titulo: "Visualizar Orçamento",
            legenda: "Dados do Orçamento"
         }

      }).when('/orcamento/visualizar-imagem/:id', {
         templateUrl: 'view-partial/visualizar-imagem.html',
         controller: 'imagemCtrl',
         pagina: {
            titulo: "Imagens do Orcamento",
            legenda: "Imagens do orçamento"
         }

         //********Relatório*************************************

      }).when('/relatorio', {
         templateUrl: 'view-partial/relatorio.html',
         controller: 'relatorioCtrl',
         pagina: {
            titulo: "Visualizar Orçamentos Aprovados",
            legenda: "Filtros"
         }

         //********Produtos*************************************
      }).when('/grupo', {
         templateUrl: 'view-partial/grupo.html',
         controller: 'grupoCtrl',
         pagina: {
            titulo: "Cadastrar Grupo",
            legenda: "Grupos as quais o produto pertence"
         }

      }).when('/sub-grupo', {
         templateUrl: 'view-partial/sub-grupo.html',
         controller: 'subGrupoCtrl',
         pagina: {
            titulo: "Cadastrar Sub-Grupo",
            legenda: "Sub-Grupos as quais o produto pertence"
         }

      }).when('/produto', {
         templateUrl: 'view-partial/produto-listar.html',
         controller: 'produtoListarCtrl',
         pagina: {
            titulo: "Cadastro de Produto",
            legenda: "Cadastrar Produto"
         }

      }).when('/produto/new', {
         templateUrl: 'view-partial/produto.html',
         controller: 'produtoCtrl',
         pagina: {
            titulo: "Cadastrar Produto",
            legenda: "Cadastrar Produto"
         }

      }).when('/produto/produto_id=:produto_id&estabelecimento_id=:estabelecimento_id', {
         templateUrl: 'view-partial/produto.html',
         controller: 'produtoCtrl',
         pagina: {
            titulo: "Editar de Produto",
            legenda: "Editar Produto"
         }
      }).when('/produto/visualizar/produto_id=:produto_id&estabelecimento_id=:estabelecimento_id', {
         templateUrl: 'view-partial/produto-visualizar.html',
         controller: 'produtoCtrl',
         pagina: {
            titulo: "Visualizar Produto",
            legenda: "Visualização do Produto"
         }

      }).when('/consulta-produto', {
         templateUrl: 'view-partial/consulta-produto.html',
         controller: 'consultaCtrl',
         pagina: {
            titulo: "",
            legenda: ""
         }

         //********Segurança*************************************
      }).when('/licenca', {
         templateUrl: 'view-partial/page.html',
         controller: 'licencaCtrl',
         pagina: {
            titulo: "Licença não encontrada",
            legenda: "Licença não encontrada"
         }

         // ********Caso não econtrar a rota*********************
      }).otherwise({
         redirectTo: '/'
      });
   }])

.service('anonymous', ['rotasNaoAutenticadas',
   function (rotasNaoAutenticadas) {
      return {
         get: function (rota) {
            var retorno = false;
            angular.forEach(rotasNaoAutenticadas, function (item) {
               if (item === rota) {
                  retorno = true;
               }
            });
            return retorno;
         }
      };
   }]);