<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package CodeIgniter
 * @author ExpressionEngine Dev Team
 * @copyright Copyright (c) 2008 - 2014, EllisLab, Inc.
 * @license http://codeigniter.com/user_guide/license.html
 * @link http://codeigniter.com
 * @since Version 1.0
 * @filesource
 *
 */
// ------------------------------------------------------------------------

/**
 * CodeIgniter Application Controller Class
 *
 * This class object is the super class that every library in
 * CodeIgniter will be assigned to.
 *
 * @package CodeIgniter
 * @subpackage Libraries
 * @category Libraries
 * @author ExpressionEngine Dev Team
 * @link http://codeigniter.com/user_guide/general/controllers.html
 */
class CI_Controller {

   private static $instance;
   public $entidade;
   private static $userId;

   public function __construct() {
      self::$instance = & $this;
      // Assign all the class objects that were instantiated by the
      // bootstrap file (CodeIgniter.php) to local class variables
      // so that CI can run as one big super object.
      foreach (is_loaded() as $var => $class) {
         $this->$var = & load_class($class);
      }

      $this->load = & load_class('Loader', 'core');
      $this->load->library('session');
      $this->load->model('DaUser');
      $this->load->initialize();

      $this->Filtro();
   }

   public static function &get_instance() {
      return self::$instance;
   }

   private function Filtro() {
      //var_dump($_SERVER);
      $sessao = $this->sessaoBuscar();
      $cookies = $this->session->all_userdata();
      $request = isset($_SERVER['ORIG_PATH_INFO'])?$_SERVER['ORIG_PATH_INFO']:$_SERVER['PATH_INFO'];
      $allowAnonimos = allowAnonimos(); //isto aqui é pra ser allowAnonimos

      for ($i = 0; $i < count($allowAnonimos); $i++) {
         if (strrpos($request, $allowAnonimos[$i]) > -1) {
            $existe = TRUE;
            break;
         }
         $existe = FALSE;
      }      
      if (!$existe && $sessao['hash'] == null && $sessao['cookies'] != $cookies['session_id']) { 
         $this->sessaoDestruir();         
         show_error("Autentica-se", 401);
      }
   }

   // *****Obter dados via Post******
   protected function getPostJson($file = false) {
      if ($file) {
         $this->entidade = $_FILES['file'];
         if (isset($_POST)) {
            $this->entidade['param'] = $_POST['data'];
         }
      } else {
         $this->entidade = file_get_contents('php://input');
      }
      return $this->entidade;
   }

   protected function getPostArray($file = false) {
      if ($file) {         
         if(!count($_FILES)>0){
            show_error("Arquivo não pode ser enviado. A causa poderá estar associada ao tamanho do arquivo.", 500);
         }         
         $this->entidade = $_FILES['file'];                
         if (filter_input(INPUT_POST, 'data')) {
            $this->entidade['param'] = filter_input(INPUT_POST, 'data');
         }
      } else {
         $this->entidade = json_decode(file_get_contents('php://input'), true);
      }
      return $this->entidade;
   }

   protected function MontarObjetoRetornoJson($entidade = null, $lovs = null, $mensagem = null) {
      if ($entidade == null) {
         $entidade = 'null';
      }
      if ($mensagem == null) {
         $mensagem = 'null';
      }
      if ($lovs == null) {
         $lovs = 'null';
      }

      return '{"Entidade":' . $entidade . ', "Lov":' . $lovs . ', "Mensagem":' . $mensagem . ' }';
   }

   // *****Outros******
   protected function Criptografar($dados) {
      return md5(sha1($dados . 'futebol'));
   }

   protected function RemoveElementArray($arr, $elementoAhRemover) {
      $newArr = array();
      foreach ($arr as $chave => $value) {
         if ($chave != $elementoAhRemover) {
            $newArr[$chave] = $value;
         }
      }
      return $newArr;
   }

   // *****converter******
   protected function getArrayToJson($array) {
      return json_encode($array);
   }

   protected function getJsonToArray($stringJson) {
      return json_decode($stringJson, true);
   }

   // *****Mensagens do servidor******
   protected function msgSucesso($mensagem) {
      // return '[{"Mensagem": "' . htmlentities ( $mensagem ) . '","Tipo":"1"}]';
      //return '[{"Mensagem": "' . utf8_encode($mensagem) . '","Tipo":"1"}]';
      return '[{"Mensagem": "' . $mensagem . '","Tipo":"1"}]';
   }

