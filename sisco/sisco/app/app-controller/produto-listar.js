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
