<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package		CodeIgniter
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2008 - 2014, EllisLab, Inc.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * CodeIgniter Model Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Libraries
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/libraries/config.html
 */
class CI_Model {

	/**
	 * Constructor
	 *
	 * @access public
	 */
	function __construct()
	{		
		log_message('debug', "Model Class Initialized");
	}

	/**
	 * __get
	 *
	 * Allows models to access CI's loaded classes using the same
	 * syntax as controllers.
	 *
	 * @param	string
	 * @access private
	 */
	function __get($key)
	{
		$CI =& get_instance();
		return $CI->$key;
	}
	
	private function GetID($tabela,$coluna='id'){		
		$this->db->select_max($coluna);
		$valor =$this->db->get($tabela);
		$array = $valor->row_array();
		return $array[$coluna];		
	}
			
	public function GetCadastrar($tabela,$data,$coluna='id'){
	
		if ($this->db->insert($tabela,$data)>0){				
			$entidade = $this->colunasTabela($tabela);						
			$entidade[$coluna] = $this->GetID($tabela,$coluna);
			
			return $entidade;		
			
		} else{
			$this->db->trans_rollback();
			show_error ('Erro ao cadastrar o(a)'.$tabela);
		}
	}
	
	public function GetRow($get,$tabela=null,$colunas="*") {	
		
		if ($get->num_rows > 1) {
			return $get->result_array ();			
		} else if ($get->num_rows == 1) {		
			return $get->row_array ();			
		}
		
		if($tabela==null) return null;
		
		return $this->colunasTabela($tabela,$colunas);		
	}
	
	public function GetValue($get,$coluna){
		$row = $get->row_array ();	
		return $row[$coluna];
	}
	
	public function TransacaoAbrir(){
		$this->db->trans_start();
	}
	
	public function TransacaoConfirmar(){
		$this->db->trans_complete();
	}
	
	public function TransacaoDesfazer(){
		$this->db->trans_rollback();
	}
	
	public function colunasTabela($tabela,$colunas="*"){
		
		$this->db->limit(1);			
		$this->db->select ($colunas);			
		$get = $this->db->get($tabela);
		
		$out =null;
		
		 $delim = ':"",';				 
		 $newline = "\n";
		 $enclosure = '"';
		
		foreach ($get->list_fields() as $name)
		{
			$out .= $enclosure.str_replace($enclosure, $enclosure.$enclosure, $name).$enclosure.$delim;
		}
		
		$out = rtrim($out,',');				
		$out = "{" . $out ."}";
				
		return (array)json_decode($out) ;
				
	}	

	protected function Criptografar($dados) {
		return md5(sha1($dados.'futebol'));
	}


}
// END Model Class

/* End of file Model.php */
/* Location: ./system/core/Model.php */