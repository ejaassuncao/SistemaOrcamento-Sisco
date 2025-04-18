<?php

class DaPedido extends CI_Model {

   public function BuscarItem($id, $tipo = null) {
      $this->db->where('i.sugestao', $tipo);
      $this->db->where('i.pedido_id', $id);
      $this->db->select('i.produto_id,i.descricao, i.quantidade, i.sugestao', FALSE);
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

   public function BuscarPorId($id, $colunas = '*') {
      $this->db->where('id', $id);
      $this->db->select($colunas);
      $get = $this->db->get('pedido');
      return $this->GetRow($get, 'pedido', $colunas);
   }

   public function ContarPedidoEnviado($id) {
      $this->db->where('id', $id);
      $this->db->where('situacao_id', 3);
      $this->db->select('id');
      $get = $this->db->get('pedido');
      return $get->num_rows;
   }

   public function Cadastrar($data) {
      return $this->GetCadastrar('pedido', $data);
   }

   public function Editar($dados) {
      $dados['notificacao'] = $this->Notificacao();
      $dados['data_notificacao'] = date("Y-m-d H:i:s");
      $this->db->where("id", $dados['id']);
      if (!$this->db->update('pedido', $dados) > 0) {
         $this->db->trans_rollback();
         show_error('Erro ao editar o Pedido');
      }
   }

   public function AlterarSituacao($id, $novaSituacao, $estabelecimentoId = null, $usuarioAprovou = null) {

      $notificacao = $this->Notificacao();
      $data = date("Y-m-d H:i:s");

      $this->db->where("id", $id);
      $this->db->set('situacao_id', $novaSituacao);
      $this->db->set('notificacao', $notificacao);
      $this->db->set('data_notificacao', $data);

      if ($estabelecimentoId != null) {
         $this->db->set('estabelecimento_id', $estabelecimentoId);
         $this->db->set('data_aprovacao', $data);
         $this->db->set('usuario_aprovou', $usuarioAprovou);
      }

      if (!$this->db->update('pedido') > 0) {
         $this->db->trans_rollback();
         show_error('Erro ao alterar situacao do pedido');
      }
   }

   public function CadastrarItem($id, $array) {
      foreach ($array as $key => $item) {
         $retorno = false;
         $dados = array(
             'descricao' => $item ['descricao'],
             'quantidade' => $item ['quantidade'],
             'sugestao' => $item ['sugestao'],
             'produto_id' => $item ['produto_id'],
             'pedido_id' => $id
         );

         $this->GetCadastrar('item', $dados);
         $retorno = true;
      }

      return $retorno;
   }

   public function ExcluirItem($id) {
      $this->db->where('pedido_id', $id);
      $this->db->delete('item');
   }

   public function Listar($filtro = null, $codigo = null, $id = null, $nivel = null, $estalecimentoSessao = null) {

      $this->db->limit(100);
      $this->db->order_by('p.id', 'desc');

      if ($nivel == 2) {
         $this->db->where('p.cliente_id', $codigo);
      }
      if ($nivel == 3) {
         $this->db->where('p.categoria_id', $codigo);
         $this->db->where('p.situacao_id in (3,5,6)', null, FALSE);
      }
      if ($id != null) {
         $this->db->where('p.id', $id);
      }

      if ($filtro != null) {
         $this->db->or_like('p.id', $filtro);
         $this->db->or_like('p.observacao', $filtro);
         $this->db->or_like('p.placa', $filtro);
         $this->db->or_like('c.descricao', $filtro);
         $this->db->or_like('s.descricao', $filtro);
         $this->db->or_like('t.nome_fantasia', $filtro);
         $this->db->or_like('date_format( p.data_criacao, \'%d/%m/%Y \')', $filtro);
      }

      $this->db->join('situacao s', 'p.situacao_id=s.id');
      $this->db->join('categoria c', 'p.categoria_id=c.id');
      $this->db->join('cliente t', 'p.cliente_id=t.id');

      $this->db->select("p.id,
				p.observacao,
				p.placa,
				p.cliente_id,						
				t.nome_fantasia cliente,
				p.categoria_id,
				p.situacao_id,
			   	(case when p.estabelecimento_id =" . $estalecimentoSessao . " then true else false end ) meu_estabelecimento,
				s.descricao situacao_descricao,
				c.descricao categoria_descricao,	
				(select count(id) from orcamento o where o.pedido_id=p.id and o.situacao_id in(5,6,7) ) qtd_orcamento,
				(select count(id) from orcamento o where o.pedido_id=p.id and o.estabelecimento_id=" . $estalecimentoSessao . ") qtd_orcamento_estabelecimento,			
				s.id situacao_id,date_format(p.data_criacao,'%d/%m/%Y') as data_criacao", FALSE);

      $get = $this->db->get('pedido p');

      return $this->GetRow($get);
   }

   private function Notificacao() {
      $this->db->select_max('notificacao');
      $get = $this->db->get('pedido');
      $notificacao = $get->row_array();
      return $notificacao['notificacao'] + 1;
   }

   public function ListarCincoUltimosPedidos($nivel = null, $codigo = null) {

      $this->db->limit(5);
      $this->db->order_by('p.notificacao', 'desc');

      if ($nivel == 2) {
         $this->db->where('p.cliente_id', $codigo);
      }
      if ($nivel == 3) {
         $this->db->where('p.categoria_id', $codigo);
      }

      $this->db->where_in('p.situacao_id', array(3, 4, 5, 6, 7));

      $this->db->join('situacao s', 'p.situacao_id=s.id');
      $this->db->join('categoria c', 'p.categoria_id=c.id');
      $this->db->join('cliente t', 'p.cliente_id=t.id');
      $this->db->join('estabelecimento e ', 'p.estabelecimento_id=e.id', 'LEFT');

      $this->db->select("p.id,
				t.nome_fantasia cliente,
				s.descricao situacao_descricao,
				p.situacao_id,
				p.observacao,				
				date_format(p.data_notificacao,'%d/%m/%Y') data_notificacao,
				e.nome_fantasia estabelecimento,							
				c.descricao categoria_descricao", FALSE);

      $get = $this->db->get('pedido p');

      return $this->GetRow($get);
   }

   public function ListarAvancado($filtro = null, $codigo = null, $id = null, $nivel = null, $estalecimentoSessao = null) {
      $this->db->limit(100);
      $this->db->order_by('p.id', 'desc');

      if ($nivel == 2) {
         $this->db->where('p.cliente_id', $codigo);
      }
      if ($nivel == 3) {
         $this->db->where('p.categoria_id', $codigo);
         $this->db->where('p.situacao_id in (3,5,6)', null, FALSE);
      }
      if ($id != null) {
         $this->db->where('p.id', $id);
      }

      $where = array();

      if ($filtro != null) {

         if (isset($filtro['pedido']) && !empty($filtro['pedido'])) {
            array_push($where, " AND p.id={$filtro['pedido']}");
         }

         if (isset($filtro['placa']) && !empty($filtro['placa'])) {
            array_push($where, " AND p.placa='{$filtro['placa']}'");
         }

         if (isset($filtro['cliente']) && !empty($filtro['cliente'])) {
            array_push($where, " AND t.nome_fantasia LIKE '%{$filtro['cliente']}%'");
         }

         if (isset($filtro['situacao_id']) && !empty($filtro['situacao_id'])) {
            array_push($where, " AND s.id={$filtro['situacao_id']}");
         }

         if (isset($filtro['categoria_id']) && !empty($filtro['categoria_id'])) {
            array_push($where, " AND c.id={$filtro['categoria_id']}");
         }

         if (isset($filtro['data1']) && !empty($filtro['data1'])) {
            $filtro['data2'] = (isset($filtro['data2']) && !empty($filtro['data2']) ) ? $filtro['data2'] : $filtro['data1'];
            $data1=  formatar_data($filtro['data1'],1);
            $data2=  formatar_data($filtro['data2'],1);
            array_push($where, " AND date(p.data_criacao) BETWEEN '{$data1}' and '{$data2}'");
         }
      }
      if (count($where) > 0) {
         $where[0] = str_replace("AND", "", $where[0]);
         $SQL = implode("", $where);
         $this->db->where($SQL, NULL, FALSE);
      }

      $this->db->join('situacao s', 'p.situacao_id=s.id');
      $this->db->join('categoria c', 'p.categoria_id=c.id');
      $this->db->join('cliente t', 'p.cliente_id=t.id');

      $this->db->select("p.id,
            p.observacao,
            p.placa,
            p.cliente_id,						
            t.nome_fantasia cliente,
            p.categoria_id,
            p.situacao_id, (case when p.estabelecimento_id =" . $estalecimentoSessao . " then true else false end ) meu_estabelecimento,
            s.descricao situacao_descricao,
            c.descricao categoria_descricao,	
            (select count(id) from orcamento o where o.pedido_id=p.id and o.situacao_id in(5,6,7) ) qtd_orcamento,
            (select count(id) from orcamento o where o.pedido_id=p.id and o.estabelecimento_id=" . $estalecimentoSessao . ") qtd_orcamento_estabelecimento,			
            s.id situacao_id,date_format(p.data_criacao,'%d/%m/%Y') as data_criacao", FALSE);

      $get = $this->db->get('pedido p');

      return $this->GetRow($get);
   }

}
