/* global angular */
Array.prototype.BuscarPorId = function (id) {

  for (var i = 0; i < this.length; i++) {
    if (parseInt(this[i].ID) === parseInt(id)) {
      return angular.copy(this[i]);
    }
  }
  return null;
};

Array.prototype.isValue = function (chave, valor) {
  for (var i = 0; i < this.length; i++) {
    if (this[i][chave] === valor)
      return true;
  }
  return false;
};
Array.prototype.sum = function (chave) {
  var total = 0;
  for (var i = 0; i < this.length; i++) {
    total = total + this[i][chave];
  }
  return total;
};
Array.prototype.find = function (chave, value, comparador) {
  var array=[];

  for (var i = 0; i < this.length; i++) {
    if (this[i][chave] === value) {
      array.push(this[i]);
    }
  }

  return array;
};
Array.prototype.where = function (chave, comparador, value) {

  var array=[];

  for (var i = 0; i < this.length; i++) {

    if (comparador === "=") {
      if (this[i][chave] === value) {
        array.push(this[i]);
      }
    } else if (comparador === ">") {
      if (this[i][chave] > value) {
        array.push(this[i]);
      }
    } else if (comparador === "<") {
      if (this[i][chave] < value) {
        array.push(this[i]);
      }
    } else if (comparador === "!==") {
      if (this[i][chave] !== value) {
        array.push(this[i]);
      }
    } else if (comparador === ">==") {
      if (this[i][chave] >= value) {
        array.push(this[i]);
      }
    } else if (comparador === "<==") {
      if (this[i][chave] <= value) {
        array.push(this[i]);
      }
    }
  }

  return array;
};

//*****String

String.prototype.In = function () {
  var valor = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    if (parseInt(valor) === parseInt(arguments[i])) {
      return true;
    }
  }
  return false;
};

String.prototype.toBoolean = function () {
  var valor = this.toString();
  return valor === '1' || valor === 'true' || valor === 'TRUE';
};

String.prototype.MaxLength = function (v) {
  var valor = this.toString();
  return valor.substring(0, v) + "...";
};

String.prototype.isNullOrEmpty = function () {
  var valor = this.toString();
  if (valor === null || valor === '' || valor === 'null' || valor === undefined) {
    return true;
  }
  return false;
};

String.prototype.toDate = function () {
  var obj = this.toString();

  if (obj) {
   /*jshint evil:true */
    obj = obj.toString().indexOf("/Date(") > -1 ? new Date(eval('new ' + obj.replace("/", "").replace("/", ""))) : obj;
  }
  return obj;
};

String.prototype.isNullOrEmpty = function (args) {
  var valor = '';
  if (args === '' || args === undefined || args === null) {
    valor = this.toString();
  } else {
    valor = args;
  }
  return (valor === null || valor === '' || valor === undefined);
};

//*****Number*******
Number.prototype.In = function () {
  var valor = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    if (parseInt(valor) === parseInt(arguments[i])) {
      return true;
    }
  }
  return false;
};

Number.prototype.isNullOrEmpty = function () {
  var valor = this.toString();
  return (valor === null || valor === '' || valor === undefined || isNaN(valor));
};

Number.prototype.trunc = function (qtdCasasDecimais) {
  return this.toFixed(qtdCasasDecimais);
};

Number.prototype.subtrair = function (value) {
  if (!value)
    return this;
  if (value.isNullOrEmpty())
    return 0;
  var valor1 = parseFloat(this).toFixed(2);
  var valor2 = parseFloat(value).toFixed(2);
  var resultado = (valor1 - valor2);
  return resultado;
};

Number.prototype.subtrairPorcentagem = function (value) {
  if (!value)
    return this;
  if (value.isNullOrEmpty())
    return 0;
  var valor1 = parseFloat(this).toFixed(2);
  var procentagem = valor1 - (valor1 * value);
  return procentagem;
};

Number.prototype.obterValorDaPorcentagem = function (value) {
  if (!value)
    return 0;
  if (value.isNullOrEmpty())
    return 0;
  var valor1 = parseFloat(this).toFixed(2);
  var procentagem = valor1 * value;
  return procentagem;
};
//*****Window

Window.prototype.isNullOrEmpty = function () {
  var valor = this.toString();
  if (valor === null || valor === '' || valor === 'null' || valor === undefined) {
    return true;
  }
  return false;
};

//$scope.chat.atualizarAlert.In("id") = parseInt($scope.user.amigo)!==destinatario;             
//  unshift - >adiciona no começo pop remove do fim...
// ARRAY.forEach(function(element){});
// ARRAY.filter
// ARRAY.every -> todos são
// ARRAY.some -> existe
// ARRAY.map
// ARRAY.reduce(valor_Anterior, atual) -> somar






