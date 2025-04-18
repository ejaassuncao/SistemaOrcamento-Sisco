<?php

if (!defined('BASEPATH'))
  exit('No direct script access allowed');
if (!function_exists('allowAnonimos')) {

  function allowAnonimos() {
    return array(
        'User/BuscarUsuarioLogado',
        'User/Logar',
        'User/RecuperarSenha',
        'User/GerarSenha',
        'User/Chave',
        'Sessao',
        'Cbase64',
        'Dbase64',
        'configuracao',
        'ConfiguracaoInsert',
        'User/BuscarUsuarioLogado',
        'User/Ativar',
        'Relatorio/ImprimirTodos',
        'Diretorio');
  }

}
