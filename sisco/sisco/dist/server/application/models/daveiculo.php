<?php

class DaVeiculo extends CI_Model {

   public function BuscarPorId($id) {
      $this->db->where('id', $id);
      $this->db->select('*');
      $get = $this->db->get('veiculo');
      return $this->GetRow($get, 'veiculo');
   }
   
   public function BuscarPorPlaca($placa) {
      $this->db->where('placa', $placa);
      $this->db->select('*');
      $get = $this->db->get('veiculo');
      return $this->GetRow($get, 'veiculo');
   }
   
   public function Listar($filtro=null,$clienteId=null) {

      $this->db->limit(100);

      if ($clienteId != null) {
         $this->db->where('c.id', $clienteId);
      }

      if ($filtro != null) {
         $this->db->or_like('v.id', $filtro);
         $this->db->or_like('v.marca_modelo', $filtro);
         $this->db->or_like('v.placa', $filtro);
         $this->db->or_like('c.nome_fantasia', $filtro);
      }

      $this->db->join('cliente c', 'v.cliente_id=c.id');

      $this->db->order_by('v.id', "desc");
      $this->db->select('v.id, c.nome_fantasia cliente_nome,v.marca_modelo,v.placa');
      $get = $this->db->get('veiculo v');
      return $this->GetRow($get);
   }

   public function Cadastrar($data) {
      return $this->GetCadastrar('veiculo', $data);
   }

   public function Editar($data) {
      $this->db->where("id", $data['id']);
      if (!$this->db->update('veiculo', $data) > 0) {
         $this->db->trans_rollback();
         show_error('Erro ao editar');
      }
   }

}
