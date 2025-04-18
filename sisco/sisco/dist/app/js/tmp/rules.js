angular.module('app')
        .controller('autenticacaoCtrl', ['$scope', 'helper', function ($scope, helper) {

              $scope.view = {
                 email: "Entre com seu email",
                 senha: "Entre com sua senha"
              };

              $scope.dados = {
                 email: '',
                 senha: ''
              };

              $scope.logar = function () {
                 helper.post("User/Logar", $scope.dados, function () {
                    helper.redirecionar("home");
                 });
              };

              $scope.keyLogar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    $scope.logar();
                 }
              };
}]);







angular.module('app')
        .controller('categoriaCtrl', ['$scope', 'helper', function ($scope, helper) {
              $scope.view = {
                 editar: false
              };

              $scope.dados = {
                 id: null,
                 descricao: null,
                 ativo: null
              };

              $scope.backup = {
                 id: null,
                 descricao: null,
                 ativo: null
              };

              $scope.lovSituacao = [{id: "2", descricao: "Inativo"}, {id: "1", descricao: "Ativo"}];

              $scope.grade = {
                 lista: []
              };

              helper.get("Categoria/Listar", $scope.dados.id, function (dados) {
                 $scope.grade.lista = dados;
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
                 $scope.backup = angular.copy(item);
                 $scope.dados = item;
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
                 helper.post("Categoria/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("Categoria/Editar", $scope.dados, sucess);
              }
           }]);

angular.module('app')
        .controller('clienteListarCtrl',['$scope', 'helper', function($scope, helper) {

	$scope.view = {
		filtroUnico : '',
		placeholder : 'Pesquisar por: Código - Razão Social/Nome Fantasia - Situação',
		dados : [],	
	};

	$scope.promessa(function(){	
		if(!$scope.UserNivel().In(1)){
			listar();
		}
	});	
	
	$scope.onKeyPressListar = function(events) {
		if (events.which === 13 || events.keyCode === 13) {
			listar();
		}
	};
	
	$scope.onClickListar = function() {
		listar();
	};
	
	function listar() {
		helper.post("Cliente/Listar", $scope.view.filtroUnico, function(dados) {
			$scope.view.dados.clearGrid();
			$scope.view.dados = $scope.toList(dados);			
		});
	}
}]);

angular.module('app')
        .controller('clienteCtrl', ['$scope', 'helper', 'servico', '$routeParams', 'userService', 'upload', function ($scope, helper, servico, $routeParams, userService, upload) {
              $scope.view = {
                 aba: 1,
                 title: $scope.pagina.titulo,
                 legenda: $scope.pagina.legenda,
                 page: "Cliente",
                 fotoDefault: helper.loadImage("cliente.png")
              };

              $scope.dados = {
                 id: null
              };

              $scope.dados.id = ($routeParams.id > 0) ? $routeParams.id : 0;

              // carrega os dados default
              helper.get("Cliente/Buscar", $scope.dados.id, function (dados) {
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
                          tabela_nome: 'cliente',
                          usuario_id: 0,
                          nivel: 2,
                          funcao: atualizarUsuario
                       };
                       userService.abrirModal(param);

                    });
                 }
              };
              //****Usuario******
              $scope.onClickEditarUsuario = function (usuario) {
                 var param = {
                    tabela_id: $scope.dados.id,
                    tabela_nome: 'cliente',
                    usuario_id: usuario.id,
                    nome: usuario.nome,
                    nivel: 2,
                    email: usuario.email,
                    funcao: atualizarUsuario
                 };

                 userService.abrirModal(param);
              };

              $scope.onClickCadastrarUsuario = function () {
                 var param = {
                    tabela_id: $scope.dados.id,
                    tabela_nome: 'cliente',
                    usuario_id: 0,
                    nivel: 2,
                    funcao: atualizarUsuario
                 };
                 userService.abrirModal(param);
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

              function atualizarUsuario() {
                 var dados = {
                    id: $scope.dados.id,
                    tabela: "cliente"
                 };

                 helper.post("User/BuscarUsuarioDaTabela", dados, function (dados) {
                    $scope.dadosLov.usuario = dados.Entidade;
                 });
              }
              //private	
              function cadastrar(sucess) {
                 helper.post("Cliente/Cadastrar", $scope.dados, sucess);
              }

              function editar() {
                 helper.post("Cliente/Editar", $scope.dados, function (msg) {
                    helper.mensagem(msg);
                 });
              }
           }]);

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

