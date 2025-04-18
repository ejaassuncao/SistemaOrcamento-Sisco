<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Cliente extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaCliente');  
  }

  private function CarregaLovs($id) {
    $this->load->model('DaUf');
    $this->load->model('DaSituacao');

    $jsonSituacao = $this->getArrayToJson($this->DaSituacao->Buscar(1));
    $jsonUf = $this->getArrayToJson($this->DaUf->Buscar());
    $jsonUsuario = $this->getArrayToJson($this->DaUser->BuscarUsuarioDaTabela('cliente', $id));

    return '{
					"situacao":' . $jsonSituacao . ',					
					"uf":' . $jsonUf . ',
					"cidade":[],
					"usuario":' . $jsonUsuario . '
			    }';
  }

  public function BuscarPorNome() {

    $this->inicializarDA();
    $this->getPostArray();
    $lov = $this->DaCliente->BuscarPorNome($this->entidade);
    echo $this->MontarObjetoRetornoJson(null, $this->getArrayToJson($lov));
  }

  public function Buscar($id = 0) {

    $this->inicializarDA();
    $lovs = $this->CarregaLovs($id);
    $entidade = $this->DaCliente->BuscarPorId($id);
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($entidade), $lovs);
  }

  public function Cadastrar() {
    $this->getPostArray();

    $this->Validacao();

    $this->inicializarDA();

    $entidade = $this->DaCliente->Cadastrar($this->entidade);

    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($entidade), null, $this->msgSucesso("Cliente cadastrado com sucesso"));
  }

  public function Editar() {

    $this->getPostArray();

    $this->inicializarDA();

    $this->Validacao();

    $this->DaCliente->Editar($this->entidade);

    echo $this->msgSucesso("Cliente Editado com sucesso");
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();
    $lista = $this->DaCliente->Listar($this->entidade, $this->BuscarIdDonoDoUsuario());
    echo $this->getArrayToJson($lista);
  }

  private function Validacao() {

    $camposObrigatorios = array(
        'pessoa' => 'Pessoa',
        'nome_fantasia' => 'Nome Fantasia',
        'telefone' => 'Telefone',
        'situacao_id' => 'Situação',
        'uf_id' => 'UF',
        'cidade_id' => 'Cidade'
    );

    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }
  
}
