<?php
class DaCidade extends CI_Model {

	public function  BuscarPorIdUF($UfId){
		
		$this->db->where('uf_id',$UfId);
		
		$this->db->select('id,nome');
		
		$get = $this->db->get ('cidade');
		
		return $this->GetRow($get);
		
	}
	
}