/* global angular */
angular.module('customFilter', [])
        .filter("cpfFormat", function () {
          return function (value) {
            if (!value)
              return;
            if (value.length === 11) {
              var firstGroup = value.substring(0, 3);
              var secondGroup = value.substring(3, 6);
              var thirdGroup = value.substring(6, 9);
              var safeDigit = value.substring(9, 11);

              return firstGroup + "." + secondGroup + "." + thirdGroup + "-" + safeDigit;
            }

            return value;
          };
        })
        .filter("cnpjFilter", function () {
          return function (value) {
            if (!value)
              return;
            if (value.lenth === 14) {
              return value.substring(0, 2) + "." +
                      value.substring(2, 5) + "." +
                      value.substring(5, 8) + "/" +
                      value.substring(8, 12) + "-" +
                      value.substring(12, 14);
            }
            return value;
          };
        })
        .filter("cepFilter", function () {
          return function (value) {
            if (!value)
              return;
            if (value.length === 8) {
              return value.substring(0, 2) + "." + value.substring(2, 5) + "-" + value.substring(5, 8);
            }
            return value;
          };
        })
        .filter("foneFilter", function () {
          return function (value) {
            if (!value)
              return;
            if (value.length === 10) {
              return "(" + value.substring(0, 2) + ") " + value.substring(2, 6) + "-" + value.substring(6, 10);
            } else if (value.length === 11) {
              return "(" + value.substring(0, 2) + ") " + value.substring(2, 7) + "-" + value.substring(7, 12);
            }
            return value;
          };
        })
        .filter("setMaxLength", function () {
          return function (input, maxLength) {

            if (!input)
              return;

            if (input.length > maxLength) {
              return input.substring(0, (maxLength - 4)) + " ...";
            } else {
              return input;
            }
          };
        })
        .filter("dataFilter", function () {
          return function (value) {
            if (value) {
              var data = new Date(value);//browser antigos não funcionam dessa forma aqui.  
              var dia = data.getDate();
              var mes = (data.getMonth() + 1);
              var ano = data.getFullYear();
              return dia + '/' + mes + '/' + ano;

            } else {
              return value;
            }
          };
        });

/* Utilize o filter abaixo do proprio angular js
 * 
 * { {valor | currency:'R$'} }
 */

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
angular.module('httpInterceptor',['toaster']);

angular.module('httpInterceptor').factory('httpInterceptor', ['$q','toaster','$rootScope','$location',
                                   function($q, toaster,$rootScope) {
				return {
					request : function(config) {
						return config || $q.when(config);
					},

					requestError : function(rejection) {
						return $q.reject(rejection);
					},

					response : function(response) {
						
						$rootScope.$broadcast('fecharLoad');
						
						if (response.data.length===1) {
						
							var msg = response.data;
							
							if (parseInt(msg[0].Tipo) === 3) {
								
								angular.forEach(msg,function(value, key) {
									toaster.publicarAdvertencia(value.Mensagem);
								});	
								return $q.reject(response);
								
							}else if (parseInt(msg[0].Tipo) === 4) {
								angular.forEach(msg,function(value, key) {
									toaster.publicarErro(value.Mensagem);
								});
								return $q.reject(response);
							}							
							
						}
						return response || $q.when(response);
					},

					responseError : function(rejection) {                      
						$rootScope.$broadcast('fecharLoad');
						switch (rejection.status) {
						// Bad Request
						case 400:
							var errorList = rejection.data;
							if (errorList && errorList.length) {
								angular.forEach(errorList, function(item) {
									toaster.popWarning('Atenção!',
											item.Mensagem);
								});
							} else {
								toaster.popError('Erro!',
										'Requisição inválida! CODE: ' + 400);
							}
							break;
						// Not Found
						case 404:
							toaster.popError('Erro!',
									'Recurso não encontrado! CODE: ' + 404);
							break;

						// Unauthorized
						case 401:
							// $rootScope.ModalOpen("/Autenticacao/LogarPartial",
							// 'AutenticacaoCtrl', null, null);
                            toaster.publicarAdvertencia('Autentique-se');
                                    $rootScope.deslogar();
                                    break;
                                    

							// Forbidden
						case 403:
							if (rejection.data) {
								toaster.popWarning('Atenção!', rejection.data);
							}

							break;
						// Method Not Allowed
						case 405:
							toaster.popError('Erro!',
									'Método não permitido! CODE: ' + 405);
							break;
						// Internal Server Error
						case 500:
							// if (rejection.data &&
							// rejection.data.ExceptionMessage) {
							if (rejection.data) {
								toaster.popError('Erro!', rejection.data);
							}
							break;

						default:
							toaster.popError('Erro!', 'Ocorreu um erro inesperado. Informe o Suporte Técnico. CODE: ' + rejection.status);
						}

						return $q.reject(rejection);
					}
				};

} ]);

angular.module('httpInterceptor').config(['$httpProvider',
 			function($httpProvider) {
 				$httpProvider.interceptors.push('httpInterceptor');
 				$httpProvider.defaults.withCredentials = true;
 			} ]);

angular.module('api', ['toaster', 'ui.bootstrap', 'angularFileUpload']);

angular.module('api').config([function () {
      $.fn.datepicker.dates['pt-BR'] = {
         days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
         daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
         daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
         months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
         monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
         today: "Hoje",
         clear: "Limpar",
         startDate: 0
      };
   }]);

