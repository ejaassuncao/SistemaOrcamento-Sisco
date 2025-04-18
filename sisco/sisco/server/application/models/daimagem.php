<?php

//Depreciado--- Não está sendo usado no sistema
class DaImagem extends CI_Model {
	
	public function  Cadastrar($orcamentoId, $imagem, $descricao){	
		
		$data = array('orcamento_id'=>$orcamentoId,
					   'base64'=>$imagem,
						'descricao'=>$descricao);
		
		return $this->GetCadastrar ( 'imagem', $data );
	}
	
	public function  Buscar($id){
	
		$this->db->where ('orcamento_id',$id);
	
		$this->db->select('base64 mini, base64 thumbUrl, descricao caption');
					
		$get = $this->db->get ('imagem');
	
		return $this->GetRow($get);
	}
	
}