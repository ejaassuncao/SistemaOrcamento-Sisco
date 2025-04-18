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
