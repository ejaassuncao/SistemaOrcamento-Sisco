<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Configuracao extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaConfiguracao');
    $this->load->library('mupload', array('../media' , 120, 80));
  }

  public function Buscar() {
    $this->inicializarDA();
    $lista = $this->DaConfiguracao->Buscar();
    $sessao = $this->sessaoBuscar();
    $destino = $this->mupload->getDestino($sessao['id'] + "_Master");
    $imagem = $this->mupload->buscar($sessao['id'] + "_Master");
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($lista), $this->getArrayToJson($imagem));
  }

  public function Cadastrar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaConfiguracao->Cadastrar($this->entidade);
    $this->DaConfiguracao->Buscar();
    echo $this->msgSucesso("Configuração Cadastrada com sucesso");
  }

  public function Editar() {
    $this->getPostArray();
    $this->inicializarDA();
    $this->Validacao();
    $this->DaConfiguracao->Editar($this->entidade);
    $listar = $this->DaConfiguracao->Buscar();
    echo $this->msgSucesso("Configuração Editada com sucesso");
  }

  public function Upload() {
    $this->InicializarDA();
    $this->getPostArray(true);

    if (!$this->mupload->ehImagem($this->mupload->getExtensao($this->entidade))) {
      return show_error('[{"Mensagem": "' . utf8_encode("Somente imagens são permitidas.") . '","Tipo":"3"}]', 404);
    }
    
    $grupo =$this->entidade['param'] + "_Master";    
      
    $this->mupload->excluirGrupo($grupo);
       
    $arquivo = $this->mupload->salvar($this->entidade,$grupo, $grupo);

    echo $this->getArrayToJson($arquivo);
  }

  public function Validacao() {
    $camposObrigatorios = array(
        'empresa' => 'Empresa',
        'smtp_host' => 'Host',
        'smtp_user' => 'Usuário',
        'smtp_pass' => 'Senha',
        'smtp_port' => 'Porta',
        'smtp_timeout' => 'Tempo de expiração',
        'myhost' => 'Licença'
    );
    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }

}
