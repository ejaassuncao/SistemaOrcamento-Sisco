<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');

class CI_Mupload {

   private $pasta;
   private $largura;
   private $altura;

   public function __construct($params) {
      $this->pasta = $params [0];
      $this->largura = $params [1];
      $this->altura = $params [2];
   }

   public function getExtensao($paramArquivo) {
       // retorna a extensao da imagem
      return $extensao = strtolower(end(explode('.', $paramArquivo ['name'])));
   }

   public function getNome($paramArquivo) {
      $extensao = "." . end(explode('.', $paramArquivo ['name']));
      return str_replace($extensao, "", $paramArquivo ['name']);
   }

   public function ehImagem($extensao) {
      $extensoes = array(
          'gif',
          'jpeg',
          'jpg',
          'png'
      ); // extensoes permitidas
      if (in_array($extensao, $extensoes))
         return true;
   }

   // largura, altura, tipo, localizacao da imagem original
   public function redimensionar($imgLarg, $imgAlt, $tipo, $img_localizacao) {
      // descobrir novo tamanho sem perder a proporcao
      if ($imgLarg > $imgAlt) {
         $novaLarg = $this->largura;
         $novaAlt = round(($novaLarg / $imgLarg) * $imgAlt);
      } elseif ($imgAlt > $imgLarg) {
         $novaAlt = $this->altura;
         $novaLarg = round(($novaAlt / $imgAlt) * $imgLarg);
      } else {
         // altura == largura
         $novaAltura = $novaLargura = max($this->largura, $this->altura);
      }
      // cria uma nova imagem com o novo tamanho
      $novaimagem = imagecreatetruecolor($novaLarg, $novaAlt);

      switch ($tipo) {
         case 1 : // gif
            $origem = imagecreatefromgif($img_localizacao);
            imagecopyresampled($novaimagem, $origem, 0, 0, 0, 0, $novaLarg, $novaAlt, $imgLarg, $imgAlt);
            imagegif($novaimagem, $img_localizacao);
            break;
         case 2 : // jpg
            $origem = imagecreatefromjpeg($img_localizacao);
            imagecopyresampled($novaimagem, $origem, 0, 0, 0, 0, $novaLarg, $novaAlt, $imgLarg, $imgAlt);
            imagejpeg($novaimagem, $img_localizacao);
            break;
         case 3 : // png
            $origem = imagecreatefrompng($img_localizacao);
            imagecopyresampled($novaimagem, $origem, 0, 0, 0, 0, $novaLarg, $novaAlt, $imgLarg, $imgAlt);
            imagepng($novaimagem, $img_localizacao);
            break;
      }
      // destroi as imagens criadas image
      imagedestroy($novaimagem);
      imagedestroy($origem);
   }

   public function salvar($paramArquivo, $paramGrupo, $paramDescricao) {
      $extensao = $this->getExtensao($paramArquivo);

      // localizacao do arquivo
      $diretorioDestino = $this->getDestino($paramGrupo);
      $arquivoDestino = $this->getDestino($paramGrupo, $paramArquivo ['name']);

      if (!is_dir($diretorioDestino)) {
         mkdir($diretorioDestino, 0777);
      }

      // configurar o upload-max-filesize', '10M' em php.ini
      // move o arquivo
      if (!move_uploaded_file($paramArquivo ['tmp_name'], $arquivoDestino . "." . $extensao)) {
         if ($paramArquivo ['error'] == 1) {
            $v = (ini_get('upload_max_filesize'));
            return show_error('[{"Mensagem": "' . utf8_encode("Tamanho excede os " . $v . " permitidos. Para aumentar o tamanho dos uploads das imagens entre em contato com o suporte.") . '","Tipo":"4"}]', 404);
         } else {
            return show_error('[{"Mensagem": "' . utf8_encode("Erro " . $paramArquivo ['error']) . '","Tipo":"4"}]', 404);
         }
      }

      if ($this->ehImagem($extensao)) {
         // pega a largura, altura, tipo e atributo da imagem
         list ( $largura, $altura, $tipo, $atributo ) = getimagesize($arquivoDestino . "." . $extensao);
         // testa se é preciso redimensionar a imagem
         if (($largura > $this->largura) || ($altura > $this->altura)) {
            $this->redimensionar($largura, $altura, $tipo, $arquivoDestino . "." . $extensao);
         }
      }

      // cria txt da descricao do arquivo
      $fp = fopen($arquivoDestino . ".txt", "a");
      // Escreve "exemplo de escrita"
      $escreve = fwrite($fp, $paramDescricao);
      // Fecha o arquivo
      fclose($fp);

      return array(
          "mini" => $arquivoDestino . "." . $extensao,
          "thumbUrl" => $arquivoDestino . "." . $extensao,
          "caption" => $paramDescricao
      );
   }

