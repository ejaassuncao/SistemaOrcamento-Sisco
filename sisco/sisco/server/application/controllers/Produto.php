<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Produto extends CI_Controller {

  private function inicializarDA() {
    $this->load->model('DaProduto');
  }

  private function CarregaLovs($estabelecimentoId) {
    $this->load->model('DaCategoria');
    $this->load->model('DaEstabelecimento');

    $sessao = $this->sessaoBuscar();
    $jsonCategoria = null;
    if ($sessao ['nivel'] == 3) { //Estabelecimento
      $estabelecimentoId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      $this->load->model('DaEstabelecimento');
      $categoriaDoEstabelecimento = $this->DaEstabelecimento->BuscarPorId($estabelecimentoId, 'categoria_id');
      $jsonCategoria = $this->getArrayToJson($this->DaCategoria->BuscarPorId($categoriaDoEstabelecimento['categoria_id']));
    } else {
      $jsonCategoria = $this->getArrayToJson($this->DaCategoria->Buscar());
    }

    $jsonEstabelecimento = $this->getArrayToJson($this->DaEstabelecimento->BuscarPorId($estabelecimentoId, 'id,nome_fantasia texto'));
    return '{
              "categoria":' . $jsonCategoria . ',
              "grupo":[],
              "sub_grupo":[],
              "estabelecimento":' . $jsonEstabelecimento . '
	    }';
  }

  public function Buscar() {
    $this->getPostArray();
    $this->inicializarDA();
    $produto = $this->DaProduto->Buscar($this->entidade['produto_id']);
    $produto['produto_preco'] = $this->DaProduto->BuscarPreco($this->entidade['produto_id'], $this->entidade['estabelecimento_id']);
    $lovGrupo = $this->CarregaLovs($this->entidade['estabelecimento_id']);
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($produto), $lovGrupo, null);
  }

  public function BuscarPorDescricao($descricao) {
    $this->inicializarDA();
    $sessao = $this->sessaoBuscar();
    $produto = null;
    if ($sessao ['nivel'] == 3) { //Estabelecimento
      $estabelecimentoId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      $this->load->model('DaEstabelecimento');
      $categoriaDoEstabelecimento = $this->DaEstabelecimento->BuscarPorId($estabelecimentoId ['id'], 'categoria_id');
      $produto = $this->DaProduto->BuscarPorDescricao($descricao, $categoriaDoEstabelecimento['categoria_id']);
    } else {
      $produto = $this->DaProduto->BuscarPorDescricao($descricao);
    }

    echo $this->getArrayToJson($produto);
  }

  public function Cadastrar() {
    try {
      $this->getPostArray();
      $this->inicializarDA();
      $this->Validacao();

      $this->db->trans_start();

      $produto_preco = $this->entidade['produto_preco'];
      $produto = $this->RemoveElementArray($this->entidade, 'produto_preco');

      //Valida permiss�es
      $sessao = $this->sessaoBuscar();
      if ($sessao ['nivel'] == 1 && !$produto_preco ['estabelecimento_id'] > 0) {
        echo $this->msgAdvertencia("Este usuário é uma adminstrador selecione um estabelecimento.");
        return;
      }
      if (!$produto_preco ['estabelecimento_id'] > 0) {
        $produto_preco['estabelecimento_id'] = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      }

      $produto = $this->DaProduto->Cadastrar($produto);

      //Cadastrar preço do produto...
      $produto_preco['produto_id'] = $produto['id'];

      //Formata data para o formato americano
      $produto_preco['data_fabricacao'] = formatar_data($produto_preco['data_fabricacao'], 1);

      $produto_preco = $this->DaProduto->CadastrarPreco($produto_preco);

      $produto['produto_preco'] = $produto_preco;

      $this->db->trans_complete();

      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($produto), null, $this->msgSucesso("Produto Cadastrado com sucesso"));
    } catch (Exception $exc) {
      $this->db->trans_rollback();
      show_error($exc);
    }
  }

  public function Editar() {

    try {
      $this->getPostArray();
      $this->inicializarDA();
      $this->Validacao();

      $this->db->trans_start();

      $produto_preco = $this->entidade['produto_preco'];
      $produto = $this->RemoveElementArray($this->entidade, 'produto_preco');
      //Formata data para o formato americano
      $produto_preco['data_fabricacao'] = formatar_data($produto_preco['data_fabricacao'], 1);


      $sessao = $this->sessaoBuscar();
      if ($sessao ['nivel'] == 1 && !$produto_preco ['estabelecimento_id'] > 0) {
        echo $this->msgAdvertencia("Este usuário é uma adminstrador selecione um estabelecimento.");
        return;
      }
      if (!$produto_preco ['estabelecimento_id'] > 0) {
        $produto_preco['estabelecimento_id'] = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      }

      //Verifica se existe o produto para o estabelecimento
      //se n�o existir Insere
      //Caso contrario altera
      if ($this->DaProduto->ExiteProdutoParaEstabelecimento($produto['id'], $produto_preco['estabelecimento_id'])) {
        $this->DaProduto->Editar($produto);
        $this->DaProduto->EditarPreco($produto_preco);
      } else {
        $produto_preco['produto_id'] = $produto['id'];
        $produto_preco = $this->DaProduto->CadastrarPreco($produto_preco);
      }


      $this->db->trans_complete();
    } catch (Exception $exc) {
      $this->db->trans_rollback();
      show_error($exc);
    }

    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($produto), null, $this->msgSucesso("Produto editado com sucesso"));
  }

  public function Listar() {
    $this->inicializarDA();
    $this->getPostArray();

    $sessao = $this->sessaoBuscar();
    $estabelecimentoId = 0;
    if ($sessao ['nivel'] == 3) { //Estabelecimento
      $estabelecimentoId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
    }

    $retorno = $this->DaProduto->Listar($this->entidade, $estabelecimentoId);
    echo $this->getArrayToJson($retorno);
  }

  public function Validacao() {
    $camposObrigatorios = array(
        'categoria_id' => 'Categoria',
        'grupo_id' => 'Grupo',
        'descricao' => 'Nome Produto',
        'modelo' => 'Modelo'
    );
    $this->ValidarCampos($this->entidade, $camposObrigatorios);
    $camposObrigatorios = array(
        'preco_unitario' => 'Preço unitário'
    );
    $this->ValidarCampos($this->entidade['produto_preco'], $camposObrigatorios);
  }

}
