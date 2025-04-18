<?php
class DaConfiguracao extends CI_Model {

	public function  Buscar(){
								
		$this->db->limit(1);		
		$this->db->select('*');		
		$get = $this->db->get ('configuracao');
		
		return $this->GetRow($get);						
	}	
			
	public function  Cadastrar($data){	
		return $this->GetCadastrar ( 'configuracao', $data );
	}
	
	public function  Editar($data){
		$this->db->where("id",$data['id']);
				
		if(!$this->db->update('configuracao',$data)>0){
			$this->db->trans_rollback();
			show_error ('Erro ao editar');
		}		
	}
}