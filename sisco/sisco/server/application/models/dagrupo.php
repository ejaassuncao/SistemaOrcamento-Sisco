<?php
class DaGrupo extends CI_Model {

	public function  Buscar(){
							
		$this->db->select('id,descricao');		
		$get = $this->db->get ('grupo');
		
		return $this->GetRow($get);						
	}
	
	public function  BuscarGrupoPorCategoria($categoriaId){
		$this->db->where("categoria_id",$categoriaId);
		$this->db->select('id,descricao');
		$get = $this->db->get ('grupo');
	
		return $this->GetRow($get);
	}
	
	public function  Listar(){
		$this->db->order_by('id',"desc");
						
		$this->db->join('categoria c','g.categoria_id=c.id');
		$this->db->select('
				g.id,
				g.descricao,
				g.categoria_id,
				c.descricao categoria_descricao');
		
		$get = $this->db->get ('grupo g');
		
		return $this->GetRow($get);
	}
	
	public function  Cadastrar($data){	
		return $this->GetCadastrar ( 'grupo', $data );
	}
	
	public function  Editar($data){
		$this->db->where("id",$data['id']);
				
		if(!$this->db->update('grupo',$data)>0){
			$this->db->trans_rollback();
			show_error ('Erro ao editar');
		}		
	}
}