angular.module('app')
        .controller('editarImagemCtrl', ['$scope', 'helper', '$modalInstance', 'param', function ($scope, helper, $modalInstance, param) {
//<!----Parametros---------------------------------
              $scope.view = {titulo: "Editar Texto"};
              $scope.dados = param.dados;
              //<!----Parametros---------------------------------	


//<!----metodos---------------------------------

              $scope.onClickFecharModal = function () {
                 $modalInstance.dismiss('cancel');
              };

              $scope.onClickSalvar = function () {
                 param.scope.images = [];
                 helper.post("Orcamento/EditarTextoImagem", $scope.dados, function (imagens) {
                    param.scope.images = imagens;
                    $modalInstance.dismiss('cancel');
                 });
              };
//<!----Parametros---------------------------------	

           }]);


angular.module('app')
        .controller('estabelecimentoListarCtrl',['$scope', 'helper', function($scope, helper) {
	$scope.view = {
		filtroUnico : '',
		placeholder : 'Pesquisar por: Código - CPF/CNPJ-Razão Social/Nome Fantasia - Categoria - Situação',
		dados : [],		
	};
	
	$scope.promessa(function(){	
		if(!$scope.UserNivel().In(1)){
			listar();
		}
	});	
	
	$scope.onKeyPressListar = function(events) {
		if (events.which === 13 || events.keyCode === 13) {
			listar();
		}
	};
	
	$scope.onClickListar = function() {
		listar();
	};
	
	function listar() {
		helper.post("Estabelecimento/Listar", $scope.view.filtroUnico, function(dados) {
			$scope.view.dados.clearGrid();
			$scope.view.dados = $scope.toList(dados);			
		});
	}
}]);

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

angular.module('app')
        .controller('homeCtrl', ['$scope', 'helper', '$timeout', function ($scope, helper, $timeout) {

              $scope.view = {
                 lista: []
              };

              function Init() {
                 if ($scope.pagina.titulo === 'Home') {
                    helper.get("Home/Listar", null, function (retorno) {
                       $scope.view.lista = retorno;

                    });
                    $timeout(Init, 30000);
                 }
              }

              Init();
              $scope.chat.init();

           }]);

angular.module('app')
        .controller('imagemCtrl', ['$scope', 'helper', '$routeParams', function ($scope, helper, $routeParams) {

              $scope.view = {
                 isImagem: false,
                 id: $routeParams.id
              };


              init();
//<!----funções---------------------------------

              function init() {
                 $scope.images = [];
                 helper.post("Orcamento/BuscarImagem", {id: $scope.view.id}, function (imagens) {
                    $scope.images = imagens;
                    $scope.view.isImagem = (imagens.length > 0) ? '' : 'Não existe imagem cadastrada.';
                 });
              }

//<!----funções---------------------------------

           }]);


angular.module('app')
        .controller('licencaCtrl', ['$scope', 'helper', function ($scope, helper) {
              helper.get("User/Chave", null, function (chave) {
                 $scope.ChaveGerada = chave;
              });
           }]);
        

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

