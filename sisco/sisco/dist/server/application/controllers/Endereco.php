<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Endereco extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaCidade');
  }

  public function Cidade($id = 0) {

    $this->inicializarDA();

    $array = $this->DaCidade->BuscarPorIdUF($id);

    echo $this->getArrayToJson($array);
  }

}
