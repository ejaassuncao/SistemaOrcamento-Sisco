<?php
class DaRelatorio extends CI_Model {

	public function  RelatorioOrcamentoAprovado($pedidoId){	
		$this->db->where('p.id',$pedidoId);	
		$this->db->where('o.situacao_id',5);
				
		$this->db->join('situacao s','p.situacao_id=s.id');
		$this->db->join('categoria c','p.categoria_id=c.id');
		$this->db->join('cliente t','p.cliente_id=t.id');
		$this->db->join('estabelecimento e ','p.estabelecimento_id=e.id');
		$this->db->join('orcamento o','p.id=o.pedido_id');		
		
		$this->db->select ("p.id pedido_id,
							p.observacao,
							date_format(p.data_criacao,'%d/%m/%Y %H:%i:%s') data_criacao,		
							date_format(p.data_aprovacao,'%d/%m/%Y %H:%i:%s') data_aprovacao,
							p.placa,
							p.chassi,
							p.marca_modelo,
							p.ano_fabricacao,
							p.ano_modelo,
							p.renavam,
							p.km,
				           (select u.nome from usuario u where u.id=p.usuario_criou)usuario_criou,
						   (select u.nome from usuario u where u.id=p.usuario_aprovou)usuario_aprovou,
							o.id orcamento_id,
							date_format(o.data_resposta,'%d/%m/%Y'),
							o.prazo_entrega,
							
							o.sub_total_servico,
							(o.desconto_servico * o.sub_total_servico) desconto_servico,
							o.total_servico,
				
							o.sub_total_produto,
							(o.sub_total_produto * o.desconto_produto) desconto_produto,
							o.total_produto,
							
							o.sub_total,
							o.desconto,
							o.valor_total,
							c.descricao categoria,
							t.razao_social  cliente_razao,
							t.nome_fantasia cliente_nome,
							t.site cliente_site,
							t.telefone cliente_fone,
							t.cpf_cnpj cliente_cpf_cnpj,
						    (select cid.nome from cidade cid where t.cidade_id = cid.id) cliente_cidade,
							(select u.sigla from uf u where t.uf_id = u.id) cliente_uf,
							e.nome_fantasia estabelecimento,
							e.telefone estabelecimento_fone,
							e.cpf_cnpj estabelecimento_cpf_cnpj,
							e.complemento estabelecimento_endereco,
							e.bairro estabelecimento_bairro,
							e.site estabelecimento_site,
				 			(select cid.nome from cidade cid where e.cidade_id = cid.id) estabelecimento_cidade,
							(select u.sigla from uf u where e.uf_id = u.id) estabelecimento_uf,
							s.descricao situacao",FALSE);						
		
		$get = $this->db->get ('pedido p');
		return $this->GetRow($get);						
	}
	
	public function  ItensDoOrcamentoAprovado($orcamentoId,$tipo){
		$this->db->where('io.orcamento_id',$orcamentoId);
		$this->db->where('io.tipo',$tipo);
		$this->db->join('item i','io.item_id=i.id');
		$this->db->select ("i.id, i.descricao, i.quantidade, io.preco_unitario,(i.quantidade * io.preco_unitario) Total",FALSE);	
		return $this->db->get ('item_orcamento io');
	}
	
	public function ListarDados($dados=null,$sessao,$id){		
			
		if($sessao['nivel']==2){
			$this->db->where('p.cliente_id',$id);
		}
		if($sessao['nivel']==3){
			$this->db->where('p.estabelecimento_id',$id);
		}
		
		$this->db->order_by('p.data_aprovacao','ASC');
		
		if($dados['filtro']=='p.data_aprovacao' || $dados['filtro']=='p.data_criacao'){
			$coluna =$dados['filtro'];
			$this->db->where("date_format($coluna,'%d/%m/%Y')",$dados['data1']);			
			
		}else if($dados['filtro']=='periodo_aprovacao'){
			$coluna =$dados['filtro'];				
			$data1 = formatar_data($dados['data1'],1);
			$data2 = formatar_data($dados['data2'],1);
							
			$this->db->where("date(p.data_aprovacao)  BETWEEN  date('$data1') and date('$data2')");
				
		}else if($dados['filtro']!=null){				
			$this->db->like($dados['filtro'],$dados['valor']);
		}		
		
		if($dados['situacao']!=null){
			$this->db->where('o.situacao_id',$dados['situacao']);
		}
		
		$this->db->join('situacao s','p.situacao_id=s.id');
		$this->db->join('categoria c','p.categoria_id=c.id');
		$this->db->join('cliente t','p.cliente_id=t.id');
		$this->db->join('estabelecimento e ','p.estabelecimento_id=e.id');
		$this->db->join('orcamento o','p.id=o.pedido_id');
		
		$this->db->select ("p.id pedido_id,
							p.observacao,
							date_format(p.data_criacao,'%d/%m/%Y %H:%i:%s') data_criacao,
							date_format(p.data_aprovacao,'%d/%m/%Y %H:%i:%s') data_aprovacao,
							p.placa,
							p.chassi,
							p.marca_modelo,
							p.ano_fabricacao,
							p.ano_modelo,
							p.renavam,
				
							o.id orcamento_id,
							date_format(o.data_resposta,'%d/%m/%Y'),
							o.prazo_entrega,				
							o.sub_total_servico,
							(o.desconto_servico * o.sub_total_servico) desconto_servico,
							o.total_servico,		
							o.sub_total_produto,
							(o.sub_total_produto * o.desconto_produto) desconto_produto,
							o.total_produto,				
							o.sub_total,
							o.desconto,
							o.valor_total,
				
							c.descricao categoria,
							s.descricao situacao,
				
							t.razao_social  cliente_razao,
							t.nome_fantasia cliente_nome,
							t.site cliente_site,
							t.telefone cliente_fone,
							t.cpf_cnpj cliente_cpf_cnpj,
						    (select cid.nome from cidade cid where t.cidade_id = cid.id) cliente_cidade,
							(select u.sigla from uf u where t.uf_id = u.id) cliente_uf,
				
							e.nome_fantasia estabelecimento,
							e.razao_social estabelecimento_razao,
							e.telefone estabelecimento_fone,
							e.cpf_cnpj estabelecimento_cpf_cnpj,
							e.complemento estabelecimento_endereco,
							e.bairro estabelecimento_bairro,
							e.site estabelecimento_site,
				 			(select cid.nome from cidade cid where e.cidade_id = cid.id) estabelecimento_cidade,
							(select u.sigla from uf u where e.uf_id = u.id) estabelecimento_uf",FALSE);
		
		$get = $this->db->get ('pedido p');
		
		return $this->GetRow($get);
		
	}

}