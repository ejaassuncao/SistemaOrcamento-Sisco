<?php
class DaSituacao extends CI_Model {

	public function  Buscar($nivel){
		
		$this->db->where ('nivel',$nivel);
		$this->db->where ('ativo',1);

		$this->db->select('id,descricao');
		
		$get = $this->db->get ('situacao');
				
		return $this->GetRow($get);			
	}
		
}