angular.module('app')
        .controller('orcamentoCtrl', ['$scope', 'helper', '$routeParams', 'upload', function ($scope, helper, $routeParams, upload) {

              $scope.view = {
                 aba: 1,
                 salvar: '',
                 editar: false,
                 isAdm: '',
                 cliente_id: '',
                 editarItem: false,
                 editarServico: false,
                 verImagem: true,
                 tab: 1
              };

              $scope.dadosBackup = {
                 id: null,
                 situacao_id: null,
                 pedido_id: null,
                 estabelecimento_id: null,
                 prazo_entrega: null,
                 sub_total_produto: null,
                 desconto_produto: null,
                 total_produto: null,
                 sub_total_servico: null,
                 desconto_servico: null,
                 total_servico: null,
                 sub_total: null,
                 desconto: null,
                 valor_total: null,
              };

              $scope.dados = $scope.dadosBackup;

              $scope.param = null;

              $scope.dadosLov = {
                 estabelecimento: []
              };
              $scope.images = [];

              //--Itens
              var limparItensDados = function () {
                 return{
                    item_id: null,
                    produto_id: null,
                    descricao: null,
                    orcamento_id: null,
                    quantidade: null,
                    preco_unitario: null
                 };
              };
              $scope.item = limparItensDados();

              //-- servico
              var limparServicoDados = function () {
                 return{
                    item_id: null,
                    descricao: null,
                    orcamento_id: null,
                    quantidade: null,
                    preco_unitario: null,
                    total: null,
                 };
              };

              $scope.servico = limparServicoDados();

              //Carrega os dados default	
              if ($routeParams.id > 0) {
                 $scope.dados.id = $routeParams.id  // jshint ignore:line
                 $scope.view.salvar = true;
              } else {
                 $scope.dados.id = 0;
                 $scope.view.salvar = false;
              }

              $scope.dados.pedido_id = ($routeParams.pedido_id > 0) ? $routeParams.pedido_id : 0;
              $scope.view.cliente_id = $routeParams.cliente_id;

              helper.post("Orcamento/Buscar", $scope.dados, function (dados) {
                 preencherDados(dados);
                 CarregaImagem(dados);
                 criarBackup();
                 $scope.view.isAdm = (parseInt($scope.user.Nivel) === 1);
              });

              function CarregaImagem(dados) {
                 $scope.images = angular.copy(dados.Lov.images);
                 dados.Lov.images = null;
              }

              function criarBackup() {
                 var backup = {
                    Entidade: $scope.dados,
                    Lov: $scope.dadosLov,
                 };
                 $scope.dadosBackup = angular.copy(backup);
              }

              function preencherDados(dados) {
                 $scope.dados = dados.Entidade;
                 $scope.dadosLov = dados.Lov;

                 //carrega itens
                 $scope.dadosLov.item = $scope.toList(dados.Lov.item);
                 $scope.dados.desconto_produto = (parseFloat($scope.dados.desconto_produto) > 0) ? parseFloat($scope.dados.desconto_produto) : 0;

                 //carrega servicos
                 $scope.dadosLov.servico = $scope.toList(dados.Lov.servico);
                 $scope.dados.desconto_servico = (parseFloat($scope.dados.desconto_servico) > 0) ? parseFloat($scope.dados.desconto_servico) : 0;

                 $scope.dados.situacao_id = ($scope.dados.situacao_id > 0) ? $scope.dados.situacao_id : '3';
              }

              $scope.onClickSalvarEhEnviar = function () {
                 if (!validaDadosItem())
                    return false;
                 var dados = {
                    dados: $scope.dados,
                    item: $scope.dadosLov.item,
                    servico: $scope.dadosLov.servico,
                    outros: $scope.dadosLov.pedido.servico
                 };

                 criarBackup();

                 if ($scope.dados.id > 0) {
                    helper.post("Orcamento/Editar", dados, function (data) {
                       $scope.view.salvar = true;
                       $scope.view.editar = false;
                       helper.mensagem(data.Mensagem);
                    });
                 } else {
                    helper.post("Orcamento/Cadastrar", dados, function (data) {
                       $scope.view.salvar = true;
                       $scope.view.editar = false;
                       $scope.dados.id = data.Entidade.id;
                       $scope.dados.estabelecimento_id = data.Entidade.estabelecimento_id;
                       helper.mensagem(data.Mensagem);
                    });
                 }

              };

              function validaDadosItem() {
                 //verificar se todos dos precos unitários foram informados, se estão maior que 0;

                 var item = $scope.dadosLov.item.find('preco_unitario', null);

                 if (item.length > 0) {
                    helper.msgAdvertencia("Informe o preço do item \"" + item[0].descricao + "\"");
                    return false;
                 }

                 var item = $scope.dadosLov.item.where('preco_unitario', '<==', 0); // jshint ignore:line

                 if (item.length > 0) {
                    helper.msgAdvertencia("Informe um preço superior a 0 no item \"" + item[0].descricao + "\"");
                    return false;
                 }

                 if ($scope.dados.prazo_entrega === '') {
                    helper.msgAdvertencia("Selecione uma prazo de entrega.");
                    return false;
                 }

                 if ($scope.dados.desconto_produto >= $scope.dados.valor_total) {
                    helper.msgAdvertencia("Desconto não pode ser maior ou igual que valor total.");
                    return false;
                 }

                 return true;
              }

//----------------eventos----------------------------

              $scope.onclickAbrirUpload = function () {
                 var parametro = {
                    server: "Orcamento/Upload",
                    limiteArquivos: 10,
                    //dropZone: true,
                    formData: $scope.dados.id
                 };
                 upload.open(parametro, function (image) {
                    $scope.images.push(image);
                 });
              };

              $scope.onClickDesfazer = function () {
                 $scope.view.salvar = true;
                 $scope.view.editar = false;
                 preencherDados(angular.copy($scope.dadosBackup));
              };

              $scope.onClickEnviar = function () {
                 $scope.dados.situacao_id = "6";
                 helper.post("Orcamento/AlterarSituacao", $scope.dados, function (dados) {
                    preencherDados(dados);
                    helper.mensagem(dados.Mensagem);
                 });
              };

              $scope.onClickCancelar = function () {
                 //enquanto o pedido ainda não foi aprovado. poderá cancelar e editar.
                 $scope.dados.situacao_id = "4";
                 helper.post("Orcamento/Cancelar", $scope.dados, function (dados) {
                    preencherDados(dados);
                    helper.mensagem(dados.Mensagem);
                 });
              };

              // Itens
              function validaDadosItemServico() {
                 if ($scope.item.descricao === null || $scope.item.descricao === '') {
                    helper.msgAdvertencia("Preencha o campo descrição do produto");
                    return false;
                 }
                 if ($scope.item.quantidade === null || $scope.item.quantidade === '' || isNaN($scope.item.quantidade)) {
                    helper.msgAdvertencia("Preencha o campo quantidade do produto");
                    return false;
                 }
                 if ($scope.item.preco_unitario === null || $scope.item.preco_unitario === '') {
                    helper.msgAdvertencia("Preencha o campo vlr. unitário do produto");
                    return false;
                 }
                 return true;
              }

              $scope.onClickItemAdicionar = function () {
                 if (validaDadosItemServico()) {
                    $scope.dadosLov.item.push(angular.copy($scope.item));
                    $scope.item = limparItensDados();
                 }
              };

              $scope.onClickItemRemover = function (index) {
                 $scope.dadosLov.item.splice(index, 1);
              };

              $scope.onClickEditarItem = function (index) {
                 $scope.view.editarItem = true;
                 $scope.itemBackup = angular.copy($scope.dadosLov.item[index]);
                 $scope.item = $scope.dadosLov.item[index];
              };

              $scope.onClickItemSalvar = function () {
                 if (validaDadosItemServico()) {
                    $scope.view.editarItem = false;
                    $scope.itemBackup = {};
                    $scope.item = limparItensDados();
                 }
              };

              $scope.onClickItemCancelar = function () {
                 $scope.view.editarItem = false;
                 var index = $scope.dadosLov.item.indexOf($scope.item);
                 $scope.dadosLov.item[index] = angular.copy($scope.itemBackup);
                 $scope.itemBackup = {};
                 $scope.item = limparItensDados();
              };

              // Servico functios servico
              function validaDadosServicoServico() {
                 if ($scope.servico.descricao === null || $scope.servico.descricao === '') {
                    helper.msgAdvertencia("Preencha o campo descrição do serviço");
                    return false;
                 }
                 if ($scope.servico.quantidade === null || $scope.servico.quantidade === '' || isNaN($scope.servico.quantidade)) {
                    helper.msgAdvertencia("Preencha o campo Quantidade do serviço");
                    return false;
                 }
                 if ($scope.servico.preco_unitario === null || $scope.servico.preco_unitario === '') {
                    helper.msgAdvertencia("Preencha o campo vlr. unitário do servico");
                    return false;
                 }
                 return true;
              }

              $scope.onClickServicoAdicionar = function () {
                 if (validaDadosServicoServico()) {
                    $scope.dadosLov.servico.push(angular.copy($scope.servico));
                    $scope.servico = limparServicoDados();
                 }
              };

              $scope.onClickServicoRemover = function (index) {
                 $scope.dadosLov.servico.splice(index, 1);
              };

              $scope.onClickEditarServico = function (index) {
                 $scope.view.editarServico = true;
                 $scope.servicoBackup = angular.copy($scope.dadosLov.servico[index]);
                 $scope.servico = $scope.dadosLov.servico[index];
              };

              $scope.onClickServicoSalvar = function () {
                 if (validaDadosServicoServico()) {
                    $scope.view.editarServico = false;
                    $scope.servicoBackup = {};
                    $scope.servico = limparServicoDados();
                 }
              };

              $scope.onClickItemCancelar = function () {
                 $scope.view.editarServico = false;
                 var index = $scope.dadosLov.servico.indexOf($scope.servico);
                 $scope.dadosLov.servico[index] = angular.copy($scope.servicoBackup);
                 $scope.servicoBackup = {};
                 $scope.servico = limparServicoDados();
              };

              $scope.onClikAtualizarImagem = function () {
                 $scope.images = [];
                 helper.post("Orcamento/BuscarImagem", {id: $scope.dados.id}, function (imagens) {
                    $scope.images = imagens;
                 });
              };

              $scope.onClickListarProdutos = function () {
                 $scope.abrirModal("view-partial/produto-listar-modal.html", "produtoListarModalCtrl", 'lg', $scope);
              };

              // editar imagem
              $scope.$on('onClickRemoveImage', function (event, data) {
                 $scope.confirm('Deseja excluir a Imagem?', function () {
                    helper.post("Orcamento/ExcluirImagem", {grupo: data, id: $scope.dados.id}, function (imagens) {
                       $scope.images = imagens;
                    });
                 });
              });

              $scope.$on('onClickEditImage', function (event, data) {
                 var param = {
                    dados: {id: $scope.dados.id, nome: data.nome, texto: data.texto},
                    scope: $scope
                 };
                 $scope.abrirModal("view-partial/editar-imagem.html", "editarImagemCtrl", null, param);
              });

           }]);

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