   protected function msgAviso($mensagem) {
      //return '[{"Mensagem": "' . utf8_encode($mensagem) . '","Tipo":"2"}]';
      return '[{"Mensagem": "' . $mensagem . '","Tipo":"2"}]';
   }

   protected function msgAdvertencia($mensagem) {
      //die('[{"Mensagem":"' . utf8_encode($mensagem) . '","Tipo":"3"}]');
      die('[{"Mensagem":"' . $mensagem . '","Tipo":"3"}]');
   }

   protected function msgErro($mensagem) {
      //die('[{"Mensagem": "' . utf8_encode($mensagem) . '","Tipo":"4"}]');
      die('[{"Mensagem": "' . $mensagem . '","Tipo":"4"}]');
   }

   // *****Validacao******
   protected function isNullOrEmpty($valor) {
      return (!isset($valor) || empty($valor));
   }

   protected function ValidarCampos($array, $camposObrigatorios) {
      if ($this->isNullOrEmpty($array)) {
         echo $this->msgAdvertencia("Preencha os campos obrigatórios");
         return;
      }

      do {
         $alias = current($camposObrigatorios);
         $coluna = key($camposObrigatorios);
         $valor = $array [$coluna];

         if ($this->isNullOrEmpty($valor)) {
            echo $this->msgAdvertencia("Preencha o campo " . $alias);
            return;
         }
      } while (next($camposObrigatorios));
   }

   // *****sessao******
   protected function sessaoCriar($user, $valor = null) {
      if ($valor == null) {
         $this->session->set_userdata('user', $user);
      } else {
         $this->session->set_userdata($user, $valor);
      }
      //usuario online
      $this->UserOnLine($user['id']);              
   }

   protected function sessaoBuscar($user = null) {
      if ($user == null) {
         return $this->session->userdata('user');
      } else {
         return $this->session->userdata($user);
      }
   }

   protected function sessaoDestruir($sessao = null) {     
      if ($sessao == null) {
         $this->session->unset_userdata('user');
      } else {
         $this->session->unset_userdata($sessao);
      }
       //usuario offline
       $this->UserOffLine();     
   }
   
   private function UserOnLine($userId) {
      $this->DaUser->setUsuarioOnLine($userId, 1);
      $this->session->set_userdata('user_id',$userId);
   }
   
   private function UserOffLine() {
      $userId = $this->session->userdata('user_id');
      $this->DaUser->setUsuarioOnLine($userId, 0);
      $this->session->unset_userdata('user_id');
   }

   // **************data e hora****************
   protected function getData() {
      return date("d/m/Y");
   }

   protected function getDataHora() {
      return date("d/m/Y H:i:s");
   }

   protected function Mask($val, $mask) {
      if ($this->isNullOrEmpty($val))
         return null;

      $maskared = '';
      $k = 0;
      for ($i = 0; $i <= strlen($mask) - 1; $i ++) {
         if ($mask [$i] == '#') {
            if (isset($val [$k]))
               $maskared .= $val [$k ++];
         } else {
            if (isset($mask [$i]))
               $maskared .= $mask [$i];
         }
      }
      return $maskared;
   }

   // regra espeecificas do sistema********
   protected function BuscarIdDonoDoUsuario() {
      $sessao = $this->sessaoBuscar();
      if ($sessao ['nivel'] == 1) {
         return null;
      } else if ($sessao ['nivel'] == 2) {
         return $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'cliente');
      } else if ($sessao ['nivel'] == 3) {
         return $this->DaUser->BuscarIdDonoDoUsuario($sessao ['id'], 'estabelecimento');
      }
      return null;
   }

   protected function Cript($data) {
      return base64_encode($data);
   }

   protected function Descrip($data) {
      return base64_decode($data);
   }

   protected function mail() {
      return base64_decode('ZXdhLnNvZnRAZ21haWwuY29t');
   }

   protected function ConveteImagemToBase64($file) {
      if (isset($file['tmp_name'])) {
         $conteudo = file_get_contents($file['tmp_name']);
         $type = trim(str_replace("image/", "", $file['type']));
         return 'data:image/' . $type . ';base64,' . base64_encode($conteudo);
      }
      return null;
   }

}

// END Controller class

/*
 * Tipo: Sucesso = 1, Aviso = 2, Advertencia =3, Erro = 4
*/

/* End of file Controller.php */
/* Location: ./system/core/Controller.php */