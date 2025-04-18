<?php
class DaMailConfig extends CI_Model {

	public function  Send ($to,$titulo,$mensagem,$cc=null){

		$config =$this->GetConfiguracao();	
						
		$this->load->library('email');	
		
		//configurar email	
		$dados['protocol'] = 'sendmail';
        $dados['mailpath'] = '/usr/sbin/sendmail';
        $dados['charset'] = 'iso-8859-1';
        $dados['wordwrap'] = TRUE;
        $dados['mailtype'] = 'html';
		
		$dados['smtp_host'] = $config['smtp_host'];
		$dados['smtp_user'] = $config['smtp_user'];
		$dados['smtp_pass'] = $config['smtp_pass'];		
		$dados['smtp_port'] = $config['smtp_port'];
		$dados['smtp_timeout'] = $config['smtp_timeout'];
		
		$this->email->initialize($dados);
				
		$this->email->from($config['smtp_host'], $config['empresa']);
				
		$this->email->to($to);
							
		if($cc!=null){					
			$this->email->cc($emails);		
			//$this->email->bcc('them@their-example.com'); n�o sei oque �
		}
					
		$this->email->subject($titulo);
		$this->email->message($mensagem);			
		$this->email->send();			
	}	
	
	public function GetConfiguracao() {
		
		$this->db->limit(1);
		
		$this->db->select('empresa,smtp_host,smtp_user,smtp_pass,smtp_port,smtp_timeout');
		
		$get = $this->db->get ('configuracao');
				
		if($get->num_rows==1){
			return  $array= $get->row_array ();
		}else{
			 show_error("Registro não encontradado na tabela configuração.",500);
		}		
	}
}