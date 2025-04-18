<?php
class DaCategoria extends CI_Model {

	public function  Buscar(){								
		$this->db->where ('ativo',1);		
		$this->db->select('id,descricao');		
		$get = $this->db->get ('categoria');
		
		return $this->GetRow($get);						
	}
	
	public function  BuscarPorId($id){
		$this->db->where ('id',$id);
		$this->db->select('id,descricao');
		$get = $this->db->get ('categoria');
	
		return $this->GetRow($get);
	}
	
	public function  Listar(){
		$this->db->order_by('id',"desc");
		$this->db->select('*');		
		$get = $this->db->get ('categoria');	
		return $this->GetRow($get);
	}
	
	public function  Cadastrar($data){	
		return $this->GetCadastrar ( 'categoria', $data );
	}
	
	public function  Editar($data){
		$this->db->where("id",$data['id']);
				
		if(!$this->db->update('categoria',$data)>0){
			$this->db->trans_rollback();
			show_error ('Erro ao editar');
		}		
	}
}