<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
 
class CI_Mpdf {
	
	
	public function GerarPdf($html,$titulo=null,$paisagem=false)
	{		
	    require_once("mpdf_lib/mpdf.php");
	  
	    $mpdf = new mPDF();
	 	    
	    $mpdf->allow_charset_conversion=true;
	    $mpdf->charset_in='utf-8';
	    
	    if($paisagem==true){  
	    	$mpdf->CurOrientation='l';
	    }
        
	    //Exibir a pagina inteira no browser
	    //$mpdf->SetDisplayMode('fullpage');	  
	    	   
	    //Cabeçalho: Seta a data/hora completa de quando o PDF foi gerado + um texto no lado direito
	    if($titulo!=null){
	       	$mpdf->SetHeader("Sisco - Sistema de Orçamento");	       
	    }
	 
	    //Rodap�: Seta a data/hora completa de quando o PDF foi gerado + um texto no lado direito
	    $mpdf->SetFooter('{DATE j/m/Y H:i}|{PAGENO}/{nb}|Sisco - Sistema de Orçamento');
	 
	    $mpdf->WriteHTML($html);
	 
	    // define um nome para o arquivo PDF
	    if($filename == null){
	        $filename = date("Y-m-d_his").'_impressao.pdf';
	    }	 
	    $mpdf->Output($filename, 'I');
	}
}
 
/* End of file mpdf_pdf_pi.php */
/* Location: ./system/plugins/mpdf_pi.php */