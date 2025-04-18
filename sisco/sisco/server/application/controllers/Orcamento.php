<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');

class Orcamento extends CI_Controller {

  private function InicializarDA() {
    $this->load->model('DaOrcamento');
    $this->load->model('DaPedido');
    $this->load->model('DaImagem');

    $this->load->library('mupload', array('../media', 640, 480));
  }

  private function CarregaLovs($codigoSessao = null) {
    $this->load->model('DaSituacao');
    $this->load->model('DaEstabelecimento');

    $jsonSituacao = $this->getArrayToJson($this->DaSituacao->Buscar(3));
    $jsonEstabelecimento = $this->getArrayToJson($this->DaEstabelecimento->BuscarPorId($this->entidade['estabelecimento_id'], "id, nome_fantasia texto"));
    $jsonPedido = $this->getArrayToJson($this->DaPedido->BuscarPorId($this->entidade['pedido_id'], "observacao,situacao_id,placa,chassi,marca_modelo,ano_fabricacao,ano_modelo,renavam,servico,inserir_item,km"));
    $jsonItemPedido = $this->getArrayToJson($this->DaOrcamento->BuscarItemOrcamento($this->entidade['pedido_id'], $this->entidade['id'], 1, $codigoSessao));
    $jsonItemServico = $this->getArrayToJson($this->DaOrcamento->BuscarItemOrcamento($this->entidade['pedido_id'], $this->entidade['id'], 2, $codigoSessao));
    $jsonItemImagens = $this->getArrayToJson($this->mupload->buscar($this->entidade['id']));
    return '{
              "situacao":' . $jsonSituacao . ',	
              "estabelecimento":' . $jsonEstabelecimento . ',
              "pedido":' . $jsonPedido . ',
              "item":' . $jsonItemPedido . ',
              "servico":' . $jsonItemServico . ',
              "images":' . $jsonItemImagens . '							
            }';
  }

  public function Buscar() {
    $this->InicializarDA();
    $this->getPostArray();

    $id_pedido = $this->entidade['pedido_id'];
    $id = $this->entidade['id'];

    //se me traz o ultimo pedido do usuario dono da sessao caso houver
    $codigo = $this->BuscarIdDonoDoUsuario();
    $sessao = $this->sessaoBuscar();

    if ($sessao['nivel'] == 3) {
      $this->entidade = $this->DaOrcamento->BuscarPedidoDoEstabelecimento($codigo, $id_pedido);

      if ($this->isNullOrEmpty($this->entidade['id'])) {
        $this->entidade = $this->DaOrcamento->BuscarPorId($id);
      }
    } else {
      $this->entidade = $this->DaOrcamento->BuscarPorId($id);
    }

    if ($this->isNullOrEmpty($this->entidade['id'])) {
      $this->entidade['pedido_id'] = $id_pedido;
      $this->entidade['id'] = $id;
    }

    $lovs = $this->CarregaLovs($codigo);

    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs);
  }

  public function Cadastrar() {

    try {

      $this->getPostArray();
      $this->Validacao();
      $this->InicializarDA();

      //$this->DaOrcamento->TransacaoAbrir ();
      $this->db->trans_start();

      $dados = $this->entidade ['dados'];
      $item = $this->entidade ['item'];
      $servico = $this->entidade ['servico'];

      $sessao = $this->sessaoBuscar();

      if ($sessao ['nivel'] == 1 && !$dados ['estabelecimento_id'] > 0) {
        echo $this->msgAdvertencia("Este usuário é uma adminstrador selecione um estabelecimento...");
        return;
      }
      if (!$dados ['estabelecimento_id'] > 0) {
        $estabelecimentoId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
        $dados ['estabelecimento_id'] = $estabelecimentoId;
      }

      $retorno = $this->DaOrcamento->Cadastrar($dados);
      $retorno ['estabelecimento_id'] = $dados ['estabelecimento_id'];

      $this->DaOrcamento->CadastrarItem($retorno ['id'], $item, 1, $dados['pedido_id']);
      if ($servico != null) {
        $this->DaOrcamento->CadastrarItem($retorno ['id'], $servico, 2, $dados['pedido_id']);
      }

      $this->db->trans_complete();

      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($retorno), null, $this->msgSucesso("Orçamento cadastrado com sucesso."));
    } catch (Exception $exc) {
      $this->db->trans_rollback();
      show_error($exc);
    }
  }

  public function Editar() {
    $this->getPostArray();
    $this->Validacao();
    $this->InicializarDA();

    //$this->DaOrcamento->TransacaoAbrir ();
    $this->db->trans_start();

    $dados = $this->entidade ['dados'];
    $item = $this->entidade ['item'];

    $sessao = $this->sessaoBuscar();

    if ($sessao ['nivel'] == 1 && !$dados ['estabelecimento_id'] > 0) {
      echo $this->msgAdvertencia("Este usuário é uma adminstrador. Selecione um estabelecimento...");
      return;
    }

    if (!$dados ['estabelecimento_id'] > 0) {
      $estabelecimentoId = $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      $dados ['estabelecimento_id'] = $estabelecimentoId;
    }

    $this->DaOrcamento->Editar($dados);
    $this->DaOrcamento->EditarItem($item);

    //$this->DaOrcamento->TransacaoConfirmar ();
    $this->db->trans_complete();

    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($dados), null, $this->msgSucesso("Orçamento editados com sucesso."));
  }

  public function AlterarSituacao() {
    // enviar
    $this->initAlterarSituacao();
    $lovs = $this->CarregaLovs();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs, $this->msgAviso("Seu orçamento foi envido ao cliente. Você não poderá mas alterar o orçamento, apenas cancelar."));
  }

  public function AlterarSituacaoAprovar() {
    // aprovar
    $this->initAlterarSituacao();
    $retorno = $this->initListar();
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($retorno), null, $this->msgSucesso("Orçamento foi aprovado."));
  }

  public function Cancelar() {
    $this->getPostArray();
    $this->InicializarDA();

    $this->db->trans_start();

    $this->DaOrcamento->AlterarSituacao($this->entidade['id'], $this->entidade['situacao_id']);
    //contar quantos or�amentos tem no pedido, se for igual a zero mudar situacao do pedido para 3 Enviado/Em Aberto.
    if ($this->DaOrcamento->ContarOrcamentoEmAnalise($this->entidade['pedido_id']) === 0) {
      $this->DaPedido->AlterarSituacao($this->entidade['pedido_id'], 3);
    }

    $this->db->trans_complete();
    $lovs = $this->CarregaLovs($this->entidade ['id']);
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), $lovs, $this->msgAviso("Seu Orçamento foi cancelado. Não poderá ser mais editado."));
  }

  public function CancelarPelaListagem() {
    $this->getPostArray();
    $this->InicializarDA();
    $this->DaOrcamento->AlterarSituacao($this->entidade ['id'], $this->entidade ['situacao_id']);

    if ($this->DaOrcamento->ContarOrcamentoEmAnalise($this->entidade['pedido_id']) === 0) {
      $this->DaPedido->AlterarSituacao($this->entidade['pedido_id'], 3);
    }

    $this->entidade = $this->initListar($this->entidade ['id']);
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), null, $this->msgAviso("Seu orçamento foi cancelado."));
  }

  public function EnviarPelaListagem() {
    $this->initAlterarSituacao();
    $this->entidade = $this->initListar($this->entidade ['id']);
    echo $this->MontarObjetoRetornoJson($this->getArrayToJson($this->entidade), null, $this->msgAviso("Seu orçamento foi envido ao cliente. Você não poderá mas alterar o orçamento, apenas cancelar."));
  }

  public function Listar() {
    $retorno = $this->initListar();
    echo $this->getArrayToJson($retorno);
  }

  private function initAlterarSituacao() {
    //usando em enviar e aprovar.		
    $this->getPostArray();
    $this->InicializarDA();

    $this->DaOrcamento->AlterarSituacao($this->entidade['id'], $this->entidade['situacao_id']);

    //Se o pedido estiver na situação 3 - Enviado/Em Aberto.
    $total = $this->DaPedido->ContarPedidoEnviado($this->entidade['pedido_id']);
    if ($total > 0) {
      $this->DaPedido->AlterarSituacao($this->entidade['pedido_id'], $this->entidade['situacao_id']);
    }

    if ($this->entidade['estabelecimento_id'] != null && $this->entidade['situacao_id'] == 5) {
      $this->DaPedido->AlterarSituacao($this->entidade['pedido_id'], $this->entidade['situacao_id'], $this->entidade['estabelecimento_id'], $this->entidade['usuario_aprovou']);
    }
  }

  private function initListar($id = null) {
    $this->inicializarDA();
    $this->getPostArray();

    $sessao = $this->sessaoBuscar();
    $estabelecimentoId = null;

    if ($sessao ['nivel'] == 3) {
      $estabelecimentoId = $this->BuscarIdDonoDoUsuario();
    }

    return $this->DaOrcamento->Listar($this->entidade, $id, $estabelecimentoId);
  }

  private function Validacao() {
    $dados = $this->entidade ['dados'];
    $item = $this->entidade ['item'];
    $servico = $this->entidade ['outros'];

    $camposObrigatorios = array(
        //'situacao_id' => 'Situão não econtrada.  Informe ao suporte sobre esta mensagem',
        //'pedido_id' => 'Pedido não encontrado. Informe ao suporte sobre esta mensagem',
        //'valor_total' => 'Valor Total. Informe ao suporte sobre esta mensagem',
        //'sub_total_produto' => 'Sub Total. Informe ao suporte sobre esta mensagem',
        'prazo_entrega' => 'Prazo entrega',
    );

    $this->ValidarCampos($dados, $camposObrigatorios);

    if ($dados['desconto_produto'] > $dados['valor_total']) {
      $this->msgAdvertencia('Desconto não pode ser maior que valor total.');
    }

    //N�o valida caso a solicita��o for de apenas servi�o				
    if ($servico != 1) {
      if ($this->isNullOrEmpty($this->entidade ['item'])) {
        $this->msgAdvertencia("Insira ao menos 1 item.");
      }

      foreach ($item as $key => $value) {
        if ($this->isNullOrEmpty($value['preco_unitario'])) {
          $this->msgAdvertencia("Informe o pre�o do item " . $value['descricao']);
          break;
        } else if ($value['preco_unitario'] <= 0) {
          $this->msgAdvertencia("Informe um pre�o superior a 0 no item " . $value['descricao']);
          break;
        }
      }
    }
  }

  // Upload imagens  - talves isso vá parar em outro controller;

  public function Upload() {
    $this->InicializarDA();
    $this->getPostArray(true);

    if (!$this->mupload->ehImagem($this->mupload->getExtensao($this->entidade))) {
      return show_error('[{"Mensagem": "' . utf8_encode("Somente imagens são permitidas.") . '","Tipo":"3"}]', 404);
    }

    $arquivo = $this->mupload->salvar($this->entidade, $this->entidade['param'], $this->mupload->getNome($this->entidade));

    echo $this->getArrayToJson($arquivo);
  }

  public function CarregarImagens() {
    $this->InicializarDA();
    $this->getPostArray();
    print_r($this->entidade["grupo"]);
    $imagens = $this->mupload->buscar($this->entidade["grupo"]);
    echo $this->getArrayToJson($imagens);
  }

  public function ExcluirImagem() {
    $this->InicializarDA();
    $this->getPostArray();
    $this->mupload->excluir($this->entidade["grupo"]);
    $imagens = $this->mupload->buscar($this->entidade["id"]);

    echo $this->getArrayToJson($imagens);
  }

  public function BuscarImagem() {
    $this->InicializarDA();
    $this->getPostArray();
    $imagens = $this->mupload->buscar($this->entidade["id"]);
    echo $this->getArrayToJson($imagens);
  }

  public function EditarTextoImagem() {
    $this->InicializarDA();
    $this->getPostArray();
    $this->mupload->alterarTexto($this->entidade["nome"], $this->entidade["texto"]);
    $imagens = $this->mupload->buscar($this->entidade["id"]);
    echo $this->getArrayToJson($imagens);
  }
}