angular.module('app')
        .controller('pedidoCtrl', ['$scope', 'helper', '$routeParams', function ($scope, helper, $routeParams) {

   $scope.view = {
      aba: 1,
      editarItem: false,
      salvar: true,
      editar: true,
      enviar: true,
      cancelar: true,
      isAdm: '',
      existeVeiculo: false,
      dataHora: null,
      tipo: [{id: "2", descricao: 'Produto ou/e Serviço'}, {id: "1", descricao: 'Serviços'}]
   };

   $scope.dados = {
      id: null,
      categoria_id: null,
      cliente_id: null,
      data_criacao: '',
      observacao: '',
      marca_modelo: '',
      placa: '',
      ano_fabricacao: '',
      ano_modelo: '',
      chassi: '',
      renavam: '',
      servico: '',
      usuario_criou: '',
      km: null,
      veiculo_id: null
   };

   $scope.dadosLov = {
      cliente: []
   };

   $scope.backup = {};

   // carrega os dados default	
   $scope.itemBackup = {id: '', descricao: '', quantidade: '', sugestao: 1, produto_id: null};
   $scope.item = {
      id: '',
      descricao: '',
      quantidade: '',
      sugestao: 1,
      produto_id: null
   };

   var limparDados = function () {
      return angular.copy({id: '', descricao: '', quantidade: '', sugestao: 1, produto_id: null});
   };

   if ($routeParams.id > 0) {
      $scope.view.salvar = true;
      $scope.dados.id = $routeParams.id;
   } else {
      $scope.view.salvar = false;
      $scope.dados.id = 0;
   }

   helper.get("Pedido/Buscar", $scope.dados.id, function (dados) {
      carregarDados(dados);
      $scope.dados.data_criacao = time();
      $scope.view.isAdm = (parseInt($scope.user.Nivel) === 1);
      criarBackup();  
   });

   $scope.onBuscarVeiculo = function () {
     if(!$scope.dados.placa){
        $scope.dados.placa='';
     }
      helper.get("Veiculo/BuscarPorPlaca", $scope.dados.placa, function (dados) {
         $scope.view.existeVeiculo = false;
         $scope.dados.marca_modelo = dados.marca_modelo;
         $scope.dados.ano_fabricacao = dados.ano_fabricacao;
         $scope.dados.ano_modelo = dados.ano_modelo;
         $scope.dados.chassi = dados.chassi;
         $scope.dados.renavam = dados.renavam;
         $scope.dados.veiculo_id = dados.id;

         if ($scope.dados.veiculo_id > 0) {
            $scope.view.existeVeiculo = true;
         }
      });
   };
   
   function time() {
      $scope.view.dataHora = new Date();
   }

   // functios
   $scope.onClickItemAdicionar = function () {
      if (validaDadosItem()) {
         $scope.dadosLov.item.push(angular.copy($scope.item));
         $scope.item = limparDados();
      }
   };

   $scope.onClickItemRemover = function (index) {
      $scope.dadosLov.item.splice(index, 1);
   };

   $scope.onClickEditarItem = function (index) {
      $scope.view.editarItem = true;
      $scope.itemBackup = angular.copy($scope.dadosLov.item[index]);
      $scope.item = $scope.dadosLov.item[index];
   };

   $scope.onClickItemSalvar = function () {
      if (validaDadosItem()) {
         $scope.view.editarItem = false;
         $scope.itemBackup = {};
         $scope.item = limparDados();
      }
   };

   $scope.onClickItemCancelar = function () {
      $scope.view.editarItem = false;
      var index = $scope.dadosLov.item.indexOf($scope.item);
      $scope.dadosLov.item[index] = angular.copy($scope.itemBackup);
      $scope.itemBackup = {};
      $scope.item = limparDados();
   };

   //crud
   $scope.onClickSalvar = function () {
      if ($scope.view.editarItem === true) {
         helper.msgAdvertencia('Salve ou Cancele as alterações dos item(s)');
         return;
      }
      $scope.dados.usuario_criou = $scope.UserCodigo();
      var dados = {
         dados: $scope.dados,
         item: $scope.dadosLov.item
      };
      
      if ($scope.dados.id > 0) {
         helper.post("Pedido/Editar", dados, function (data) {
            $scope.view.salvar = true;
            helper.mensagem(data.Mensagem);
            criarBackup();
         });
      } else {
         helper.post("Pedido/Cadastrar", dados, function (data) {
            $scope.view.salvar = true;
            $scope.dados.id = data.Entidade.id;
            $scope.dados.cliente_id = data.Entidade.cliente_id;
            helper.mensagem(data.Mensagem);
            criarBackup();
         });
      }
   };

   function validaDadosItem() {
      if ($scope.item.descricao === null || $scope.item.descricao === '') {
         helper.msgAdvertencia("Preencha o campo descrição");
         return false;
      }
      if ($scope.item.quantidade === null || $scope.item.quantidade === '') {
         helper.msgAdvertencia("Preencha o campo Quantidade");
         return false;
      }
      return true;
   }

   $scope.onClickEnviar = function () {
      $scope.dados.situacao_id = "3";
      helper.post("Pedido/MudarSituacaoPedido", $scope.dados, function (dados) {
         $scope.view.salvar = true;
         $scope.view.editar = false;
         $scope.view.enviar = false;
         $scope.dados = dados.Entidade;
         $scope.dadosLov.situacao = dados.Lov.situacao;
         helper.mensagem(dados.Mensagem);
      });
   };

   $scope.onClickCancelar = function () {
      $scope.dados.situacao_id = "4";
      helper.post("Pedido/Cancelar", $scope.dados, function (dados) {
         $scope.view.cancelar = false;
         $scope.dados = dados.Entidade;
         $scope.dadosLov.situacao = dados.Lov.situacao;
         helper.mensagem(dados.Mensagem);
      });
   };

   $scope.onClickDesfazer = function () {
      $scope.view.salvar = true;
      $scope.view.editar = true;
      $scope.dados = angular.copy($scope.backup.dados);
      $scope.dadosLov = angular.copy($scope.backup.dadosLov);
   };

   function criarBackup() {
      $scope.backup.dados = angular.copy($scope.dados);
      $scope.backup.dadosLov = angular.copy($scope.dadosLov);      
   }

   function carregarDados(dados) {
      $scope.dados = dados.Entidade;
      $scope.dadosLov = dados.Lov;
      $scope.dadosLov.item = $scope.toList(dados.Lov.item);
      $scope.dados.situacao_id = ($scope.dados.situacao_id > 0) ? $scope.dados.situacao_id : "10";
      if ($scope.dados.situacao_id !== "10") {
         $scope.view.salvar = true;
         $scope.view.editar = false;
         $scope.view.enviar = false;
         if ($scope.dados.situacao_id === "4") {
            $scope.view.cancelar = false;
         }
      }
   }

   $scope.onClickListarProdutos = function () {
      $scope.abrirModal("view-partial/produto-listar-modal.html", "produtoListarModalCtrl", 'lg', $scope);
   };
}]);