angular.module('api').service('helper', ['$http', 'toaster', '$location', '$timeout', '$rootScope', function ($http, toaster, $location, $timeout, $rootScope) {
      var url = $location.absUrl();
      var total = url.search('app');
      var SERVER_URL = url.substr(0, total) + 'server/';
      var ext = ''; //->para qual tipo de aplicacao está sendo consumida os dados.

      return {
         get: function (url, id, sucess) {
            //$rootScope.$broadcast('abrirLoad');
            url = SERVER_URL + url + ext;
            url = (id === null) ? url : url + "/" + id;
            return $http({
               method: 'GET',
               url: url
            }).success(sucess);
         },
         post: function (url, data, sucess) {
            $rootScope.$broadcast('abrirLoad');
            url = SERVER_URL + url + ext;
            return $http({
               method: 'POST',
               url: url,
               data: data
            }).success(sucess);
         },
         put: function (url, data, sucess) {
            url = SERVER_URL + url + ext;
            return $http({
               method: 'POST',
               url: url,
               data: data
            }).success(sucess);
         },
         msgAdvertencia: function (msg) {
            toaster.publicarAdvertencia(msg);
         },
         mensagem: function (msg) {

            // Tipo: Sucesso = 1, Aviso = 2, Advertência =
            //3, Erro = 4

            if (msg === null)
               return;
            var tipo = parseInt(msg[0].Tipo);

            if (tipo === 1) {
               toaster.publicarSucesso(msg[0].Mensagem);

            } else if (tipo === 2) {
               angular.forEach(msg, function (value, key) {
                  toaster.publicarInformacao(value.Mensagem);
               });
            } else if (tipo === 3) {
               angular.forEach(msg, function (value, key) {
                  toaster.publicarAdvertencia(value.Mensagem);
               });
            } else if (tipo === 4) {
               angular.forEach(msg, function (value, key) {
                  toaster.publicarErro(value.Mensagem);
               });
            }
         },
         redirecionar: function (url, time) {
            if (time === '' || time === null || time === undefined) {
               $location.path(url);
            } else {
               $timeout(function () {
                  $location.path(url);
               }, (time * 1000));// tempo em segundos
            }
         },
         toList: function (objeto) {
            if (objeto !== 'null' && objeto !== '' && objeto !== undefined && objeto !== null) {
               if (objeto.length === undefined) {
                  return [objeto];
               }
               return objeto;
            } else {
               return [];
            }
         },
         path: function () {
            return $location.absUrl().substr(0, $location.absUrl().indexOf("#"));
         },
         loadTemplat: function (templatName) {
            return $location.absUrl().substr(0, $location.absUrl().indexOf("#")) + "app-config/template/" + templatName;
         },
         loadImage: function (nomeImg) {
            return $location.absUrl().substr(0, $location.absUrl().indexOf("#")) + "img/" + nomeImg;
         },
         urlServer: function () {
            return SERVER_URL;
         },
         loadingOpen: function () {
            $rootScope.$broadcast('abrirLoad');
         },
         loadingClose: function () {
            $rootScope.$broadcast('fecharLoad');
         },
         serverUrl: function (url) {
            return SERVER_URL + url + ext;
         }
      };
   }]);

angular.module('api').directive("visualizarRelatorio", ["$injector", function ($injector) {
      return {
         restrict: 'A',
         link: function (scope, element, attr) {
            var helper = $injector.get("helper");
            element.on('click', function () {
               var param = attr.visualizarRelatorio;
               var url = helper.urlServer();
               window.open(url + param, '_blank');
            });
         }
      };
   }]);

angular.module('api').directive("visualizarRelatorio", ["$injector", function ($injector) {
      return {
         restrict: 'AE',
         link: function (scope, element, attr) {
            var helper = $injector.get("helper");
            element.on('click', function () {
               var param = attr.visualizarRelatorio;
               var url = helper.urlServer();
               window.open(url + param, '_blank');
            });
         }
      };
   }]);

angular.module('api').service("upload", ['$injector', '$modal', function ($injector, $modal) {
      var helper = $injector.get('helper');
      return {
         open: function (param, callback) {
            var parametro = {
               server: param.server,
               callback: callback,
               dropZone: (param.dropZone) ? param.dropZone : false,
               limiteArquivos: (param.limiteArquivos) ? param.limiteArquivos : 1,
               formData: param.formData,
               fileAdd: param.fileAdd,
               autoClose: param.autoClose
            };

            $modal.open({
               templateUrl: helper.loadTemplat("upload.html"),
               keyboard: false,
               size: 'lg',
               backdrop: 'static',
               resolve: {
                  parametro: function () {
                     return parametro;
                  }
               },
               controller: (['$scope', '$modalInstance', 'parametro', 'FileUploader', 'helper', function ($scope, $modalInstance, parametro, FileUploader, helper) {
                     var localUrl = helper.serverUrl(parametro.server);
                     $scope.view = {
                        title: "Anexar arquivos",
                        limiteArquivos: parametro.limiteArquivos,
                        dropZone: parametro.dropZone,
                        formData: parametro.formData,
                        fileAdd: parametro.fileAdd,
                        autoClose: parametro.autoClose
                     };

                     var uploader = $scope.uploader = new FileUploader({
                        url: localUrl,
                        formData: [{data: $scope.view.formData}]
                     });
                     uploader.filters.push({
                        name: 'customFilter',
                        fn: function (item, options) {
                           return this.queue.length < $scope.view.limiteArquivos;
                        }
                     });
                     $scope.onClickFecharModal = function () {
                        $modalInstance.dismiss('cancel');
                     };
                     uploader.onAfterAddingFile = function (fileItem) {
                        if ($scope.view.fileAdd !== null && $scope.view.fileAdd !== undefined) {
                           $scope.view.fileAdd(fileItem);
                        }
                     };
                     uploader.onSuccessItem = function (fileItem, response, status, headers) {
                        if (parametro.callback) {
                           parametro.callback(response);
                        }
                        if ($scope.view.autoClose) {
                           $modalInstance.dismiss('cancel');
                        }
                     };
                     uploader.onErrorItem = function (fileItem, response, status, headers) {
                        var msg = null;
                        if (angular.isObject($(response).find("p").text())) {
                           helper.mensagem(angular.fromJson($(response).find("p").text()));
                        } else {
                           helper.msgAdvertencia($(response).find("p").text());
                        }
                     };
                     uploader.onSuccess = function (response, status, headers) {
                        $modalInstance.dismiss('cancel');
                     };
                     $scope.Conveter = function (vByte) {
                        var kiloByte = Math.round((vByte / 1024));
                        function mascara(obj) {
                           obj = obj.toString();
                           var tam = obj.length;
                           var temp = '';
                           for (var i = (tam - 1); i >= 0; i--) {
                              temp = obj.charAt(i) + temp;
                              if ((obj.substr(i).length % 3 === 0) && (i > 0)) {
                                 temp = '.' + temp;
                              }
                           }
                           return temp;
                        }
                        return mascara(kiloByte) + 'Kb';
                     };
                  }]) //FIM CONTROLLER
            }); //FIM MODAL				
         } // fim do metodo open
      }; //FIM RETURN
   }]);

