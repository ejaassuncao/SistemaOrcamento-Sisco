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
