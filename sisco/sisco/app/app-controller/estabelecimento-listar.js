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
