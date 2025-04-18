<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');

class Chat extends CI_Controller {

   var $getHistorico;
   
   private function inicializarDA() {
      $this->load->model('DaChat');
   }

   public function BuscarGrupos() {      
      $this->inicializarDA();
      $this->getPostArray();
      $this->getHistorico=false;
      echo $this->getArrayToJson($this->PreparaLista());
   }
   
   //Verificar se tem lista ativa.
   //vou pegar a lista que estiver ativa mim 'destinatario'
   //apos pegar a lista ativa atualiza a lista que acabei de pegar para false.
   private function PreparaLista() {
      //verifica apenas mensagem que o usuario logado recebeu    
      $alert = $this->DaChat->TotalAlert($this->entidade['usuario']); 
      
      //verifica mensagem que o usuario logado recebeu  e enviou.
      $total_es= $this->DaChat->TotalAlert($this->entidade['usuario'],$this->entidade['usuario'],$this->entidade['max_row']);
                 
      $retorno['atualizado'] = false;
      $retorno['list'] =array();
      $lista_administrador = null;
      $alert_administrador = 0;
      $lista_cliente = null;
      $alert_cliente = 0;
      $lista_estabelecimento = null;
      $alert_estabelecimento = 0;
      $outroUsuarioChamando = 0;     
      if ($this->entidade['mostar_usuarios']==true || $alert >0) {         
         
         $lista_administrador = $this->DaChat->BuscarGrupos($this->entidade['usuario'], 1);
         $alert_administrador = $this->DaChat->BuscarAlertGrupo($this->entidade['usuario'], 1);

         $lista_cliente = $this->DaChat->BuscarGrupos($this->entidade['usuario'], 2);
         $alert_cliente = $this->DaChat->BuscarAlertGrupo($this->entidade['usuario'], 2);

         $lista_estabelecimento = $this->DaChat->BuscarGrupos($this->entidade['usuario'], 3);
         $alert_estabelecimento = $this->DaChat->BuscarAlertGrupo($this->entidade['usuario'], 3);
                 
         $retorno['atualizado'] = true;

         $retorno['dados'] = array(
             "administrador" => $lista_administrador,
             "alert_administrador" => $alert_administrador,
             "cliente" => $lista_cliente,
             "alert_cliente" => $alert_cliente,
             "estabelecimento" => $lista_estabelecimento,
             "alert_estabelecimento" => $alert_estabelecimento
         );
      }
      //se estiver visualizando mensagme e   tiver algo novo para mim
      //onde meu id usuario seja maior doque oque foi...ver isso no caso do array
      if(((!$this->entidade['grupo']) && ($total_es>0)) || ((!$this->entidade['grupo']) and $this->entidade['max_row'] ==0) ){
            $v= $this->DaChat->VerMensagem( $this->entidade['usuario'],$this->entidade['amigo'],$this->getHistorico);           
            if(!$this->isNullOrEmpty($v) && $v!=NULL){
               $retorno['list']=$v;
               $this->DaChat->Atualizar($this->entidade['usuario'],null, $this->entidade['max_row']);
            }
            $retorno['atualizado'] = true;
          // Existe outro usuario me chamando
          $outroUsuarioChamando=$this->DaChat->TotalAlertOutroUsuario($this->entidade['usuario'],$this->entidade['amigo']);                
      }
      //entrada e saida
      $retorno['$total_es'] = $total_es;
      $retorno['total_alert'] = $alert;   
      $retorno['outro_usuario_chamando'] = $outroUsuarioChamando;
      return $retorno;
   }
   
   public function Cadastrar() {
      $this->getPostArray();
      $this->inicializarDA();
      
      $this->DaChat->Cadastrar($this->entidade);
      $this->entidade['trazer_dados'] = 1;
   }
   
   public function Historico() {
      $this->inicializarDA();
      $this->getPostArray();
      $this->getHistorico=true;
      echo $this->getArrayToJson($this->PreparaLista());
   }   
}