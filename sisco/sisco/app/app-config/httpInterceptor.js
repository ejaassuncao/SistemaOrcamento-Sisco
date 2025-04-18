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