<?php
class DaMaster extends CI_Model {

	public function  Buscar(){
		$this->db->where ('ativo',1);		
		$this->db->select('id,descricao');		
		$get = $this->db->get ('usuario');		
		return $this->GetRow($get);						
	}	
	
	public function  Listar(){
		$this->db->order_by('id',"desc");
		$this->db->where('nivel',1);
		$this->db->select('id,nome,email,src_foto');		
		$get = $this->db->get ('usuario');	
		return $this->GetRow($get);
	}
	
	public function  Cadastrar($data){
		return $this->GetCadastrar ( 'usuario', $data );
	}
	
	public function  Editar($data){
		$this->db->where("id",$data['id']);				
		if(!$this->db->update('usuario',$data)>0){
			$this->db->trans_rollback();
			show_error ('Erro ao editar o Pedido');
		}		
	}
}