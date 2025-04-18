<?php

class DaChat extends CI_Model {

   public function BuscarGrupos($usuario, $nivel) {      
     
      $this->db->where("u.nivel = {$nivel} and u.id<>{$usuario}");
     
      $this->db->select("u.id, u.nome, u.src_foto, u.online, u.nivel, COALESCE((select sum(c.alert) from chat c where c.alert =1 
      and c.remetente= u.id and c.destinatario = {$usuario}),0) alert_usuario", FALSE);
      $get = $this->db->get('usuario u');
      return $this->GetRow($get);
   }
   
   function BuscarAlertGrupo($usuario, $nivel) {
      $this->db->where("c.destinatario ={$usuario} and c.remetente = u.id and u.nivel ={$nivel}");       
      $this->db->select("COALESCE(sum(c.alert),0) total", FALSE);        
      $get = $this->db->get('chat c, usuario u');
      return $this->GetValue($get, "total") ;                        
   }

   public function TotalAlert($destinatario,$remenente=null,$max_row=null) {
      $this->db->where('alert', 1);
      
      if($remenente !=null && $max_row==null){
         $this->db->where("(destinatario={$destinatario} or remetente={$remenente})");
         
      }else if($remenente !=null && $max_row!=null){
         $this->db->where("(destinatario={$destinatario} or remetente={$remenente}) and id >{$max_row}");   
        
      }else{
          $this->db->where('destinatario', $destinatario);
      }
      $this->db->select('count(alert) alert');
      $get = $this->db->get('chat');
      $v=  $this->GetRow($get);
      return $v['alert'];
     
   }
   
    public function TotalAlertOutroUsuario($destinatario,$remetente) {   
       if (!$remetente > 0) {
         return 0;
      }

      $this->db->where("destinatario={$destinatario} and  remetente<>{$remetente} and alert = 1",null,FALSE);      
      $this->db->select('count(*) alert');
      $get = $this->db->get('chat');
      $v=  $this->GetRow($get);
      return $v['alert'];

   }

   public function VerMensagem($usuario, $amigo,$historico=false) {   
            
      $this->db->order_by('c.id', 'desc');
       
      if(!$historico){
           $this->db->limit(5);           
      }else{
         $this->db->limit(100);   
      }
      
      //mensagem enviada
      $this->db->where("(c.remetente = {$usuario} or c.remetente={$amigo}) and (c.destinatario = {$usuario} or c.destinatario={$amigo})"); 
      
      $this->db->select('c.*, u.src_foto, u.nome');
      
      $this->db->join('usuario u', 'u.id = c.remetente');            
      $get = $this->db->get('chat c');      
      return $this->GetRow($get);
   }
   
   public function Atualizar($destinatario,$remenente=null,$max_row=0) {
      if($remenente !=null && $destinatario!=null){
         $this->db->where("(destinatario={$destinatario} or remetente={$remenente})");         
      }else if($destinatario!=null && $remenente !=null && $max_row > 0 ){
         $this->db->where("(destinatario={$destinatario} or remetente={$remenente}) and id < = {$max_row}");
      }else if ( $destinatario!=null && $max_row>0){
          $this->db->where("destinatario = {$destinatario} and id <= {$max_row}");
      }else{
         $this->db->where("destinatario = {$destinatario}");
      }
      $data['alert'] = 0; 
      if (!$this->db->update('chat', $data) > 0) {
         $this->db->trans_rollback();
         show_error('Erro ao editar');
      }
   }
      
   public function Cadastrar($data) {
      return $this->GetCadastrar('chat', $data);
   }
}