angular.module('api').directive("loading", ['$injector', '$timeout', function ($injector, $timeout) {
      var helper = $injector.get('helper');
      return {
         replace: true,
         restrict: 'EA',
         scope: true,
         require: '?ngModel',
         templateUrl: helper.loadTemplat("loading.html"),
         link: function (scope, element, attr) {
            var imgLoad = element.find("img");
            imgLoad.attr("src", helper.path() + "img/loader.gif");

            scope.$on("abrirLoad", function () {
               $timeout(function () {
                  var modal = element.modal({
                     backdrop: 'static'
                  });
                  var elementos = $(angular.element('.modal-backdrop'));
                  var $el = $(elementos.get(1));
                  $el.attr('id', 'loadin-modal-backdrop').css('z-index', '9998');
               });
            });
            scope.$on("fecharLoad", function () {
               $timeout(function () {
                  var modal = element.modal('hide');
                  var $el = $(angular.element('#loadin-modal-backdrop'));
                  if ($el[0] !== undefined) {
                     $el.remove();
                  }
               });
            });
         }
      };
   }]);

angular.module('api').directive('jcarouselFancybox', ['$injector', '$timeout', function ($injector, $timeout) {
      var helper = $injector.get('helper');
      var controller = function ($scope, $timeout) {
         $scope.onClickRemove = function (imagem) {
            $scope.$emit("onClickRemoveImage", imagem);
         };
         $scope.onClickEdit = function (nome, texto) {
            var data = {nome: nome, texto: texto};
            $scope.$emit("onClickEditImage", data);
         };

         $timeout(function () {
            $(".fancybox").fancybox({
               helpers: {
                  title: {
                     type: 'float' //'over' //'inside' //'outside' //
                  }
               }
            });
         });
      };
      return {
         restrict: 'AE',
         replace: false,
         transclude: false,
         scope: {
            images: "=",
            edit: "@",
            remove: "@"
         },
         templateUrl: helper.loadTemplat("carrousel.html"),
         link: function link(scope, element, attrs) {

            var container = $(element).children('.wrapper').children('.jcarousel-wrapper');
            var carousel = container.children('.jcarousel');

            carousel.jcarousel({
               wrap: 'circular'
            });

            scope.$watch(attrs.images, function (value) {
               carousel.jcarousel('reload');
            });

            container.children('.jcarousel-control-prev')
                    .jcarouselControl({
                       target: '-=1'
                    });

            container.children('.jcarousel-control-next')
                    .jcarouselControl({
                       target: '+=1'
                    });

            attrs.$observe('refesh', function () {
               carregarFanckBox();
            });

            attrs.$observe('editar', function (v) {
               scope.edit = v;
               carregarFanckBox();
            });

            attrs.$observe('remover', function (v) {
               scope.remove = v;
               carregarFanckBox();
            });

            // var carregarFanckBox = function (img) {
            var carregarFanckBox = function () {
               var img = angular.copy(scope.images);
               scope.images = [];
               scope.images = img;
               $timeout(function () {
                  var container = $(element).children('.wrapper').children('.jcarousel-wrapper');
                  var carousel = container.children('.jcarousel');
                  carousel.jcarousel('reload');
                  var link = carousel.children('ul').children('li').children('.fancybox');
                  link.fancybox({
                     helpers: {
                        title: {
                           type: 'float'// 'over' //'inside' //'outside' //
                        }
                     }
                  });
               });
            };
         },
         controller: (['$scope', '$timeout', controller])
      };
   }]);

