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
