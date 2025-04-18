<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');

class Veiculo extends CI_Controller {

   private function inicializarDA() {
      $this->load->model('DaVeiculo');
   }

   private function CarregaLovs($cliente_id = 0) {
      $this->load->model('DaCliente');
      $jsonCliente = $this->getArrayToJson($this->DaCliente->BuscarPorId($cliente_id, 'id,nome_fantasia texto'));
      return '{             
                "cliente":' . $jsonCliente . '
              }';
   }
   
   public function Buscar($id = 0) {
      $this->InicializarDA();
      $this->entidade = $this->DaVeiculo->BuscarPorId($id);
      $lovs = $this->CarregaLovs($this->entidade['cliente_id']);
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs);
   }
   
    public function BuscarPorPlaca($placa=NULL) {
      $this->load->model('DaVeiculo');
      echo $this->getArrayToJson($this->DaVeiculo->BuscarPorPlaca($placa));
   }

   public function Listar() {
      $this->inicializarDA();
      $this->getPostArray();

      $sessao = $this->sessaoBuscar();
      $clienteId = null;
      if ($sessao ['nivel'] == 2) {
         $clienteId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'cliente');
      }      
      $lista = $this->DaVeiculo->Listar($this->entidade, $clienteId);
      echo $this->getArrayToJson($lista);
   }

   public function Cadastrar() {
      $this->getPostArray();
      $this->inicializarDA();
      $this->Validacao();
      $this->DaVeiculo->Cadastrar($this->entidade);
      $listar = $this->DaVeiculo->Listar();
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Veículo Cadastrada com sucesso"));
   }

   public function Editar() {
      $this->getPostArray();
      $this->inicializarDA();
      $this->Validacao();
      $this->DaVeiculo->Editar($this->entidade);
      $listar = $this->DaVeiculo->Listar();
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Veículo editada com sucesso"));
   }

   public function Validacao() {

      $camposObrigatorios = array(
          'placa' => 'Placa',
          'marca_modelo' => 'Marca/Modelo',
          'ano_fabricacao' => 'Ano Fabricação',
          'ano_modelo' => 'Ano Modelo',
          'ativo' => 'Situação',
      );

      $this->ValidarCampos($this->entidade, $camposObrigatorios);

      //Valida permissões
      $sessao = $this->sessaoBuscar();
      if ($sessao ['nivel'] == 1 && !$this->entidade['cliente_id'] > 0) {
         echo $this->msgAdvertencia("Este usuário é uma adminstrador selecione um cliente.");
         return;
      }
      if (!$this->entidade['cliente_id'] > 0) {
         $this->entidade['cliente_id'] = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'cliente');
      }
   }

}