angular.module('api').directive('select2', ['$timeout', 'helper', function ($timeout, helper) {
      var typing = 0;
      var init = true;
      var lappedChange = false;
      return {
         restrict: 'A',
         scope: {
            ngModel: '=',
            ngInitValue: '=',
            ngAssociated: '&ngAssociated'
         },
         link: function (scope, element, attr, ngModel) {
            attr.placeholder = attr.placeholder ? attr.placeholder : 'Busque aqui';
            var fnChangeAssociated = function () {
               if (scope.ngAssociated && !lappedChange) {
                  scope.ngAssociated();
                  lappedChange = true;
               }
            };
            element.select2({
               placeholder: attr.placeholder,
               minimumInputLength: 3,
               allowClear: true,
               escapeMarkup: function (markup) {
                  return markup;
               },
               formatSelection: function (object, container) {
                  $timeout(function () {
                     scope.ngModel = object.id;
                     scope.ngInitValue = object.item;
                  }, 0);
                  return object.text;
               },
               initSelection: function (inputHidden, callback) {
                  if (scope.ngInitValue) {
                     $timeout(function () {
                        callback({id: scope.ngInitValue.id, text: scope.ngInitValue.texto ? scope.ngInitValue.texto : attr.placeholder, item: angular.copy(scope.ngInitValue)});
                        fnChangeAssociated();
                     }, 0);
                  }
               },
               query: function (options) {
                  typing++;
                  var wait = parseInt(attr.wait);
                  wait = isNaN(wait) ? 500 : wait;
                  if (attr.url) {
                     var fnGo = function () {
                        typing--;
                        if (typing > 0)
                           return;
                        var data = {results: []};
                        helper.get(attr.url, options.term, function (dados) {
                           var lov = helper.toList(dados.Lov);
                           if (lov !== null) {
                              for (var i = 0; i < lov.length; i++) {
                                 data.results.push({id: lov[i].id, text: lov[i].texto, item: lov[i]});
                              }
                              options.callback(data);
                           }
                        });
                     };
                     $timeout(fnGo, wait);
                  }
               }
            }).on("change", function (e) {
               $timeout(function () {
                  fnChangeAssociated();
               }, 0);
            });


            attr.$observe('disabled', function (valor) {
               $timeout(function () {
                  var $el = angular.element("#s2id_" + attr.id);
                  $el.trigger('select2:sincronizar');
               });
            });

            if (scope.ngInitValue) {
               element.select2('val', scope.ngInitValue.ID);
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
               lappedChange = false;
               element.select2('val', newValue);
            });

            $timeout(function () {
               init = false;
            }, 0);
         }
      };
   }]);

angular.module('api').directive('datatable', ['$timeout', function ($timeout) {

      return {
         restrict: 'A',
         scope: {
            ngSource: '=',
            filter: '=',
            menu: '='

         },
         link: function (scope, element, attr, ngModel) {

            element.fadeOut(0);

            var columnsNotOrder, lengthMenu, pageLength;
            columnsNotOrder = attr.columnsnotorder;
            lengthMenu = attr.lengthmenu || "10, 25, 50, 'Todos'";
            pageLength = attr.pagelength || 10;

            scope.fnGetColumnsNotOrder = function () {
               var alItensNotOrder = [];
               var columnsHead = element.find('thead tr th');

               if (columnsNotOrder) {

                  for (var i = 0; i < columnsHead.length; i++) {
                     if (columnsNotOrder.indexOf(i) > -1) {
                        alItensNotOrder.push({"orderable": false});
                     } else {
                        alItensNotOrder.push(null);
                     }
                  }
                  return alItensNotOrder;
               }

               for (var $i = 0; $i < columnsHead.length - 1; $i++) {
                  alItensNotOrder.push(null);
               }
               alItensNotOrder.push({"orderable": false});

               return alItensNotOrder;
            };

            scope.fnGetLengthMenu = function () {
               var alLengthMenu = [];

               if (lengthMenu) {
                  /*jshint evil:true */
                  var attrLengthMenu = eval("[" + lengthMenu + "]");

                  if (typeof (attrLengthMenu[attrLengthMenu.length - 1]) === 'string') {
                     for (var i = 0; i < attrLengthMenu.length - 1; i++) {
                        alLengthMenu.push(attrLengthMenu[i]);
                     }

                     alLengthMenu.push(-1);

                     return [alLengthMenu, attrLengthMenu];
                  }

                  for (var interador = 0; interador < attrLengthMenu.length; interador++) {
                     alLengthMenu.push(attrLengthMenu[interador]);
                  }

                  return [alLengthMenu, alLengthMenu];
               }
            };

            scope.fnGetPageLength = function () {
               if (pageLength) {
                  pageLength = parseInt(pageLength);
                  return isNaN(pageLength) ? scope.fnGetLengthMenu()[0][0] : pageLength;
               }

               return scope.fnGetLengthMenu()[0][0];
            };

            scope.fnCreateGrid = function () {
               $timeout(function () {
                  element.dataTable({
                     "filter": (scope.filter !== false) ? true : false,
                     "destroy": true,
                     'language': {
                        'lengthMenu': 'Exibir _MENU_ itens por página.',
                        'zeroRecords': 'Nenhum registro encontrado.',
                        'info': 'Item _START_ até _END_ de _TOTAL_ Itens',
                        'infoEmpty': '', //Sem resultados
                        'infoFiltered': '(filtrados de _MAX_ itens no total)',
                        'search': '<span title="Busca apenas dados já impresso nesta lista">Busca Rápida:</span>',
                        'searchTitle': 'Busca apenas dados já impresso nesta lista',
                        'paginate': {
                           'first': 'Primeira',
                           'previous': 'Anterior',
                           'next': 'Próxina',
                           'last': 'Última'
                        }
                     },
                     'columns': scope.fnGetColumnsNotOrder(),
                     'lengthMenu': scope.fnGetLengthMenu(),
                     'pageLength': scope.fnGetPageLength()
                  });
                  //$('select', element.closest('.dataTables_wrapper')).width(50).chosen();

                  element.removeAttr('style').fadeIn(0);
                  if (scope.menu === false) {
                     $("#GridView1_length").hide();
                  } else {
                     $("#GridView1_length").show();
                  }

               }, 0);
            };

            scope.fnClearGrid = function () {
               element.fadeOut(0);
               element.fnDestroy();
            };

            if (scope.ngSource) {
               scope.ngSource.clearGrid = scope.fnClearGrid;
            }
            //$watchCollection
            scope.$watch('ngSource', function (newValue, oldValue) {
               if (newValue) {
                  $timeout(function () {
                     newValue.clearGrid = scope.fnClearGrid;
                     scope.fnCreateGrid();
                  }, 0);
               }
            });

            scope.fnCreateGrid();
         }
      };
   }]);

