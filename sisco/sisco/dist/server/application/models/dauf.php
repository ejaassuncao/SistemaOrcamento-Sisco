<?php
class DaUf extends CI_Model {

	public function  Buscar(){
		
		$this->db->select('id,nome');
		
		$get = $this->db->get ('uf');		
		
		return $this->GetRow($get);		
	
	}
	
}