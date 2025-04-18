<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class SubGrupo extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaSubGrupo');
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

    return '{
              "categoria":' . $jsonCategoria . ',
              "grupo":[]										
            }';
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();
    $lista = $this->DaSubGrupo->Listar();
    $lovGrupo = $this->CarregaLovs();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($lista), $lovGrupo, null);
  }

  public function BuscarPorGrupo($id) {
    $this->inicializarDA();
    $lista = $this->DaSubGrupo->BuscarPorGrupo($id);
    echo $this->getArrayToJson($lista);
  }

  public function Cadastrar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaSubGrupo->Cadastrar($this->entidade);
    $listar = $this->DaSubGrupo->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Sub-Grupo Cadastrada com sucesso"));
  }

  public function Editar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaSubGrupo->Editar($this->entidade);
    $listar = $this->DaSubGrupo->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Sub-Grupo editada com sucesso"));
  }

  public function Validacao() {
    $camposObrigatorios = array(
        'categoria_id' => 'Categoria',
        'grupo_id' => 'Grupo',
        'descricao' => 'Descrição'
    );

    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }

}
