<?php

class DaCliente extends CI_Model {

   public function BuscarPorId($id, $colunas = '*') {
      $this->db->where('id', $id);
      $this->db->select($colunas);
      $get = $this->db->get('cliente');

      return $this->GetRow($get, 'cliente', $colunas);
   }

   public function BuscarPorNome($filtro) {
      $this->db->Like('nome_fantasia', $filtro);
      $this->db->select('id,nome_fantasia texto');
      $get = $this->db->get('cliente');

      return $this->GetRow($get);
   }

   public function Cadastrar($data) {
      return $this->GetCadastrar('cliente', $data);
   }

   public function Editar($data) {

      $this->db->where("id", $data['id']);

      if ($this->db->update('cliente', $data) > 0) {
         
      } else {
         $this->db->trans_rollback();
         show_error('Erro ao editar o estabelecimento');
      }
   }

   public function Listar($filtro = null, $id = null) {

      $this->db->limit(100);

      if ($id != null) {
         $this->db->where('e.id', $id);
      }

      if ($filtro != null) {
         $this->db->or_like('e.id', $filtro);
         $this->db->or_like('e.nome_fantasia', $filtro);
         $this->db->or_like('e.razao_social', $filtro);
         $this->db->or_like('s.descricao', $filtro);
      }

      $this->db->join('situacao s', 'e.situacao_id=s.id');
      $this->db->select('e.id,e.nome_fantasia,razao_social, e.telefone, s.descricao situacao_descricao,');

      $get = $this->db->get('cliente e');

      return $this->GetRow($get);
   }

}