angular.module('api').directive('chosen', [function () {

      var __indexOf = [].indexOf || function (item) {
         for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item)
               return i;
         }
         return -1;
      };

      var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;

      NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
      CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
      snakeCase = function (input) {
         return input.replace(/[A-Z]/g, function ($1) {
            return "_" + ($1.toLowerCase());
         });
      };
      isEmpty = function (value) {
         var key;

         if (angular.isArray(value)) {
            return value.length === 0;
         } else if (angular.isObject(value)) {
            for (key in value) {
               if (value.hasOwnProperty(key)) {
                  return false;
               }
            }
         }
         return true;
      };
      return {
         restrict: 'A',
         require: '?ngModel',
         terminal: true,
         link: function (scope, element, attr, ngModel) {
            var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender, removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch;

            element.addClass('localytics-chosen');
            options = scope.$eval(attr.chosen) || {};
            angular.forEach(attr, function (value, key) {
               if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
                  options[snakeCase(key)] = scope.$eval(value);
                  return options[snakeCase(key)];
               }
            });
            startLoading = function () {
               //return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
               return element.addClass('loading').trigger('chosen:updated');
            };
            stopLoading = function () {
               //return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
               return element.removeClass('loading').trigger('chosen:updated');
            };
            chosen = null;
            defaultText = null;
            empty = false;
            initOrUpdate = function () {
               if (chosen) {
                  return element.trigger('chosen:updated');
               } else {
                  if (!options.no_results_text) {
                     options.no_results_text = 'Sem resultados para:';
                  }
                  chosen = element.chosen(options).data('chosen');
                  defaultText = chosen.default_text;
                  return  defaultText;
               }
            };
            removeEmptyMessage = function () {
               empty = false;
               return element.attr('data-placeholder', defaultText);
            };
            disableWithMessage = function () {
               empty = true;
               //return element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true).trigger('chosen:updated');
               return element.attr('data-placeholder', chosen.results_none_found).trigger('chosen:updated');
            };
            if (ngModel) {
               origRender = ngModel.$render;
               ngModel.$render = function () {
                  origRender();
                  return initOrUpdate();
               };
               if (attr.multiple) {
                  viewWatch = function () {
                     return ngModel.$viewValue;
                  };
                  scope.$watch(viewWatch, ngModel.$render, true);
               }
            } else {
               initOrUpdate();
            }
            attr.$observe('disabled', function () {
               return element.trigger('chosen:updated');
            });

            if (attr.ngOptions && ngModel) {
               match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
               valuesExpr = match[7];
               return scope.$watchCollection(valuesExpr, function (newVal, oldVal) {
                  if (angular.isUndefined(newVal)) {
                     return startLoading();
                  } else {
                     if (empty) {
                        removeEmptyMessage();
                     }
                     stopLoading();
                     if (isEmpty(newVal)) {
                        return disableWithMessage();
                     }
                  }
               });
            }
         }
      };
   }]);

angular.module('api').directive("maskRegex", [function () {
      return {
         restrict: 'A',
         link: function (scope, element, attr) {
            attr.$set("data-inputmask-regex", attr.maskRegex);
            element.inputmask("Regex");
         }
      };
   }]);

angular.module('api').directive("maskInput", [function () {
      return {
         restrict: 'A',
         link: function (scope, element, attr) {
            element.inputmask(attr.maskInput);
         }
      };
   }]);

angular.module('api').directive("maskEmail", [function () {
      return {
         restrict: 'A',
         link: function (scope, element, attr) {
            element.inputmask({
               mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
               greedy: false,
               onBeforePaste: function (pastedValue, opts) {
                  pastedValue = pastedValue.toLowerCase();
                  return pastedValue.replace("mailto:", "");
               },
               definitions: {
                  '*': {
                     validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                     cardinality: 1,
                     casing: "lower"
                  }
               }
            });
         }
      };
   }]);

angular.module('api').directive('datepicker2', [function () {
      return {
         restrict: 'A',
         link: function (scope, element, attr, ngModel) {
            var elementGroup = element.closest('div.input-group.date');
            elementGroup.datepicker({format: "dd/mm/yyyy", language: "pt-BR", autoclose: true, placeholder: null});
         }
      };
   }]);

angular.module('api').directive('ngAutocomplete', ['$injector', function ($injector) {
      var helper = $injector.get('helper');
      return {
         restrict: 'A',
         scope: {
            codigo: "=",
            funcao: "&"
         },
         link: function (scope, element, attrs, model) {
            scope.availableTags = [];

            element.on("blur", function () {
               function ObterId(array, value) {
                  for (var i = 0; i < array.length; i++) {
                     var item = array[i];
                     if (item.descricao.trim().toLowerCase() === value.trim().toLowerCase()) {
                        return item.id;
                     }
                     return 0;
                  }
               }
               scope.codigo = ObterId(scope.availableTags, element.val());
               scope.$watch('funcao', function (newValue, oldValue) {
                  scope.funcao();
               });

            });

            element.on("keyup", function (events, a) {
               if (element.val().length > 2) {
                  var controllerAcao = element.attr("ng-autocomplete");
                  helper.get(controllerAcao, element.val(), function (dados) {
                     if (parseInt(helper.toList(dados)[0].id) > 0) {
                        scope.availableTags = helper.toList(dados);
                     }
                     var source = [];
                     for (var i = 0; i < scope.availableTags.length; i++) {
                        var item = scope.availableTags[i];
                        if (parseInt(item.id) > 0) {
                           source.push(item.descricao);
                        }
                     }
                     element.autocomplete({source: source});
                  });
               }
            });
         }
      };
   }]);

