<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function formatar_data($data2,$retorno){
	//1 para americano
	//2 para brasileiro
	//$data2_americano = "2009/04/29";
	if($data2==""){
		return $data2;
	}
	if($retorno==1){
		//AGORA VAMOS EXPLODIR ELA PELOS HIFENS E SERÃ� CRIADO UM ARRAY COM AS PARTES
		$partes_da_data = explode('/',$data2);

		//AGORA REMONTAMOS A DATA NO FORMATO BRASILEIRO, OU SEJA,
		//INVERTENDO AS POSICOES E COLOCANDO AS BARRAS
		$data2_americano= $partes_da_data[2].'-'.$partes_da_data[1].'-'.$partes_da_data[0];

		//UFA! PRONTINHO, AGORA TEMOS A DATA NO BOM E VELHO FORMATO Americano
		return $data2_americano;
	}

	if($retorno==2){
			
		//AGORA VAMOS EXPLODIR ELA PELOS HIFENS E SERÃ� CRIADO UM ARRAY COM AS PARTES
		$partes_da_data = explode('-',$data2);

		//AGORA REMONTAMOS A DATA NO FORMATO BRASILEIRO, OU SEJA,
		//INVERTENDO AS POSICOES E COLOCANDO AS BARRAS
		$data2_brasileiro = $partes_da_data[2].'/'.$partes_da_data[1].'/'.$partes_da_data[0];

		//UFA! PRONTINHO, AGORA TEMOS A DATA NO BOM E VELHO FORMATO BRASILEIRO
		return $data2_brasileiro;

	}

}