<?php

class DaProduto extends CI_Model {

   public function Buscar($id) {
      $this->db->where('id', $id);
      $this->db->select('*');
      $get = $this->db->get('produto');
      return $this->GetRow($get, 'produto');
   }

   public function BuscarPorDescricao($descricao = null, $categoriaId = null) {

      $colunas = 'id,descricao';

      if ($categoriaId != null) {
         $this->db->where('categoria_id', $categoriaId);
      }

      $this->db->like('descricao', $descricao);

      $this->db->select($colunas);
      $get = $this->db->get('produto');
      return $this->GetRow($get, 'produto', $colunas);
   }

   public function BuscarPreco($produtoId, $estabelecimentoId = 0) {
      $this->db->where('produto_id', $produtoId);
      $this->db->where('estabelecimento_id', $estabelecimentoId);
      $this->db->select("produto_id,estabelecimento_id,preco_unitario, date_format(data_fabricacao,'%d/%m/%Y') data_fabricacao,estoque", FALSE);
      $get = $this->db->get('produto_preco');
      return $this->GetRow($get, 'produto_preco');
   }

   public function Listar($fitro, $estabelecimento_id = 0) {
      $this->db->limit(100);
      $this->db->order_by('p.id', 'desc');
      $this->db->where('c.ativo', 1);

      if ($estabelecimento_id > 0) {
         $this->db->where('pp.estabelecimento_id', $estabelecimento_id);
      }
      if ($fitro != null) {
         $this->db->or_like('p.id', $fitro);
         $this->db->or_like('p.codigo', $fitro);
         $this->db->or_like('p.descricao', $fitro);
         $this->db->or_like('p.modelo', $fitro);
         $this->db->or_like('c.descricao', $fitro);
         $this->db->or_like('g.descricao', $fitro);
         $this->db->or_like('sg.descricao', $fitro);
      }

      $this->db->join('produto_preco pp', 'pp.produto_id=p.id');
      $this->db->join('estabelecimento e', 'pp.estabelecimento_id=e.id');
      $this->db->join('sub_grupo sg', 'p.sub_grupo_id=sg.id', "LEFT");
      $this->db->join('grupo g', 'p.grupo_id=g.id');
      $this->db->join('categoria c', 'p.categoria_id=c.id');

      $this->db->select("p.id,
							p.codigo inventario,
							p.descricao produto_nome,
							p.modelo,
							pp.estabelecimento_id,
							pp.data_fabricacao,
							pp.estoque,
							pp.preco_unitario,
							e.nome_fantasia estabelecimento_nome,
							c.id categoria_id,
							c.descricao categoria_nome,
							g.descricao grupo_nome,
							sg.descricao sub_grupo_nome", FALSE);

      $get = $this->db->get('produto p');

      return $this->GetRow($get);
   }

   public function ExiteProdutoParaEstabelecimento($produtoId, $estabelecimentoId) {
      $this->db->where('produto_id', $produtoId);
      $this->db->where('estabelecimento_id', $estabelecimentoId);
      $this->db->select('*');
      $get = $this->db->get('produto_preco');
      return $this->GetNumRows($get) > 0;
   }

   public function Cadastrar($data) {
      return $this->GetCadastrar('produto', $data);
   }

   public function CadastrarPreco($data) {
      return $this->GetCadastrar('produto_preco', $data);
   }

   public function Editar($data) {
      $this->db->where("id", $data['id']);

      if (!$this->db->update('produto', $data) > 0) {
         $this->db->trans_rollback();
         show_error('Erro ao editar');
      }
   }

   public function EditarPreco($data) {
      $this->db->where("produto_id", $data['produto_id']);
      $this->db->where("estabelecimento_id", $data['estabelecimento_id']);

      if (!$this->db->update('produto_preco', $data) > 0) {
         $this->db->trans_rollback();
         show_error('Erro ao editar');
      }
   }

}
