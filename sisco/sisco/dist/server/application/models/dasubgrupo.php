<?php
class DaSubGrupo extends CI_Model {

	public function  Buscar(){			
		$this->db->select('id,descricao');
		$get = $this->db->get ('sub_grupo');
		return $this->GetRow($get);
	}

	public function  Listar(){
		$this->db->order_by('s.id',"desc");
		$this->db->join('categoria c','s.categoria_id=c.id');
		$this->db->join('grupo g','s.grupo_id=g.id');
		$this->db->select('
				s.id,
				s.descricao,
				s.categoria_id,
				s.grupo_id,
				g.descricao grupo_descricao,				
				c.descricao categoria_descricao');	
		$get = $this->db->get ('sub_grupo s');	
		return $this->GetRow($get);
	}
	
	public function  Cadastrar($data){	
		return $this->GetCadastrar ( 'sub_grupo', $data );
	}
	
	public function  Editar($data){
		$this->db->where("id",$data['id']);
						
		if(!$this->db->update('sub_grupo',$data)>0){
			$this->db->trans_rollback();
			show_error ('Erro ao editar');
		}		
	}
	
	public function  BuscarPorGrupo($grupoId){
		$this->db->where("grupo_id",$grupoId);
		$this->db->select('id,descricao');
		$get = $this->db->get ('sub_grupo');
	
		return $this->GetRow($get);
	}
}