angular.module('app')
        .controller('produtoListarModalCtrl', ['$scope', 'helper', '$modalInstance', 'param', function ($scope, helper, $modalInstance, param) {
              $scope.view = {
                 pesquisa: null,
                 filtroUnico: null,
                 placeholder: 'Pesquisar por: Codigo Interno - Código Inventário - Nome Produto - Modelo - Categoria - Grupo - Sub-Grupo',
                 dados: [],
              };

              $scope.promessa(function () {
                 if (!$scope.UserNivel().In(1)) {
                    //listar($scope.view.filtroUnico);
                 }
              });

              $scope.onKeyPressListar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    listar($scope.view.filtroUnico);
                 }
              };

              $scope.onClickListar = function () {
                 listar($scope.view.filtroUnico);
              };

              function listar(dados) {
                 helper.post("Produto/Listar", dados, function (dados) {
                    $scope.view.dados.clearGrid();
                    $scope.view.dados = $scope.toList(dados);
                 });
              }

              $scope.onClickFecharModal = function () {
                 $modalInstance.dismiss('cancel');
              };

              $scope.onClickAssociar = function (id, preco, descricao) {
                 param.item.produto_id = angular.copy(id);
                 param.item.descricao = angular.copy(descricao);
                 $modalInstance.dismiss('cancel');
              };
           }]);

