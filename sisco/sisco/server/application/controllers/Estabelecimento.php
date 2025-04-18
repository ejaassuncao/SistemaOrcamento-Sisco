<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Estabelecimento extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaEstabelecimento');
  }

  private function CarregaLovs($id) {
    $this->load->model('DaUf');
    $this->load->model('DaSituacao');
    $this->load->model('DaCategoria');

    $jsonSituacao = $this->getArrayToJson($this->DaSituacao->Buscar(1));
    $jsonCategoria = $this->getArrayToJson($this->DaCategoria->Buscar());
    $jsonUf = $this->getArrayToJson($this->DaUf->Buscar());

    $jsonUsuario = $this->getArrayToJson($this->DaUser->BuscarUsuarioDaTabela('estabelecimento', $id));

    return '{
              "situacao":' . $jsonSituacao . ',
              "categoria":' . $jsonCategoria . ',
              "uf":' . $jsonUf . ',
              "cidade":[],
              "usuario":' . $jsonUsuario . '
            }';
  }

  public function Buscar($id = 0) {

    $this->inicializarDA();
    $lovs = $this->CarregaLovs($id);
    $entidade = $this->DaEstabelecimento->BuscarPorId($id);
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($entidade), $lovs);
  }

  public function BuscarPorNome() {
    $this->inicializarDA();
    $this->getPostArray();
    $lov = $this->DaEstabelecimento->BuscarPorNome($this->entidade);
    echo $this->MontarObjetoRetornoJson(null, $this->getArrayToJson($lov));
  }

  public function Cadastrar() {
    $this->getPostArray();

    $this->Validacao();

    $this->inicializarDA();

    $entidade = $this->DaEstabelecimento->Cadastrar($this->entidade);

    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($entidade), null, $this->msgSucesso("Estabelecimento cadastrado com sucesso"));
  }

  public function Editar() {

    $this->getPostArray();

    $this->inicializarDA();

    $this->Validacao();

    $this->DaEstabelecimento->Editar($this->entidade);

    echo $this->msgSucesso("Estabelecimento editado com sucesso");
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();
    $lista = $this->DaEstabelecimento->Listar($this->entidade, $this->BuscarIdDonoDoUsuario());
    echo $this->getArrayToJson($lista);
  }

  private function Validacao() {

    $camposObrigatorios = array(
        'pessoa' => 'Pessoa',
        'nome_fantasia' => 'Nome Fantasia',
        'telefone' => 'Telefone',
        'situacao_id' => 'Situação',
        'categoria_id' => 'Categoria',
        'uf_id' => 'UF',
        'cidade_id' => 'Cidade'
    );

    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }

}
