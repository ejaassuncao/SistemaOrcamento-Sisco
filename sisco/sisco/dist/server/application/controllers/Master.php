<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Master extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaMaster');
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();
    $lista = $this->DaMaster->Listar();
    echo $this->getArrayToJson($lista);
  }

  public function Cadastrar() {
    $this->getPostArray();
    $this->inicializarDA();

    //$this->Validacao();
    $this->ExisteLogin($this->entidade['email']);
    $token = $this->Criptografar($this->entidade['email']);
    $senha = $this->Criptografar($this->entidade['senha']);

    $dados = array('nome' => $this->entidade['nome'],
        'email' => $this->entidade['email'],
        'senha' => $senha,
        'nivel' => 1,
        'token' => $token
    );
    $camposObrigatorios = array(
        'nome' => 'Nome',
        'email' => 'E-mail',
        'nivel' => 'Erro de Regarregamento da Pagina. Precione CTRL+F5 e cadastre novamente.',
        'senha' => 'Senha'
    );
    $this->ValidarCampos($dados, $camposObrigatorios);

    $this->DaMaster->Cadastrar($dados);
    $listar = $this->DaMaster->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Usuário cadastrado com sucesso"));
  }

  public function Editar() {
    $this->getPostArray();
    $this->inicializarDA();
    $token = $this->Criptografar($this->entidade['email']);
    if (!isset($this->entidade['senha'])) {

      $dados = array(
          'id' => $this->entidade['id'],
          'email' => $this->entidade['email'],
          'nome' => $this->entidade['nome'],
          'nivel' => 1,
          'token' => $token
      );
      $camposObrigatorios = array(
          'nome' => 'Nome',
          'email' => 'E-mail',
      );
    } else {
      $senha = $this->Criptografar($this->entidade['senha']);
      $dados = array(
          'id' => $this->entidade['id'],
          'email' => $this->entidade['email'],
          'nome' => $this->entidade['nome'],
          'nivel' => 1,
          'token' => $token,
          'senha' => $senha
      );
      $camposObrigatorios = array(
          'nome' => 'Nome',
          'email' => 'E-mail',
          'senha' => 'Senha'
      );
    }
    
    $this->ValidarCampos($dados, $camposObrigatorios);
    $this->ExisteLogin($this->entidade['email'], $this->entidade['id']);
    $this->DaMaster->Editar($dados);
    $listar = $this->DaMaster->Listar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($listar), null, $this->msgSucesso("Usuário editado com sucesso"));
  }

  public function Validacao() {

    $camposObrigatorios = array(
        'descricao' => 'Descrição',
        'ativo' => 'Situação'
    );
    $this->ValidarCampos($this->entidade, $camposObrigatorios);
  }

  private function ExisteLogin($email = null, $id = null) {
    if ($this->DaUser->ExisteLogin($email, $id)) {
      $this->msgAdvertencia("Este email já existente. Use outro email.");
    }
  }

}