angular.module('app')
        .controller('produtoListarCtrl',['$scope', 'helper', function($scope, helper) {
	$scope.view = {
		pesquisa:null,
		filtroUnico : null,
		placeholder : 'Pesquisar por: Codigo Interno - Código Inventário - Nome Produto - Modelo - Categoria - Grupo - Sub-Grupo',
		dados : []	
	};
		
	$scope.promessa(function(){	
		if(!$scope.UserNivel().In(1)){
			listar($scope.view.filtroUnico);
		}
	});
	
	$scope.onKeyPressListar = function(events) {
		if (events.which === 13 || events.keyCode === 13) {
			listar($scope.view.filtroUnico);
		}
	};
	
	$scope.onClickListar = function() {
		listar($scope.view.filtroUnico);
	};
	
	function listar(dados) {				
		helper.post("Produto/Listar", dados, function(dados) {
			$scope.view.dados.clearGrid();
			$scope.view.dados = $scope.toList(dados);			
		});
	}
}]);

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

angular.module('app')
        .controller('recuperarSenhaCtrl', ['$scope', 'helper', function ($scope, helper) {

              $scope.dados = {
                 email: ''
              };

              $scope.RecuperarSenha = function () {

                 if ($scope.dados.email.isNullOrEmpty()) {
                    var msg = [{
                          Tipo: 3,
                          Mensagem: "Preencha o campo email"
                       }];
                    helper.mensagem(msg);
                    return;
                 }
                 helper.post("User/RecuperarSenha", $scope.dados, function (msg) {
                    helper.mensagem(msg);
                    helper.redirecionar("/", 4);
                 });
              };

           }]);