   public function existeArquivo($grupo, $nome) {
      $destino = $this->getDestino($grupo, $nome);
      return file_exists($destino);
   }

   public function buscar($grupo = null, $nome = null) {

      $destino = $this->getDestino($grupo, $nome);

      $listaArquivos = array();

      if (is_dir($destino)) {

         $d = dir($destino);

         while (false !== ($entry = $d->read())) {

            if (substr($destino . $entry, - 1) != ".") {
               if (substr($entry, - 3) != "txt") {
                  $texto = $this->PegarTexto($destino . $entry);
                  $array = array(
                      "mini" => $destino . $entry,
                      "thumbUrl" => $destino . $entry,
                      "caption" => $texto
                  );
                  array_push($listaArquivos, $array);
               }
            }
         }
         $d->close();
      }

      return $listaArquivos;
   }

   public function PegarTexto($destino) {
      $extensao = "." . end(explode('.', $destino));
      $nome = str_replace($extensao, ".txt", $destino);
      $linha = "";

      if (is_file($nome)) {
         $ponteiro = fopen($nome, "r");
         while (!feof($ponteiro)) {
            $linha .= fgets($ponteiro, 4096);
         }
         fclose($ponteiro);
      }

      return trim($linha);
   }

   public function excluir($caminhoAbsImagem) {
      if (is_file($caminhoAbsImagem)) {
         // apaga a imagem
         if (!unlink($caminhoAbsImagem)) {
            return show_error(utf8_encode("Erro ao excluir imagem"));
         }
      }

      // apaga o txt
      $extensao = "." . end(explode('.', $caminhoAbsImagem));
      $texto = str_replace($extensao, ".txt", $caminhoAbsImagem);
      if (is_file($texto)) {
         if (!unlink($texto)) {
            return show_error(utf8_encode("Erro ao excluir o arquivo texto imagem"));
         }
      }

      return "Imagem excluida com sucesso!";
   }

   public function excluirGrupo($grupo) {

      $dir = $this->getDestino($grupo);

      if(!is_dir($dir)){
         return;
      } 
      
      $files = array_diff(scandir($dir), array('.', '..'));

      foreach ($files as $file) {
         (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
      }
      if (!rmdir($dir)) {
         return show_error(utf8_encode("Erro ao excluir diretório"));
      }

      return "Diretório excluida com sucesso!";
   }

   public function alterarTexto($caminhoAbsImagem, $descricao) {
      $extensao = "." . end(explode('.', $caminhoAbsImagem));
      $texto = str_replace($extensao, ".txt", $caminhoAbsImagem);

      $ponteiro = fopen($texto, "w");

      fwrite($ponteiro, trim($descricao));

      fclose($ponteiro);

      return $descricao;
   }

   public function getDestino($grupo, $nome = null) {
      $destino = $this->pasta;

      $grupo = md5('sisco' . $grupo);
      $destino .= '/' . $grupo . '/';

      if ($nome != null) {
         $nome = md5(time() . $nome);
         $destino .= $nome;
      }
      return $destino;
   }

}