angular.module('api').directive('ngEnter', [function () {
      return {
         restrict: 'A',
         link: function (scope, element, attrs) {
            element.bind("keyup", function (events) {
               if (events.keyCode === 13 || events.which === 13) {
                  scope.$apply(function () {
                     scope.$eval(attrs.ngEnter);
                  });
               }
            });
         }
      };
   }]);

angular.module('api').directive('hbChat', ['$injector', function ($injector) {
      var helper = $injector.get('helper');

      var controlador = function ($scope, helper) {
         $scope.chat = {
            visivel: false,
            minimize: false,
            numAlert: 0,
            collapseOne: 0,
            grupo: true,
            max_row: 0,
            intervalo: 60000,
            auto_refresh: null,
            loading: false,
            src: helper.loadImage("chat-loader.gif"),
            ball_verde: helper.loadImage("ball_green.png"),
            ball_vermelho: helper.loadImage("ball_red.png")
         };

         $scope.chat.minimizar = function () {
            $scope.chat.minimize = true;
            $scope.chat.intervalo = 5000;
            time();
         };

         $scope.chat.fechar = function () {
            $scope.chat.visivel = false;
            $scope.chat.grupo = true;
            $scope.chat.intervalo = 60000;
            time();
         };

         $scope.chat.maximizar = function () {
            $scope.chat.minimize = false;
            $scope.chat.intervalo = 5000;
            time();
         };

         $scope.chat.init = function () {
            $scope.promessa(function () {
               atualizarDados(criarDados());
            });
         };

         function criarDados() {
            return {
               mostar_usuarios: !($scope.chat.dados) && ($scope.chat.visivel && $scope.chat.minimize === false),
               usuario: $scope.user.Id,
               grupo: $scope.chat.grupo,
               amigo: $scope.user.amigo,
               nivel_remetente: $scope.UserNivel(),
               nivel_destinatario: $scope.user.nivel_destinatario,
               max_row: $scope.chat.max_row
            };
         }

         function atualizarDados(dados) {
            if ($scope.UserNivel()) {
               helper.put("Chat/BuscarGrupos", dados, function (dados) {
                  atualizarChat(dados);
               });
            }
         }

         function atualizarChat(retorno) {
            if (retorno.atualizado) {
               $scope.chat.dados = retorno.dados;
            }
            retorno.list = $scope.toList(retorno.list);
            if (retorno.list.length > 0) {
               if (!$scope.chat.list) {
                  $scope.chat.list = [];
               }
               ///////////////Obter o maior ID///////////////////////////                      
               $scope.chat.max_row = retorno.list.reduce(function (prev, cur) {
                  return prev;
               }).id;
               $scope.chat.list = retorno.list;
            }
            if (!$scope.chat.visivel || $scope.chat.minimize) {
               $scope.chat.numAlert = parseInt(retorno.total_alert);
            }

            if (parseInt(retorno.outro_usuario_chamando) > 0) {
               $scope.chat.numAlert = parseInt(retorno.outro_usuario_chamando);
            }
         }

         $scope.chat.abrirChat = function () {
            if ($scope.chat.visivel) {
               $scope.chat.fechar();
               return;
            }
            $scope.chat.visivel = true;
            $scope.chat.numAlert = 0;
            $scope.chat.minimize = false;
            $scope.chat.intervalo = 5000;
            time();
         };

         $scope.chat.verMensagem = function (amigo, nivel_destinatario) {
            $scope.user.amigo = amigo;
            $scope.user.nivel_destinatario = nivel_destinatario;
            $scope.chat.max_row = 0;
            $scope.chat.grupo = false;
            $scope.chat.list = [];
         };

         $scope.chat.historico = function () {
            $scope.chat.loading = true;
            $scope.chat.max_row = 0;
            helper.put("Chat/Historico", criarDados(), function (historico) {
               atualizarChat(historico);
               $scope.chat.loading = false;
            });
         };

         $scope.chat.cadastrar = function () {
            $scope.repositorio = {};
            $scope.repositorio.remetente = $scope.user.Id;
            $scope.repositorio.destinatario = $scope.user.amigo;
            $scope.repositorio.msg = $scope.chat.msg;
            $scope.repositorio.nivel_remetente = $scope.UserNivel();
            $scope.repositorio.nivel_destinatario = $scope.user.nivel_destinatario;

            var p_dados = angular.copy($scope.repositorio);
            $scope.chat.msg = "";
            if (p_dados.msg !== "") {
               helper.put("Chat/Cadastrar", p_dados, function (dados) {
                  $scope.chat.init();
               });
            }
         };

         function time() {
            clearInterval($scope.chat.auto_refresh);
            $scope.chat.auto_refresh = setInterval($scope.chat.init, $scope.chat.intervalo);
         }
         time();
      };

      return {
         replace: true,
         restrict: 'AE',
         //scope: false,
         templateUrl: helper.loadTemplat("chat.html"),
         controller: (['$scope', 'helper', controlador])

      };
   }]);


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