angular.module('app')
        .controller('relatorioCtrl', ['$scope', 'helper', function ($scope, helper) {
              $scope.dados = {
                 filtro: null,
                 valor: null,
                 situacao: null,
                 data1: null,
                 data2: null
              };
              $scope.view = {
                 descricao: null,
                 resultado: [],
                 dadosLov: null,
              };
              $scope.pesquisa = {
                 filtro: [{
                       id: 'e.nome_fantasia',
                       descricao: 'Estabelecimento'
                    }, {
                       id: 't.nome_fantasia',
                       descricao: 'Cliente'
                    }, {
                       id: 'p.data_aprovacao',
                       descricao: 'Data Aprovação'
                    }, {
                       id: 'p.data_criacao',
                       descricao: 'Data Criação'
                    }, {
                       id: 'p.renavam',
                       descricao: 'Renavam'
                    }, {
                       id: 'p.placa',
                       descricao: 'Placa'
                    }, {
                       id: 'p.chassi',
                       descricao: 'Chassi'
                    }, {
                       id: 'periodo_aprovacao',
                       descricao: 'Período Aprovação'
                    }, ]
              };
              helper.get("Relatorio/Buscar", null, function (r) {
                 $scope.view.dadosLov = r.Lov;
              });
              $scope.onClickFiltrar = function () {
                 helper.post("Relatorio/Filtrar", $scope.dados, function (r) {
                    $scope.view.resultado.clearGrid();
                    $scope.view.resultado = $scope.toList(r.Entidade);
                 });
              };

           }]);

