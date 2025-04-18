<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Home extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaPedido');
    $this->load->model('DaEstabelecimento');
  }

  public function Listar() {
    $this->inicializarDA();

    $sessao = $this->sessaoBuscar();
    $codigo = $this->BuscarIdDonoDoUsuario();

    if ($sessao ['nivel'] == 3) {
      $codigo = $this->DaEstabelecimento->BuscarPorId($codigo, 'categoria_id');
      $codigo = $codigo['categoria_id'];
    }

    $lista = $this->DaPedido->ListarCincoUltimosPedidos($sessao['nivel'], $codigo);

    echo $this->getArrayToJson($lista);
  }

}
