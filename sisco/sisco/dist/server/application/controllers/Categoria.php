<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Categoria extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaCategoria');
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();
    $lista = $this->DaCategoria->Listar();
    echo $this->getArrayToJson($lista);
  }

  public function Cadastrar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaCategoria->Cadastrar($this->entidade);
    $listar = $this->DaCategoria->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Categoria Cadastrada com sucesso"));
  }

  public function Editar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaCategoria->Editar($this->entidade);
    $listar = $this->DaCategoria->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Categoria editada com sucesso"));
  }

  public function Validacao() {
    $camposObrigatorios = array(
        'descricao' => 'Descrição',
        'ativo' => 'Situação'
    );
    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }

}
