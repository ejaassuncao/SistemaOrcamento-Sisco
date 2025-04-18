/* global angular */
"use strict";
   
var api = angular.module('api', ['toaster', 'ui.bootstrap','angularFileUpload']);

api.config(function () {
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
});

api.service('helper', ['$http', 'toaster', '$location', '$timeout', '$rootScope', function ($http, toaster, $location, $timeout, $rootScope) {
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
            if (time === '' || time === null
                    || time === undefined) {
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
            return $location.absUrl().substr(0, $location.absUrl().indexOf("#"))+ "img/"+nomeImg;
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

api.directive("visualizarRelatorio", ["$injector", function ($injector) {
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

api.directive("visualizarRelatorio", ["$injector", function ($injector) {
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

api.service("upload", ['$injector', '$timeout', '$modal', 'FileUploader',function ($injector, $timeout, $modal,FileUploader) {
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
               autoClose:param.autoClose
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
               controller: function ($scope, $modalInstance, parametro, FileUploader, helper) {               
                  var localUrl = helper.serverUrl(parametro.server);
                  $scope.view = {
                     title: "Anexar arquivos",
                     limiteArquivos: parametro.limiteArquivos,
                     dropZone: parametro.dropZone,
                     formData: parametro.formData,
                     fileAdd: parametro.fileAdd,
                     autoClose:parametro.autoClose
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
                     if ( $scope.view.fileAdd !== null && $scope.view.fileAdd !== undefined) {
                        $scope.view.fileAdd(fileItem);
                     }
                  };
                  uploader.onSuccessItem = function (fileItem, response, status, headers) {                     
                     if (parametro.callback) {
                         parametro.callback(response);
                     }
                     if($scope.view.autoClose){
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
               } //FIM CONTROLLER
            }); //FIM MODAL				
         } // fim do metodo open
      }; //FIM RETURN
}]);

api.directive("loading", ['$injector', '$timeout', function ($injector, $timeout) {
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

api.directive('jcarouselFancybox', ['$injector', '$timeout', function ($injector, $timeout) {
      var helper = $injector.get('helper');
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

            var carregarFanckBox = function (img) {
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
         controller: function ($scope, helper, $timeout) {
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
         }
      };
   }]);

api.directive('select2', ['$timeout', 'helper', '$compile', function ($timeout, helper, $compile) {
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

api.directive('datatable', ['$timeout', function ($timeout) {

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

               for (var i = 0; i < columnsHead.length - 1; i++) {
                  alItensNotOrder.push(null);
               }
               alItensNotOrder.push({"orderable": false});

               return alItensNotOrder;
            };

            scope.fnGetLengthMenu = function () {
               var alLengthMenu = [];

               if (lengthMenu) {
                  var attrLengthMenu = eval("[" + lengthMenu + "]");
                  if (typeof (attrLengthMenu[attrLengthMenu.length - 1]) === 'string') {
                     for (var i = 0; i < attrLengthMenu.length - 1; i++) {
                        alLengthMenu.push(attrLengthMenu[i]);
                     }

                     alLengthMenu.push(-1);

                     return [alLengthMenu, attrLengthMenu];
                  }

                  for (var i = 0; i < attrLengthMenu.length; i++) {
                     alLengthMenu.push(attrLengthMenu[i]);
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

api.directive('chosen', function () {

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
               return options[snakeCase(key)] = scope.$eval(value);
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
               return defaultText = chosen.default_text;
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
});

api.directive("maskRegex", function () {
   return {
      restrict: 'A',
      link: function (scope, element, attr) {
         attr.$set("data-inputmask-regex", attr.maskRegex);
         element.inputmask("Regex");
      }
   };
});

api.directive("maskInput", function () {
   return {
      restrict: 'A',
      link: function (scope, element, attr) {
         element.inputmask(attr.maskInput);
      }
   };
});

api.directive("hbChat", function ($injector) {
   var helper = $injector.get('helper');
   return {
      replace: true,
      restrict: 'AE',
      scope: false,
      templateUrl:helper.loadTemplat("chat.html"), 
      controller: function ($scope, helper) {
         $scope.chat = {
            visivel: false,
            minimize: false,
            numAlert: 0,
            collapseOne: 0,
            grupo: true,
            max_row:0,
            intervalo:60000,
            auto_refresh :null,
            loading:false,
            src: helper.loadImage("chat-loader.gif"),
            ball_verde:helper.loadImage("ball_green.png"),
            ball_vermelho:helper.loadImage("ball_red.png")
         };

         $scope.chat.minimizar = function () {
            $scope.chat.minimize = true;
            $scope.chat.intervalo=5000;
            time(); 
         };
         
         $scope.chat.fechar = function () {
            $scope.chat.visivel = false;
            $scope.chat.grupo = true;
            $scope.chat.intervalo=60000;
            time(); 
         };
         
         $scope.chat.maximizar = function () {
            $scope.chat.minimize = false;
            $scope.chat.intervalo=5000;
            time(); 
         }; 
         
         $scope.chat.init = function () {
           $scope.promessa(function () {                            
               atualizarDados(criarDados());
            });
         };
         
         function criarDados(){
            return {
                  mostar_usuarios: !($scope.chat.dados) && ($scope.chat.visivel && $scope.chat.minimize == false),                 
                  usuario: $scope.user.Id,
                  grupo: $scope.chat.grupo,
                  amigo:$scope.user.amigo,
                  nivel_remetente: $scope.UserNivel(),
                  nivel_destinatario:$scope.user.nivel_destinatario,
                  max_row:$scope.chat.max_row
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
            if(retorno.list.length>0){
               if(!$scope.chat.list){
                  $scope.chat.list=[];
               }
               ///////////////Obter o maior ID///////////////////////////                      
               $scope.chat.max_row=retorno.list.reduce(function(prev, cur){ 
                   return prev;
               }).id;
               $scope.chat.list = retorno.list;
            }            
            if (!$scope.chat.visivel || $scope.chat.minimize) {
               $scope.chat.numAlert = parseInt(retorno.total_alert);
            }
            
            if(parseInt(retorno.outro_usuario_chamando) > 0 ){
               $scope.chat.numAlert = parseInt(retorno.outro_usuario_chamando);
            }
         }

         $scope.chat.abrirChat = function () {
            if($scope.chat.visivel){
                $scope.chat.fechar();               
                return;
            }            
            $scope.chat.visivel = true;
            $scope.chat.numAlert = 0;
            $scope.chat.minimize = false;            
            $scope.chat.intervalo=5000;
            time(); 
         };

         $scope.chat.verMensagem = function (amigo,nivel_destinatario) {          
            $scope.user.amigo = amigo;
            $scope.user.nivel_destinatario=nivel_destinatario;
            $scope.chat.max_row = 0;
            $scope.chat.grupo = false;  
            $scope.chat.list=[];
         };

         $scope.chat.historico = function () { 
            $scope.chat.loading= true;
            $scope.chat.max_row=0;            
            helper.put("Chat/Historico", criarDados(), function (historico) {
               atualizarChat(historico);
               $scope.chat.loading=false;
            });
         };  
            
         $scope.chat.cadastrar = function () {   
            $scope.repositorio={};  
            $scope.repositorio.remetente = $scope.user.Id;
            $scope.repositorio.destinatario = $scope.user.amigo;
            $scope.repositorio.msg = $scope.chat.msg;
            $scope.repositorio.nivel_remetente= $scope.UserNivel();
            $scope.repositorio.nivel_destinatario=$scope.user.nivel_destinatario;
                        
            var p_dados = angular.copy($scope.repositorio);            
            $scope.chat.msg = "";
            if (p_dados.msg !== "") {
               helper.put("Chat/Cadastrar", p_dados, function (dados){
                   $scope.chat.init();
               });
            }
         };  
                 
         function time(){
           clearInterval($scope.chat.auto_refresh);   
           $scope.chat.auto_refresh = setInterval($scope.chat.init,$scope.chat.intervalo);                       
         }       
         time();              
      }
   };
});

api.directive("maskEmail", function () {
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
});

api.directive('datepicker2', function () {
   return {
      restrict: 'A',
      link: function (scope, element, attr, ngModel) {
         var elementGroup = element.closest('div.input-group.date');
         elementGroup.datepicker({format: "dd/mm/yyyy", language: "pt-BR", autoclose: true, placeholder: null});
      }
   };
});

api.directive('ngAutocomplete', function ($injector) {
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
            ;

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
});

api.directive('ngEnter', function () {
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
});

