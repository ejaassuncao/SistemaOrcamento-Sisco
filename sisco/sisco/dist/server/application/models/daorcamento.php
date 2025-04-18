<?php

class DaOrcamento extends CI_Model {

   private function GetColunas() {
      return 'id,
				situacao_id,
				pedido_id,
				estabelecimento_id,				
				prazo_entrega,
				sub_total_produto,
				desconto_produto,				
				total_produto,
				sub_total_servico,
				desconto_servico,				
				total_servico,
				valor_total';
   }

   public function BuscarItem($id) {
      $this->db->where('pedido_id', $id);
      $this->db->select('*');
      $get = $this->db->get('item');
      return $this->GetRow($get);
   }

   public function BuscarPorId($id) {
      $this->db->where('id', $id);
      $this->db->select($this->GetColunas());
      $get = $this->db->get('orcamento');
      return $this->GetRow($get, 'orcamento', $this->GetColunas());
   }

   public function BuscarPedidoDoEstabelecimento($estabelecimento_id, $id_pedido) {
      $this->db->where('pedido_id', $id_pedido);
      $this->db->where('estabelecimento_id', $estabelecimento_id);
      $this->db->select($this->GetColunas());
      $get = $this->db->get('orcamento');
      return $this->GetRow($get, 'orcamento', $this->GetColunas());
   }

   public function BuscarItemOrcamento($pedido_id, $orcamento_id = 0, $tipo, $codigoSessao = null) {

      if ($tipo == 1) {
         //se estiver carregando o produtos
         if ($orcamento_id > 0) {
            $this->db->where('io2.tipo', $tipo);
         } else {
            $this->db->where('i.sugestao', 1);
         }
      } else if ($tipo == 2) {
         // se estiver carregando os servi�os
         $this->db->where('io2.tipo', $tipo);
      }



      $this->db->where('i.pedido_id', $pedido_id);

      $this->db->join("(SELECT * FROM `item_orcamento` i , `orcamento` o WHERE  i.orcamento_id=o.id AND i.tipo = $tipo  AND o.id=$orcamento_id) io2", "i.id=io2.item_id", "LEFT");

      $this->db->select("i.id item_id,
				i.produto_id,
				i.descricao,
				i.quantidade,
				(SELECT io.preco_unitario FROM item_orcamento io WHERE io.tipo = $tipo AND i.id=io.item_id and io.orcamento_id =$orcamento_id) 'preco_unitario',
				(SELECT io.orcamento_id FROM item_orcamento io   WHERE io.tipo = $tipo AND i.id=io.item_id and io.orcamento_id =$orcamento_id) 'orcamento_id'								
				", FALSE);

      $get = $this->db->get('item i');

      return $this->GetRow($get);
   }

   private function existeItem($pedido_id) {

      $this->db->where('i.pedido_id', $pedido_id);
      $this->db->join('item_orcamento io', 'i.id=io.item_id');
      $this->db->select("i.id");
      $get = $this->db->get('item i');
      return $get->num_rows > 0;
   }

   public function Servico($pedido_id) {
      $this->db->where('p.id', $pedido_id);
      $this->db->select("p.servico");
      $get = $this->db->get('pedido p');
      return $this->GetRow($get);
   }

   public function Cadastrar($data) {
      return $this->GetCadastrar('orcamento', $data);
   }

   public function CadastrarItem($orcamento_id, $itens, $tipo, $pedido) {
      $retorno = false;

      foreach ($itens as $key => $item) {
         $retorno = false;

         if (!$item ['item_id'] > 0) {

            $dados = array(
                'descricao' => $item ['descricao'],
                'quantidade' => $item ['quantidade'],
                'produto_id' => isset($item ['produto_id']) ? $item ['produto_id'] : null,
                'pedido_id' => $pedido
            );

            $id = $this->GetCadastrar('item', $dados);

            $item ['item_id'] = $id['id'];
         }

         $dados = array(
             'item_id' => $item ['item_id'],
             'preco_unitario' => $item ['preco_unitario'],
             'orcamento_id' => $orcamento_id,
             'tipo' => $tipo
         );

         $this->GetCadastrar('item_orcamento', $dados, 'item_id');
         $retorno = true;
      }

      return $retorno;
   }

   public function Editar($data) {

      $this->db->where("id", $data['id']);

      if ($this->db->update('orcamento', $data) > 0) {
         
      } else {
         $this->db->trans_rollback();
         show_error('Erro ao editar o Or�amento');
      }
   }

   public function EditarItem($itens) {

      foreach ($itens as $key => $data) {

         $this->db->where("item_id", $data['item_id']);
         $this->db->where("orcamento_id", $data['orcamento_id']);
         $this->db->set('preco_unitario', $data['preco_unitario']);

         if ($this->db->update('item_orcamento') > 0) {
            
         } else {
            $this->db->trans_rollback();
            show_error('Erro ao editar o or�amento');
         }
      }
   }

   public function AlterarSituacao($id, $novaSituacao) {
      $this->db->where("id", $id);
      $this->db->set('situacao_id', $novaSituacao);
      if ($this->db->update('orcamento') > 0) {
         
      } else {
         $this->db->trans_rollback();
         show_error('Erro ao alterar situacao  do or�amento');
      }
   }

   public function ContarOrcamentoEmAnalise($pedidoId) {
      $this->db->where('pedido_id', $pedidoId);
      $this->db->where_in('situacao_id', '5,6,7');
      $this->db->select('id');
      $get = $this->db->get('orcamento');
      return $get->num_rows;
   }

   public function Listar($entidade, $id = null, $estabelecimentoId = null) {

      $this->db->order_by('p.id', 'asc');

      if ($id != null) {
         $this->db->where('o.id', $id);
      } else {
         $this->db->where('o.pedido_id', $entidade['pedido_id']);
         $this->db->where('p.cliente_id', $entidade['cliente_id']);

         if ($estabelecimentoId != null) {
            $this->db->where_in('o.situacao_id', array(3, 4, 5, 6, 7));
         } else {
            $this->db->where_in('o.situacao_id', array(4, 5, 6, 7));
         }
      }

      if ($estabelecimentoId != null) {
         $this->db->where('o.estabelecimento_id', $estabelecimentoId);
      }

      $this->db->join('situacao s', 'o.situacao_id=s.id');
      $this->db->join('estabelecimento e', 'o.estabelecimento_id=e.id');
      $this->db->join('pedido p', 'o.pedido_id=p.id');
      $this->db->join('cliente c', 'p.cliente_id=c.id');

      $this->db->select("o.id,
				p.observacao,
			    (select sit.descricao from situacao sit where sit.id=p.situacao_id ) pedido_situacao,
				p.situacao_id pedido_situacao_id,
				o.estabelecimento_id,
				e.nome_fantasia estabelecimento,
				c.nome_fantasia cliente,
				s.id situacao_id,
				s.descricao situacao_descricao,
				date_format(o.data_resposta,'%d/%m/%Y') as data_resposta ,
				o.valor_total", FALSE);

      $get = $this->db->get('orcamento o');

      return $this->GetRow($get);
   }

   public function AlterarSituacaoPeloPedido($pedidoId = null, $novaSituacao = null) {

      $this->db->where("pedido_id", $pedidoId);
      $this->db->set('situacao_id', $novaSituacao);
      if ($this->db->update('orcamento') > 0) {
         
      } else {
         $this->db->trans_rollback();
         show_error('Erro ao alterar situacao  do orçamento');
      }
   }

}