angular.module('app')
        .controller('subGrupoCtrl', ['$scope', 'helper', function ($scope, helper) {
              $scope.view = {
                 editar: false,
              };

              $scope.dados = {
                 id: null,
                 descricao: null,
                 categoria_id: null,
                 grupo_id: null
              };

              $scope.backup = {
                 id: null,
                 descricao: null,
                 categoria_id: null,
                 grupo_id: null
              };

              $scope.lov = {
                 categoria: [],
                 grupo: []
              };

              $scope.grade = {
                 lista: [],
              };

              helper.get("SubGrupo/Listar", $scope.dados.id, function (dados) {
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

              // functios
              $scope.onChangeCarregaGrupo = function (id) {
                 if (id > 0) {
                    helper.get("Grupo/BuscarPorCategoria", id, function (dados) {
                       $scope.lov.grupo = dados;
                    });
                 }
              };

              $scope.onClickEditarItem = function (item) {
                 $scope.backup.id = angular.copy(item.id);
                 $scope.backup.descricao = angular.copy(item.descricao);
                 $scope.backup.categoria_id = angular.copy(item.categoria_id);
                 $scope.backup.grupo_id = angular.copy(item.grupo_id);

                 $scope.dados.id = item.id;
                 $scope.dados.descricao = item.descricao;
                 $scope.dados.categoria_id = item.categoria_id;
                 $scope.dados.grupo_id = item.grupo_id;

                 $scope.onChangeCarregaGrupo(item.categoria_id);
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
                 helper.post("SubGrupo/Cadastrar", $scope.dados, sucess);
              }

              function editar(sucess) {
                 helper.post("SubGrupo/Editar", $scope.dados, sucess);
              }

           }]);

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


angular.module('app')
        .controller('veiculoListarCtrl', ['$scope', 'helper', function ($scope, helper) {

              $scope.view = {
                 filtroUnico: '',
                 placeholder: 'Pesquisar por: Código - Placa - Marca/Modelo - Cliente',
                 dados: []
              };

              $scope.promessa(function () {
                 if (!$scope.UserNivel().In(1)) {
                    listar();
                 }
              });

              $scope.onKeyPressListar = function (events) {
                 if (events.which === 13 || events.keyCode === 13) {
                    listar();
                 }
              };

              $scope.onClickListar = function () {
                 listar();
              };

              function listar() {
                 helper.post("Veiculo/Listar", $scope.view.filtroUnico, function (dados) {
                    $scope.view.dados.clearGrid();
                    $scope.view.dados = $scope.toList(dados);
                 });
              }
           }]);

angular.module('app')
        .controller('veiculoCtrl', ['$scope', 'helper', '$routeParams', 'serviceModel', function ($scope, helper, $routeParams, serviceModel) {
              $scope.view = {
                 editar: false
              };
              $scope.dados = serviceModel.veiculo();
              $scope.dadosLov = null;
              $scope.dados.id = ($routeParams.id) ? $routeParams.id : 0;

              helper.get("Veiculo/Buscar", $scope.dados.id, function (retorno) {
                 $scope.dados = retorno.Entidade;
                 $scope.dadosLov = retorno.Lov;
              });

              $scope.onClickSalvar = function () {
                 if ($scope.dados.id > 0) {
                    helper.post("Veiculo/Editar", $scope.dados, function (retorno) {
                       helper.mensagem(retorno.Mensagem);
                       $scope.view.editar = false;
                       $scope.view.editar = false;
                    });
                 } else {
                    helper.post("Veiculo/Cadastrar", $scope.dados, function (retorno) {
                       helper.mensagem(retorno.Mensagem);
                       $scope.dados = serviceModel.veiculo();
                    });
                 }
              };
           }]);