angular.module('app').service('serviceModel', [function () {  // jshint ignore:line 
      return{
         veiculo: function () {
            return angular.copy({
               id: null,
               cliente_id:null,
               marca_modelo: null,
               placa: null,
               ano_fabricacao: null,
               ano_modelo: null,
               chassi: null,
               renavam: null,
               ativo:''
            });
         }                
      };
}]);

//obs-> Todas as permissões e visualização do menu devem ser configuradas aqui.
	
angular.module('app').constant('menuItems', [
          {
            "Nome": "Solicitação", //nome do menu
            "Rota": "#/pedido", //Rota
            "Nivel": [1, 2, 3], //Nivel de Acesso 1-adm; 2-cliente; 3-Estabelecimento
            "Ativo": false, //Deixe como falso
            "Visualizar": true		  // se o menu irá aparecer sim ou não. ou sera usando apenas para mapear uma rota...
          },
          {
            "Nome": "Cliente",
            "Rota": "#/cliente",
            "Nivel": [1, 2],
            "Ativo": false,
            "Visualizar": true
          },
          {
            "Nome": "Estabelecimento",
            "Rota": "#/estabelecimento",
            "Nivel": [1, 3],
            "Ativo": false,
            "Visualizar": true
          },
          {
            "Nome": "Categoria",
            "Rota": "#/categoria",
            "Nivel": [1],
            "Ativo": false,
            "Visualizar": true
          },
          {
            "Nome": "Veículo",
            "Rota": "#/veiculo",
            "Nivel": [1,2],
            "Ativo": false,
            "Visualizar": true
          },
          {
            "Nome": "Relatório",
            "Rota": "#/relatorio",
            "Nivel": [1, 2, 3],
            "Ativo": false,
            "Visualizar": true
          },
          {
            "Nome": "Produto",
            "Nivel": [1, 2, 3],
            "Ativo": false,
            "Visualizar": true,
            "subItem": [{
                "Nome": "Produto",
                "Rota": "#/produto",
                "Nivel": [1, 2, 3],
                "Ativo": false,
                "Visualizar": true
              },
              {
                "Nome": "Sub-Grupo",
                "Rota": "#/sub-grupo",
                "Nivel": [1, 3],
                "Ativo": false,
                "Visualizar": true
              },
              {
                "Nome": "Grupo",
                "Rota": "#/grupo",
                "Nivel": [1, 3],
                "Ativo": false,
                "Visualizar": true
              }]
          },
          //-----Outras permissões que não estão no menu
          {
            "Nome": "Orçamento",
            "Rota": "#/orcamento",
            "Nivel": [1, 2, 3],
            "Ativo": false,
            "Visualizar": false
          },
          {
            "Nome": "Configuração",
            "Rota": "#/master",
            "Nivel": [1],
            "Ativo": false,
            "Visualizar": false // menu não existe
          },
          {
            "Nome": "Configuração",
            "Rota": "#/configuracao",
            "Nivel": [1, 2, 3],
            "Ativo": false,
            "Visualizar": false
          }
        ]);

//Não modificar o comando abaixo
angular.module('app').controller("MenuCtrl", ["$rootScope", "menuItems", "userService", function ($rootScope, menuItems, userService) {
    $rootScope.GetMenus = function () {
      var nivel = parseInt($rootScope.user.Nivel);
      if (nivel < 0)
        return null;

      for (var i = 0; i < menuItems.length; i++) {
        //checando permissoes
        menuItems[i].Ativo = ((menuItems[i].Nivel.indexOf(nivel) > -1) && menuItems[i].Visualizar === true);
        if (menuItems[i].subItem !== undefined) {
          //existe sub menu
          menuItems[i].class = "dropdown-toggle";
          menuItems[i].data = "dropdown";
          menuItems[i].Rota = "?";
		 var sub= menuItems[i].subItem;
		 /* jshint ignore:start */
          angular.forEach(sub, function (subItem) {
            subItem.Ativo = ((subItem.Nivel.indexOf(nivel) > -1) && subItem.Visualizar === true);
          });
		  /* jshint ignore:end */
        }
      }

      return menuItems;
    };
  }]);
//Esta sendo usado em rotas arquivo app
angular.module('app').service('permissao', ['$rootScope', 'menuItems', function ($rootScope, menuItems) {

    return {
      isPermition: function (rota) {

        var nivel = parseInt($rootScope.user.Nivel);
        retorno = false;

        if (nivel < 0)
          return true;

        for (var i = 0; i < menuItems.length; i++) {

          if (menuItems[i].subItem !== undefined) {
            //é um subItem	
			/* jshint ignore:start */			
            angular.forEach(menuItems[i].subItem, function (subItem) {
              var minhaRota = subItem.Rota.replace('#', '');
              var rotaVinda = rota.substr(0, minhaRota.length);
              if (minhaRota === rotaVinda) {
                retorno = (subItem.Nivel.indexOf(nivel) > -1);
                return retorno;
              }
            });
			
				/* jshint ignore:end */		
          } else {
            var minhaRota = menuItems[i].Rota.replace('#', '');
            var rotaVinda = rota.substr(0, minhaRota.length);
            if (minhaRota === rotaVinda) {
              retorno = (menuItems[i].Nivel.indexOf(nivel) > -1);
              return retorno;
            }
          }
        }
        return retorno;
      }
    };
  }]);  
