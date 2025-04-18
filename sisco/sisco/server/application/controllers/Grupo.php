<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Grupo extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaGrupo');
  }

  private function CarregaLovs() {
    $this->load->model('DaCategoria');
    $this->load->model('DaEstabelecimento');

    $sessao = $this->sessaoBuscar();
    $jsonCategoria = null;
    if ($sessao ['nivel'] == 3) { //Estabelecimento
      $estabelecimentoId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      $this->load->model('DaEstabelecimento');
      $categoriaDoEstabelecimento = $this->DaEstabelecimento->BuscarPorId($estabelecimentoId ['id'], 'categoria_id');
      $jsonCategoria = $this->getArrayToJson($this->DaCategoria->BuscarPorId($categoriaDoEstabelecimento['categoria_id']));
    } else {
      $jsonCategoria = $this->getArrayToJson($this->DaCategoria->Buscar());
    }

    return $jsonCategoria;
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();
    $lista = $this->DaGrupo->Listar();
    $lov = $this->CarregaLovs();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($lista), $lov, null);
  }

  public function BuscarPorCategoria($id) {
    $this->inicializarDA();
    $lista = $this->DaGrupo->BuscarGrupoPorCategoria($id);
    echo $this->getArrayToJson($lista);
  }

  public function Cadastrar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaGrupo->Cadastrar($this->entidade);
    $listar = $this->DaGrupo->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Grupo Cadastrada com sucesso"));
  }

  public function Editar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaGrupo->Editar($this->entidade);
    $listar = $this->DaGrupo->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Grupo editado com sucesso"));
  }

  public function Validacao() {
    $camposObrigatorios = array(
        'descricao' => 'Descrição'
    );
    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }

}
