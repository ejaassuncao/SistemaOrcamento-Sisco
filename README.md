# Sistemma de Orçamento


1 - Executar  o script sql no banco de dados;
2 - Inserir scripts de criacao da tabelas; entre esses script verifique se as situacoes estão ok;
3 - Configuar os arquivos de servidor:
 	 'server/aplication/config/config.php';
 	 'server/aplication/config/database.php'
     
4 - Configuar o apache para
    'rewrite_module' deverá ser marcado.
    
5 - Alterar o .htaccess do path do diretório server.

6 - Configuar server de enviar email.

Diretórios do sistema:
1 - server;
2 - app;
3 - install (helper de instalação e confiracao do sistema)

Arquivos no path do sistema:
	1 - .htaccess
	2 - redireciona.html;
	
###############ATUALIZAÇÃO DO SISTEMA##################################
*Para  poderá alterar:
	1 - Pasta *app  pode ser alterada toda.
	2 - Na Pasta *server poderá alterar  poderá alterar apenas as pasta controller e models
