INSERT INTO `situacao` (`id`, `descricao`, `nivel`, `observação`, `ativo`) VALUES
(1, 'Ativo', 1, 'Todos os ativos tem permissão de interagir com os orçamento.', 1),
(2, 'Inadimplente', 1, 'Usuários inadimplentes não podem interagir com o sistema', 1),
(3, 'Enviado/Em Aberto', 3, 'Orçamento que acaba se ser cadatrado pelo cliente.', 1),
(4, 'Cancelado', 3, 'Orçamento que acaba se ser Cancelado pelo cliente.', 1),
(5, 'Aprovado', 3, 'Orçamento que acaba se ser aprovado pelo cliente', 1),
(6, 'Aguardando Aprovação', 3, 'Orçamento Aguardando aprovação do cliente. Já tem no minio 1 orçamento respondido.', 1),
(7, 'Finalizado', 3, 'Oramento já concluido a transação de compra e venda', 1),
(10, 'Em cadastramento', 3, 'Quando o usuario ainda pode fazer as mudanças no pedido.', 1);
