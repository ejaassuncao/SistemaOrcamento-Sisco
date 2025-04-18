<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');

class Pedido extends CI_Controller {

   private function InicializarDA() {
      $this->load->model('DaPedido');
      $this->load->model('DaOrcamento');
   }

   private function CarregaLovs($id, $cliente_id = 0) {
      $this->load->model('DaSituacao');
      $this->load->model('DaCategoria');
      $this->load->model('DaCliente');

      $jsonSituacao = $this->getArrayToJson($this->DaSituacao->Buscar(3));
      $jsonCategoria = $this->getArrayToJson($this->DaCategoria->Buscar());
      $jsonItemPedido = $this->getArrayToJson($this->DaPedido->BuscarItem($id, 1));
      $jsonCliente = $this->getArrayToJson($this->DaCliente->BuscarPorId($cliente_id, 'id,nome_fantasia texto'));

      return '{
              "situacao":' . $jsonSituacao . ',					
              "categoria":' . $jsonCategoria . ',
              "cliente":' . $jsonCliente . ',
              "item":' . $jsonItemPedido . '
            }';
   }

   public function Buscar($id = 0) {
      $this->InicializarDA();
      $this->entidade = $this->DaPedido->BuscarPorId($id);
      $lovs = $this->CarregaLovs($id, $this->entidade['cliente_id']);
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs);
   }

   public function CarregarLovListar() {
      $this->load->model('DaSituacao');
      $this->load->model('DaCategoria');

      $jsonSituacao = $this->getArrayToJson($this->DaSituacao->Buscar(3));
      $jsonCategoria = $this->getArrayToJson($this->DaCategoria->Buscar());

      echo '{   "situacao":' . $jsonSituacao . ',					
              "categoria":' . $jsonCategoria . '             
          }';
   }

   public function Cadastrar() {
      $this->getPostArray();
      $this->Validacao();
      $this->InicializarDA();

      $this->db->trans_start();

      $dados = $this->entidade ['dados'];
      $item = $this->entidade ['item'];

      $sessao = $this->sessaoBuscar();

      if ($sessao ['nivel'] == 1 && !$dados ['cliente_id'] > 0) {
         echo $this->msgAdvertencia("Este usuário é uma adminstrador selecione um cliente...");
         return;
      }

      if (!$dados ['cliente_id'] > 0) {
         $clienteId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'cliente');
         $dados ['cliente_id'] = $clienteId;
      }

      $retorno = $this->DaPedido->Cadastrar($dados);
      $retorno ['cliente_id'] = $dados ['cliente_id'];

      if ($dados['servico'] != 1) {
         $this->DaPedido->CadastrarItem($retorno ['id'], $item);
      }

      $this->db->trans_complete();

      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($retorno), null, $this->msgSucesso("Pedido cadastrado com sucesso."));
   }

   public function Editar() {
      $this->getPostArray();
      $this->Validacao();
      $this->InicializarDA();

      $this->db->trans_start();

      $dados = $this->entidade ['dados'];
      $item = $this->entidade ['item'];

      $sessao = $this->sessaoBuscar();

      if ($sessao ['nivel'] == 1 && !$dados ['cliente_id'] > 0) {
         echo $this->msgAdvertencia("Este usuário é uma adminstrador. Selecione um cliente...");
         return;
      }

      if (!$dados ['cliente_id'] > 0) {
         $clienteId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'cliente');
         $dados ['cliente_id'] = $clienteId;
      }

      $this->DaPedido->Editar($dados);

      if ($dados['servico'] != 1) {
         $this->DaPedido->ExcluirItem($dados ['id']);
         $this->DaPedido->CadastrarItem($dados ['id'], $item);
      }

      $this->db->trans_complete();

      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($dados), null, $this->msgSucesso("Pedidos editados com sucesso."));
   }

   // vou deprecisar esse metodo
   public function MudarSituacaoPedido() {
      //enviar
      $this->getPostArray();
      $this->InicializarDA();
      $this->DaPedido->AlterarSituacao($this->entidade ['id'], $this->entidade ['situacao_id']);
      $lovs = $this->CarregaLovs($this->entidade ['id']);
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs, $this->msgAviso("Seu pedido foi envido a todos os fornecedores. Você não poderá mas alterar o pedido, apenas cancelar."));
   }

   // vou deprecisar esse metodo
   public function Cancelar() {
      $this->getPostArray();
      $this->InicializarDA();
      $this->DaPedido->AlterarSituacao($this->entidade ['id'], $this->entidade ['situacao_id']);
      $this->DaOrcamento->AlterarSituacaoPeloPedido($this->entidade ['id'], $this->entidade ['situacao_id']);

      $lovs = $this->CarregaLovs($this->entidade ['id']);
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs, $this->msgAviso("Seu pedido foi cancelado. Não poderá ser mais editado."));
   }

   // ***Para Alterar Situaoes
   public function AlterarSituacao() {
      $this->getPostArray();
      $this->InicializarDA();
      $this->DaPedido->AlterarSituacao($this->entidade ['id'], $this->entidade ['situacao_id']);
      $this->DaOrcamento->AlterarSituacaoPeloPedido($this->entidade ['id'], $this->entidade ['situacao_id']);

      $msg = $this->CriarMensagem($this->entidade ['situacao_id']);
      $this->entidade = $this->initListar(null, $this->entidade ['id']);
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), null, $this->msgAviso($msg));
   }

   public function BuscaAvancada() {
      $this->inicializarDA();
      $this->getPostArray();
      $retorno = $this->initListar($this->entidade,null,true);
      echo $this->getArrayToJson($retorno);
   }

   public function Listar() {
      $this->inicializarDA();
      $this->getPostArray();

      if ($this->entidade['pedido_id'] > 0) {
         $retorno = $this->initListar(null, $this->entidade['pedido_id']);
      } else {
         $retorno = $this->initListar($this->entidade);
      }
      echo $this->getArrayToJson($retorno);
   }

   private function InitListar($filtro = null, $id = null, $avancado = false) {

      $sessao = $this->sessaoBuscar();
      $codigo = $this->BuscarIdDonoDoUsuario();
      $estalecimentoSessao = 0;

      if ($sessao ['nivel'] == 3) {
         $this->load->model('DaEstabelecimento');
         $codigo = $this->DaEstabelecimento->BuscarPorId($codigo, 'categoria_id');
         $codigo = $codigo['categoria_id'];
         $estalecimentoSessao = $this->BuscarIdDonoDoUsuario();
      }
      return ($avancado) ? $this->DaPedido->ListarAvancado($filtro, $codigo, $id, $sessao ['nivel'], $estalecimentoSessao) : $this->DaPedido->Listar($filtro, $codigo, $id, $sessao ['nivel'], $estalecimentoSessao);
   }

   private function CriarMensagem($situacao) {
      switch ($situacao) {
         case 3 : // Enviado
            return "Seu pedido foi envido a todos os fornecedores. Você não poderá mas alterar o pedido, apenas cancelar.";
            break;
         case 4 : // Cancelar
            return "Seu pedido foi cancelado. Não poderá ser mais editado.";
            break;
      }
   }

   private function Validacao() {
      $camposObrigatorios = array(
          'categoria_id' => 'Categoria',
          'servico' => 'Selecione o tipo do Orçamento',
          'observacao' => 'Descrição',
          'situacao_id' => 'Situacao',
          'marca_modelo' => 'Marca/Modelo',
          'placa' => 'Placa',
          'ano_fabricacao' => 'Ano Fabricação',
          'ano_modelo' => 'Ano Modelo'
      );

      $this->ValidarCampos($this->entidade ['dados'], $camposObrigatorios);


      $dados = $this->entidade ['dados'];

      if ($dados['servico'] != 1) {
         if ($this->isNullOrEmpty($this->entidade ['item'])) {
            $this->msgAdvertencia("Insira ao menos 1 item.");
         }
      }
   }

}
