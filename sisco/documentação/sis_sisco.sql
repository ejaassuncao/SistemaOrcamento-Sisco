-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 27-Dez-2015 às 16:02
-- Versão do servidor: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sis_sisco`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `categoria`
--

CREATE TABLE IF NOT EXISTS `categoria` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) DEFAULT NULL,
  `ativo` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `categoria`
--

INSERT INTO `categoria` (`id`, `descricao`, `ativo`) VALUES
(1, 'Mecanica', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `chat`
--

CREATE TABLE IF NOT EXISTS `chat` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `msg` varchar(160) NOT NULL,
  `remetente` int(10) unsigned NOT NULL,
  `destinatario` int(10) NOT NULL,
  `nivel_destinatario` int(11) NOT NULL,
  `nivel_remetente` int(11) NOT NULL,
  `alert` int(10) unsigned NOT NULL DEFAULT '1',
  `data_hora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `remetente` (`remetente`),
  KEY `destinatario` (`destinatario`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=275 ;

--
-- Extraindo dados da tabela `chat`
--

INSERT INTO `chat` (`id`, `msg`, `remetente`, `destinatario`, `nivel_destinatario`, `nivel_remetente`, `alert`, `data_hora`) VALUES
(118, 'oi burro?', 1, 4, 2, 1, 0, '2015-12-12 02:21:36'),
(119, 'como vai vc?', 1, 4, 2, 1, 0, '2015-12-12 02:35:33'),
(120, 'esta bém filho?', 1, 4, 2, 1, 0, '2015-12-12 02:35:48'),
(121, 'mas dede', 1, 4, 2, 1, 0, '2015-12-12 02:37:16'),
(122, 'oi', 1, 4, 2, 1, 0, '2015-12-12 02:37:28'),
(123, 'cara não sei porq isso esta acontecendo?', 1, 4, 2, 1, 0, '2015-12-12 02:37:46'),
(124, 'eai velho?', 4, 1, 1, 2, 0, '2015-12-12 02:40:45'),
(125, 'zuadão', 1, 4, 2, 1, 0, '2015-12-12 02:44:36'),
(126, 'oi', 1, 4, 2, 1, 0, '2015-12-12 03:41:55'),
(127, 'ola como vai vc?', 1, 4, 2, 1, 0, '2015-12-12 03:47:57'),
(128, 'eai carinha que mora logo ali', 4, 1, 1, 2, 0, '2015-12-12 04:00:42'),
(129, 'oi', 4, 1, 1, 2, 0, '2015-12-12 04:01:34'),
(130, 'eai velhinho', 1, 4, 2, 1, 0, '2015-12-12 04:01:59'),
(131, 'eai cliente 2', 1, 4, 2, 1, 0, '2015-12-12 04:02:56'),
(132, 'eai mané?', 4, 1, 1, 2, 0, '2015-12-12 04:03:10'),
(133, 'como anda as coisas por ai?', 4, 1, 1, 2, 0, '2015-12-12 04:03:38'),
(134, 'eai carinha que mora logo ali?', 4, 1, 1, 2, 0, '2015-12-12 04:06:37'),
(135, 'eai vai falar ou vai ficar ai enrrolando?', 1, 4, 2, 1, 0, '2015-12-12 04:07:06'),
(136, 'como assim?', 4, 1, 1, 2, 0, '2015-12-12 04:07:22'),
(137, 'queria saber se posso trazer as peças de hoje?', 1, 4, 2, 1, 0, '2015-12-12 04:07:51'),
(138, 'vc que sabe', 1, 4, 2, 1, 0, '2015-12-12 04:08:06'),
(139, 'mas fala mas', 1, 4, 2, 1, 0, '2015-12-12 04:08:43'),
(140, 'eai cara', 1, 5, 1, 1, 0, '2015-12-12 04:10:36'),
(141, 'eai cara', 1, 4, 2, 1, 0, '2015-12-12 04:10:51'),
(142, 'eai', 4, 1, 1, 2, 0, '2015-12-12 04:11:59'),
(143, 'vai vir aqui em casa?', 4, 1, 1, 2, 0, '2015-12-12 04:14:46'),
(144, 'sim', 1, 4, 2, 1, 0, '2015-12-12 04:15:11'),
(145, 'como está indo sua avo?', 4, 1, 1, 2, 0, '2015-12-12 04:15:47'),
(146, 'cara vou te falar uma coisa, e vc não vai acreditar no eu fa', 1, 4, 2, 1, 0, '2015-12-12 04:18:08'),
(147, 'como esta sua avó filho?', 1, 4, 2, 1, 0, '2015-12-12 04:20:51'),
(148, 'eai', 1, 4, 2, 1, 0, '2015-12-12 04:40:59'),
(149, 'eai fala alhuma coisa', 1, 4, 2, 1, 0, '2015-12-12 04:42:58'),
(150, 'cara essa bosta parece que esta travando?', 4, 1, 1, 2, 0, '2015-12-12 04:43:31'),
(151, 'oque que eu faço para melhorar', 4, 1, 1, 2, 0, '2015-12-12 04:44:27'),
(152, 'muito scrotot', 4, 1, 1, 2, 0, '2015-12-12 04:44:54'),
(153, 'parece que agora focou melhor a perfomace?', 4, 1, 1, 2, 0, '2015-12-12 04:46:28'),
(154, 'apenas cinco ultimas', 4, 1, 1, 2, 0, '2015-12-12 04:47:03'),
(155, 'eai cara', 1, 4, 2, 1, 0, '2015-12-12 05:23:21'),
(156, 'minha como vc é feio!', 1, 4, 2, 1, 0, '2015-12-12 05:24:41'),
(157, 'feio é tua madrinha!', 4, 1, 1, 2, 0, '2015-12-12 05:25:25'),
(158, 'caraca muleque', 4, 1, 1, 2, 0, '2015-12-12 05:30:12'),
(159, 'eai elton?', 2, 1, 1, 2, 0, '2015-12-12 16:29:33'),
(160, 'o cara não responde', 2, 4, 2, 2, 0, '2015-12-12 16:41:40'),
(161, 'responde', 2, 1, 1, 2, 0, '2015-12-12 16:41:55'),
(162, 'eai tudo bem?', 1, 4, 2, 1, 0, '2015-12-13 03:16:29'),
(163, 'ola mundo', 1, 4, 2, 1, 0, '2015-12-13 03:16:57'),
(164, 'oi cliente2', 1, 4, 2, 1, 0, '2015-12-15 01:08:30'),
(165, 'eai besta', 4, 1, 1, 2, 0, '2015-12-15 02:17:11'),
(166, 'besta vc', 1, 4, 2, 1, 0, '2015-12-15 02:18:05'),
(167, 'responde ai', 1, 4, 2, 1, 0, '2015-12-15 02:19:00'),
(168, 'eai muleque', 4, 1, 1, 2, 0, '2015-12-15 02:19:11'),
(169, 'eai oqu', 1, 4, 2, 1, 0, '2015-12-15 02:19:20'),
(170, 'caraca', 4, 1, 1, 2, 0, '2015-12-15 02:19:43'),
(171, 'eai ferrado', 4, 1, 1, 2, 0, '2015-12-15 03:00:24'),
(172, 'caraca', 1, 4, 2, 1, 0, '2015-12-15 03:03:52'),
(173, 'kkkk', 4, 1, 1, 2, 0, '2015-12-15 03:04:04'),
(174, 'buoo', 1, 4, 2, 1, 0, '2015-12-15 03:05:18'),
(175, 'eai bixo', 4, 1, 1, 2, 0, '2015-12-15 03:25:31'),
(176, 'eai tonto', 4, 1, 1, 2, 0, '2015-12-15 03:30:22'),
(177, 'eai besta', 4, 1, 1, 2, 0, '2015-12-15 03:31:22'),
(178, 'eai carinha', 1, 4, 2, 1, 0, '2015-12-15 03:37:57'),
(179, 'oi', 1, 4, 2, 1, 0, '2015-12-15 03:46:43'),
(180, 'eai velhinho', 4, 1, 1, 2, 0, '2015-12-15 04:02:17'),
(181, 'qual é velhinho', 1, 4, 2, 1, 0, '2015-12-15 04:03:45'),
(182, 'ssdad', 4, 1, 1, 2, 0, '2015-12-15 04:06:18'),
(183, 'eai velhinho', 1, 4, 2, 1, 0, '2015-12-15 04:07:52'),
(184, 'eai', 1, 4, 2, 1, 0, '2015-12-15 04:09:09'),
(185, 'eai', 1, 4, 2, 1, 0, '2015-12-15 04:11:13'),
(186, 'jkkjjk', 1, 4, 2, 1, 0, '2015-12-15 04:12:39'),
(187, 'eai troxa', 4, 1, 1, 2, 0, '2015-12-15 04:23:51'),
(188, 'eai gay', 1, 4, 2, 1, 0, '2015-12-15 04:24:03'),
(189, 'que safado', 1, 4, 2, 1, 0, '2015-12-15 04:32:48'),
(190, 'eai cavalo', 4, 1, 1, 2, 0, '2015-12-15 04:33:12'),
(191, 'vai fggg', 1, 4, 2, 1, 0, '2015-12-15 04:33:24'),
(192, 'que horror', 1, 4, 2, 1, 0, '2015-12-15 04:38:05'),
(193, 'opa', 1, 4, 2, 1, 0, '2015-12-15 04:39:26'),
(194, 'fffgfgf', 1, 4, 2, 1, 0, '2015-12-15 04:40:09'),
(195, 'agora sim', 1, 4, 2, 1, 0, '2015-12-15 04:40:25'),
(196, 'agora sim', 1, 4, 2, 1, 0, '2015-12-15 04:40:39'),
(197, 'mas que droga', 1, 4, 2, 1, 0, '2015-12-15 04:40:50'),
(198, 'funciona ou não funciona?', 1, 4, 2, 1, 0, '2015-12-15 04:41:13'),
(199, 'esquesito', 1, 4, 2, 1, 0, '2015-12-15 04:41:46'),
(200, 'zasfasfsa', 1, 4, 2, 1, 0, '2015-12-15 04:41:51'),
(201, 'afsafasfasfasfsaf', 1, 4, 2, 1, 0, '2015-12-15 04:41:55'),
(202, 'zzzzzzzzzzzzz', 1, 4, 2, 1, 0, '2015-12-15 04:42:00'),
(203, 'xxxxxxxxxxxxxxxx', 1, 4, 2, 1, 0, '2015-12-15 04:42:03'),
(204, 'ccccccccccccccccccc', 1, 4, 2, 1, 0, '2015-12-15 04:42:07'),
(205, 'vvvvvvvvvvvvvvvvvvvvvvvvv', 1, 4, 2, 1, 0, '2015-12-15 04:42:11'),
(206, 'esse negocio demora para atualizar', 1, 4, 2, 1, 0, '2015-12-15 04:43:57'),
(207, 'porq', 1, 4, 2, 1, 0, '2015-12-15 04:44:06'),
(208, 'legalzingo mas nem tanto', 1, 4, 2, 1, 0, '2015-12-15 04:44:15'),
(209, 'é uma merdinha isso sim', 1, 4, 2, 1, 0, '2015-12-15 04:44:28'),
(210, 'eai sua besta quadrada', 4, 4, 2, 2, 0, '2015-12-15 22:04:48'),
(211, 'cha ma', 1, 4, 2, 1, 0, '2015-12-15 22:14:43'),
(212, 'eai burrao', 4, 2, 2, 2, 0, '2015-12-15 22:15:41'),
(213, 'fala velhinho', 1, 4, 2, 1, 0, '2015-12-15 22:15:52'),
(214, 'eai merdinha', 1, 5, 1, 1, 1, '2015-12-15 22:20:01'),
(215, 'eai merdinha', 1, 4, 2, 1, 0, '2015-12-15 22:20:41'),
(216, 'merniha sua avozinha', 4, 1, 1, 2, 0, '2015-12-15 22:21:10'),
(217, 'burrinho', 1, 4, 2, 1, 0, '2015-12-15 22:22:05'),
(218, 'eai burrinho?', 1, 4, 2, 1, 0, '2015-12-15 22:26:26'),
(219, 'seu passadis', 4, 1, 1, 2, 0, '2015-12-15 22:26:42'),
(220, 'ola mundo', 1, 4, 2, 1, 0, '2015-12-15 22:28:33'),
(221, 'progammer?', 4, 1, 1, 2, 0, '2015-12-15 22:28:48'),
(222, 'eai', 1, 4, 2, 1, 0, '2015-12-15 22:30:53'),
(223, 'eai oque/?', 4, 1, 1, 2, 0, '2015-12-15 22:31:15'),
(224, 'minha conversa', 1, 4, 2, 1, 0, '2015-12-15 23:17:45'),
(225, 'eai velho sonia', 1, 4, 2, 1, 0, '2015-12-15 23:21:25'),
(226, 'caraca', 1, 4, 2, 1, 0, '2015-12-15 23:23:38'),
(227, 'como assim', 1, 4, 2, 1, 0, '2015-12-15 23:29:14'),
(228, 'ola mundo', 4, 1, 1, 2, 0, '2015-12-15 23:32:24'),
(229, 'oi', 1, 4, 2, 1, 0, '2015-12-15 23:52:52'),
(230, 'eai boizinho', 4, 1, 1, 2, 0, '2015-12-15 23:54:13'),
(231, 'eai boiolinha', 1, 4, 2, 1, 0, '2015-12-15 23:54:47'),
(232, 'oque', 4, 1, 1, 2, 0, '2015-12-15 23:54:55'),
(233, 'kkkk', 1, 4, 2, 1, 0, '2015-12-15 23:55:11'),
(234, 'eai cliente2', 2, 4, 2, 2, 0, '2015-12-15 23:55:27'),
(235, 'eai master?', 2, 1, 1, 2, 0, '2015-12-15 23:56:21'),
(236, 'eai doido', 1, 2, 2, 1, 0, '2015-12-16 00:14:36'),
(237, 'fala ae', 1, 5, 1, 1, 1, '2015-12-16 00:15:16'),
(238, 'oi', 1, 5, 1, 1, 1, '2015-12-16 00:17:17'),
(239, 'eai', 4, 1, 1, 2, 0, '2015-12-16 00:19:36'),
(240, 'FAÇA', 2, 5, 1, 2, 1, '2015-12-16 00:22:54'),
(241, 'FAÇA', 2, 1, 1, 2, 0, '2015-12-16 00:26:20'),
(242, 'EAI VELHO', 4, 1, 1, 2, 0, '2015-12-16 00:28:28'),
(243, 'ow bosta responde', 2, 1, 1, 2, 0, '2015-12-16 01:10:26'),
(244, 'eai', 2, 1, 1, 2, 0, '2015-12-16 01:11:13'),
(245, 'eai besta', 2, 1, 1, 2, 0, '2015-12-16 01:24:55'),
(246, 'fala ae', 2, 1, 1, 2, 0, '2015-12-16 01:26:39'),
(247, 'conversando com o cliente 2 na boa', 1, 4, 2, 1, 0, '2015-12-16 01:30:13'),
(248, 'eai velhinho', 4, 1, 1, 2, 0, '2015-12-16 01:30:52'),
(249, 'mas d eboa?', 1, 4, 2, 1, 0, '2015-12-16 01:32:28'),
(250, 'eai valhinho', 2, 4, 2, 2, 0, '2015-12-16 01:32:50'),
(251, 'eai', 4, 1, 1, 2, 0, '2015-12-16 01:35:35'),
(252, 'ow interromp', 2, 1, 1, 2, 0, '2015-12-16 01:35:45'),
(253, 'sdasdsad', 1, 4, 2, 1, 0, '2015-12-16 01:36:52'),
(254, 'dasdsadsa', 2, 1, 1, 2, 0, '2015-12-16 01:37:08'),
(255, 'sadasfdsgddf', 2, 1, 1, 2, 0, '2015-12-16 01:37:16'),
(256, 'kkkkkk', 2, 1, 1, 2, 0, '2015-12-16 01:37:18'),
(257, 'eai velhinho', 1, 4, 2, 1, 0, '2015-12-16 02:47:19'),
(258, 'oi', 4, 1, 1, 2, 0, '2015-12-16 03:01:37'),
(259, 'eai', 1, 3, 3, 1, 0, '2015-12-16 23:11:07'),
(260, 'oi', 4, 1, 1, 2, 0, '2015-12-17 00:16:23'),
(261, 'como vai vc?', 4, 1, 1, 2, 0, '2015-12-17 00:17:11'),
(262, 'oi', 4, 1, 1, 2, 0, '2015-12-17 00:19:47'),
(263, 'eai velhinho', 4, 1, 1, 2, 0, '2015-12-17 01:19:31'),
(264, 'ola cliente 2', 1, 4, 2, 1, 0, '2015-12-23 23:41:50'),
(265, 'eai burro', 4, 1, 1, 2, 0, '2015-12-24 00:17:46'),
(266, 'eai', 1, 2, 2, 1, 0, '2015-12-24 02:43:02'),
(267, 'novo', 1, 4, 2, 1, 0, '2015-12-24 15:53:32'),
(268, 'eai sua velha', 3, 4, 2, 3, 0, '2015-12-25 23:31:00'),
(269, 'eai cliente1?', 1, 2, 2, 1, 0, '2015-12-26 02:57:36'),
(270, 'eai cara?', 2, 1, 1, 2, 0, '2015-12-26 02:58:00'),
(271, 'minha mensagem demoro', 1, 2, 2, 1, 0, '2015-12-26 02:58:22'),
(272, 'porque será?', 1, 2, 2, 1, 0, '2015-12-26 02:58:42'),
(273, 'velhinho', 2, 1, 1, 2, 0, '2015-12-26 03:00:19'),
(274, 'daasdasd', 1, 5, 1, 1, 1, '2015-12-26 21:43:11');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cidade`
--

CREATE TABLE IF NOT EXISTS `cidade` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) DEFAULT NULL,
  `uf_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cidade_FKIndex1` (`uf_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `cidade`
--

INSERT INTO `cidade` (`id`, `nome`, `uf_id`) VALUES
(1, 'Cuiabá', 1),
(2, 'Campo Grande', 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

CREATE TABLE IF NOT EXISTS `cliente` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uf_id` int(10) unsigned NOT NULL,
  `cidade_id` int(10) unsigned NOT NULL,
  `situacao_id` int(10) unsigned NOT NULL,
  `nome_fantasia` varchar(60) NOT NULL,
  `razao_social` varchar(60) DEFAULT NULL,
  `cpf_cnpj` varchar(20) DEFAULT NULL,
  `unidade` varchar(100) DEFAULT NULL,
  `site` varchar(100) DEFAULT NULL,
  `telefone` varchar(30) NOT NULL,
  `observacao` text,
  `pessoa` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_FKIndex1` (`situacao_id`),
  KEY `cliente_FKIndex2` (`cidade_id`),
  KEY `cliente_FKIndex3` (`uf_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`id`, `uf_id`, `cidade_id`, `situacao_id`, `nome_fantasia`, `razao_social`, `cpf_cnpj`, `unidade`, `site`, `telefone`, `observacao`, `pessoa`) VALUES
(1, 1, 1, 1, 'Mecanica do Juarez', 'Mecanica do Juarez SA', '88159815603', '', '', '14442414242', '', 'F');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente_usuario`
--

CREATE TABLE IF NOT EXISTS `cliente_usuario` (
  `usuario_id` int(10) unsigned NOT NULL,
  `cliente_id` int(10) unsigned NOT NULL,
  `ativo` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`usuario_id`,`cliente_id`),
  KEY `cliente_usuario_FKIndex1` (`usuario_id`),
  KEY `cliente_usuario_FKIndex2` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `cliente_usuario`
--

INSERT INTO `cliente_usuario` (`usuario_id`, `cliente_id`, `ativo`) VALUES
(2, 1, 1),
(4, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `configuracao`
--

CREATE TABLE IF NOT EXISTS `configuracao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `empresa` varchar(60) DEFAULT NULL,
  `smtp_host` varchar(60) DEFAULT NULL,
  `smtp_user` varchar(60) DEFAULT NULL,
  `smtp_pass` varchar(60) DEFAULT NULL,
  `smtp_port` int(10) unsigned DEFAULT NULL,
  `smtp_timeout` int(10) unsigned DEFAULT NULL,
  `myhost` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `configuracao`
--

INSERT INTO `configuracao` (`id`, `empresa`, `smtp_host`, `smtp_user`, `smtp_pass`, `smtp_port`, `smtp_timeout`, `myhost`) VALUES
(1, 'ewati', 'mail.ewati.com.br', 'contato@ewati.com.br', 'empresa21071985', 587, 5, '681fbc59b1e102e15ccf21bcbaf0499c');

-- --------------------------------------------------------

--
-- Estrutura da tabela `estabelecimento`
--

CREATE TABLE IF NOT EXISTS `estabelecimento` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uf_id` int(10) unsigned NOT NULL,
  `categoria_id` int(10) unsigned NOT NULL,
  `situacao_id` int(10) unsigned NOT NULL,
  `cidade_id` int(10) unsigned NOT NULL,
  `nome_fantasia` varchar(60) NOT NULL,
  `razao_social` varchar(60) DEFAULT NULL,
  `pessoa` varchar(1) NOT NULL,
  `cpf_cnpj` varchar(20) DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  `unidade` varchar(100) DEFAULT NULL,
  `site` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `complemento` varchar(300) DEFAULT NULL,
  `observacao` text,
  PRIMARY KEY (`id`),
  KEY `estabelecimento_FKIndex1` (`cidade_id`),
  KEY `estabelecimento_FKIndex2` (`situacao_id`),
  KEY `estabelecimento_FKIndex3` (`categoria_id`),
  KEY `estabelecimento_FKIndex4` (`uf_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `estabelecimento`
--

INSERT INTO `estabelecimento` (`id`, `uf_id`, `categoria_id`, `situacao_id`, `cidade_id`, `nome_fantasia`, `razao_social`, `pessoa`, `cpf_cnpj`, `telefone`, `unidade`, `site`, `bairro`, `complemento`, `observacao`) VALUES
(1, 1, 1, 1, 1, 'estabelecimento np3', 'np3', 'F', '99999999999', '21212421421', '231213212321213212', 'www.cidade.com', 'parque do lago', '', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `estabelecimento_usuario`
--

CREATE TABLE IF NOT EXISTS `estabelecimento_usuario` (
  `usuario_id` int(10) unsigned NOT NULL,
  `estabelecimento_id` int(10) unsigned NOT NULL,
  `ativo` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`usuario_id`,`estabelecimento_id`),
  KEY `estabelecimento_usuario_FKIndex1` (`usuario_id`),
  KEY `estabelecimento_usuario_FKIndex2` (`estabelecimento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `estabelecimento_usuario`
--

INSERT INTO `estabelecimento_usuario` (`usuario_id`, `estabelecimento_id`, `ativo`) VALUES
(3, 1, 1),
(6, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `grupo`
--

CREATE TABLE IF NOT EXISTS `grupo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoria_id` int(10) unsigned NOT NULL,
  `descricao` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `grupo_FKIndex1` (`categoria_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `grupo`
--

INSERT INTO `grupo` (`id`, `categoria_id`, `descricao`) VALUES
(1, 1, 'motor');

-- --------------------------------------------------------

--
-- Estrutura da tabela `item`
--

CREATE TABLE IF NOT EXISTS `item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `produto_id` bigint(20) DEFAULT NULL,
  `pedido_id` bigint(20) NOT NULL,
  `descricao` varchar(80) DEFAULT NULL,
  `quantidade` float DEFAULT NULL,
  `sugestao` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `item_FKIndex1` (`pedido_id`),
  KEY `item_FKIndex2` (`produto_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `item`
--

INSERT INTO `item` (`id`, `produto_id`, `pedido_id`, `descricao`, `quantidade`, `sugestao`) VALUES
(1, 2, 1, 'oleio de motor', 240, '1'),
(2, 1, 1, 'ventuinha', 3445, '1');

-- --------------------------------------------------------

--
-- Estrutura da tabela `item_orcamento`
--

CREATE TABLE IF NOT EXISTS `item_orcamento` (
  `item_id` bigint(20) NOT NULL,
  `orcamento_id` bigint(20) NOT NULL,
  `preco_unitario` decimal(11,2) NOT NULL,
  `tipo` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`item_id`,`orcamento_id`),
  KEY `item_orcamento_FKIndex1` (`item_id`),
  KEY `item_orcamento_FKIndex2` (`orcamento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `orcamento`
--

CREATE TABLE IF NOT EXISTS `orcamento` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `situacao_id` int(10) unsigned NOT NULL,
  `pedido_id` bigint(20) NOT NULL,
  `estabelecimento_id` int(10) unsigned NOT NULL,
  `data_resposta` timestamp NOT NULL,
  `prazo_entrega` int(10) unsigned NOT NULL,
  `sub_total_produto` decimal(11,2) DEFAULT NULL,
  `desconto_produto` float DEFAULT NULL,
  `total_produto` decimal(11,2) DEFAULT NULL,
  `sub_total_servico` decimal(11,2) DEFAULT NULL,
  `desconto_servico` float DEFAULT NULL,
  `total_servico` decimal(11,2) DEFAULT NULL,
  `sub_total` decimal(11,2) NOT NULL,
  `desconto` float NOT NULL,
  `valor_total` decimal(11,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orcamento_FKIndex1` (`estabelecimento_id`),
  KEY `orcamento_FKIndex2` (`pedido_id`),
  KEY `orcamento_FKIndex3` (`situacao_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedido`
--

CREATE TABLE IF NOT EXISTS `pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `veiculo_id` int(10) DEFAULT NULL,
  `estabelecimento_id` int(10) unsigned DEFAULT NULL,
  `categoria_id` int(10) unsigned NOT NULL,
  `situacao_id` int(10) unsigned NOT NULL,
  `cliente_id` int(10) unsigned NOT NULL,
  `usuario_criou` int(10) unsigned DEFAULT NULL,
  `usuario_aprovou` int(10) unsigned DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_aprovacao` timestamp NULL DEFAULT NULL,
  `data_finalizacao` timestamp NULL DEFAULT NULL,
  `observacao` varchar(80) NOT NULL,
  `motivo_cancelamento` varchar(200) DEFAULT NULL,
  `data_notificacao` timestamp NULL DEFAULT NULL,
  `notificacao` bigint(20) DEFAULT NULL,
  `placa` varchar(7) DEFAULT NULL,
  `chassi` varchar(20) DEFAULT NULL,
  `marca_modelo` varchar(60) DEFAULT NULL,
  `ano_fabricacao` int(4) unsigned DEFAULT NULL,
  `ano_modelo` int(4) unsigned DEFAULT NULL,
  `renavam` int(30) unsigned DEFAULT NULL,
  `servico` int(10) unsigned DEFAULT NULL,
  `inserir_item` int(10) unsigned DEFAULT NULL,
  `km` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orcamento_FKIndex1` (`cliente_id`),
  KEY `orcamento_FKIndex2` (`situacao_id`),
  KEY `pedido_FKIndex3` (`categoria_id`),
  KEY `pedido_FKIndex4` (`estabelecimento_id`),
  KEY `pedido_FKIndex5` (`usuario_criou`),
  KEY `pedido_FKIndex6` (`usuario_aprovou`),
  KEY `veiculo_id` (`veiculo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `pedido`
--

INSERT INTO `pedido` (`id`, `veiculo_id`, `estabelecimento_id`, `categoria_id`, `situacao_id`, `cliente_id`, `usuario_criou`, `usuario_aprovou`, `data_criacao`, `data_aprovacao`, `data_finalizacao`, `observacao`, `motivo_cancelamento`, `data_notificacao`, `notificacao`, `placa`, `chassi`, `marca_modelo`, `ano_fabricacao`, `ano_modelo`, `renavam`, `servico`, `inserir_item`, `km`) VALUES
(1, 2, 0, 1, 4, 1, 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'troca de oleo', '', '2015-11-23 02:36:15', 3, 'jzy5206', '2121221', 'moto cbx honda 250cc twistter', 2002, 2002, 121221212, 2, 1, 0),
(2, 2, 0, 1, 4, 1, 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'troca de peneu', '', '2015-11-23 02:36:25', 4, 'jzy5206', '2121221', 'moto cbx honda 250cc twistter', 2002, 2002, 121221212, 1, 1, 200);

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto`
--

CREATE TABLE IF NOT EXISTS `produto` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `grupo_id` int(10) unsigned NOT NULL,
  `categoria_id` int(10) unsigned NOT NULL,
  `sub_grupo_id` int(10) unsigned DEFAULT NULL,
  `codigo` varchar(60) DEFAULT NULL,
  `descricao` varchar(60) NOT NULL,
  `modelo` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `produto_FKIndex1` (`categoria_id`),
  KEY `produto_FKIndex2` (`grupo_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `produto`
--

INSERT INTO `produto` (`id`, `grupo_id`, `categoria_id`, `sub_grupo_id`, `codigo`, `descricao`, `modelo`) VALUES
(1, 1, 1, 1, '1221212', 'ventuinha', 'honda civic'),
(2, 1, 1, 2, NULL, 'oleio de motor', 'honda civic');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produto_preco`
--

CREATE TABLE IF NOT EXISTS `produto_preco` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `estabelecimento_id` int(10) unsigned NOT NULL,
  `produto_id` bigint(20) NOT NULL,
  `preco_unitario` decimal(11,2) NOT NULL,
  `data_fabricacao` date DEFAULT NULL,
  `estoque` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `produto_preco_FKIndex1` (`produto_id`),
  KEY `produto_preco_FKIndex2` (`estabelecimento_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `produto_preco`
--

INSERT INTO `produto_preco` (`id`, `estabelecimento_id`, `produto_id`, `preco_unitario`, `data_fabricacao`, `estoque`) VALUES
(1, 1, 1, '21.22', '2015-11-30', 221),
(2, 1, 2, '44.44', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `situacao`
--

CREATE TABLE IF NOT EXISTS `situacao` (
  `id` int(10) unsigned NOT NULL,
  `descricao` varchar(30) DEFAULT NULL,
  `nivel` int(10) unsigned DEFAULT NULL,
  `observação` text,
  `ativo` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `situacao`
--

INSERT INTO `situacao` (`id`, `descricao`, `nivel`, `observação`, `ativo`) VALUES
(1, 'Ativo', 1, 'Todos os ativos tem permissão de interagir com os orçamento.', 1),
(2, 'Inadimplente', 1, 'Usuários inadimplentes não podem interagir com o sistema', 1),
(3, 'Enviado/Em Aberto', 3, 'Orçamento que acaba se ser cadatrado pelo cliente.', 1),
(4, 'Cancelado', 3, 'Orçamento que acaba se ser Cancelado pelo cliente.', 1),
(5, 'Aprovado', 3, 'Orçamento que acaba se ser aprovado pelo cliente', 1),
(6, 'Aguardando Aprovação', 3, 'Orçamento Aguardando aprovação do cliente. Já tem no minio 1 orçamento respondido.', 1),
(7, 'Finalizado', 3, 'Oramento já concluido a transação de compra e venda', 1),
(10, 'Em cadastramento', 3, 'Quando o usuario ainda pode fazer as mudanças no pedido.', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `sub_grupo`
--

CREATE TABLE IF NOT EXISTS `sub_grupo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `categoria_id` int(10) unsigned NOT NULL,
  `grupo_id` int(10) unsigned NOT NULL,
  `descricao` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_grupo_FKIndex1` (`grupo_id`),
  KEY `sub_grupo_FKIndex2` (`categoria_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `sub_grupo`
--

INSERT INTO `sub_grupo` (`id`, `categoria_id`, `grupo_id`, `descricao`) VALUES
(1, 1, 1, 'Pecas paralelas'),
(2, 1, 1, 'Peças Originais');

-- --------------------------------------------------------

--
-- Estrutura da tabela `uf`
--

CREATE TABLE IF NOT EXISTS `uf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(60) DEFAULT NULL,
  `sigla` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `uf`
--

INSERT INTO `uf` (`id`, `nome`, `sigla`) VALUES
(1, 'Mato Grosso', 'MT'),
(2, 'Mato Grosso do Sul', 'MS');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `senha` varchar(200) NOT NULL,
  `nivel` int(10) unsigned NOT NULL,
  `token` varchar(200) NOT NULL,
  `src_foto` varchar(500) DEFAULT NULL,
  `online` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `email`, `senha`, `nivel`, `token`, `src_foto`, `online`) VALUES
(1, 'elton', 'master', 'f126478044da9711a228ce18f01a0e0b', 1, 'f126478044da9711a228ce18f01a0e0b', '../media/7ac1b26e94f3166d1d56a2bea7f84989/a332662c042f94d99accf3ed1f88b129.jpg', 0),
(2, 'cliente1', 'cliente1', 'f126478044da9711a228ce18f01a0e0b', 2, '97118c6a02190a28dd76ab37393e31b9', '../media/65ba56dfc4eccf47844cccf70ee9e146/fe80c940d7b8bbf4431c96e15e8d4d3b.jpg', 0),
(3, 'estabelecimento1', 'estabelecimento1', 'f126478044da9711a228ce18f01a0e0b', 3, '3e6ca686d1d1296e21e0d66acc97c37c', '../media/f0b09ab53ccba6b2baae625484698067/fc8237190e2a5afa911f1934d0dd69dc.jpg', 0),
(4, 'CLIENTE2', 'cliente2', 'f126478044da9711a228ce18f01a0e0b', 2, 'a726249da335b1cdfc5f6736ee413169', '../media/6ab7f00ed9640afbd9045203b43606dd/178cac28b7a351b36a03e5cc5bcdea8c.jpg', 0),
(5, 'master2', 'master@hotmail.com', 'f126478044da9711a228ce18f01a0e0b', 1, '269623c69b55f6f76a7242c7b6017ed5', '../media/4bdcd259b9cd8e3a2e2571511ed78a1f/d38fd280b74f80c1cb7275bad96413b3.jpg', 0),
(6, 'estabelecimento2', 'estabelecimento2', 'f126478044da9711a228ce18f01a0e0b', 3, 'ad8edf9ff3996a9de7dc87d37a1524ae', '../media/b9df7459702645abe62174e719311e22/d459c9c29ea4cdf504f304405463aec6.jpg', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `veiculo`
--

CREATE TABLE IF NOT EXISTS `veiculo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cliente_id` int(10) unsigned NOT NULL,
  `placa` varchar(10) NOT NULL,
  `marca_modelo` varchar(60) NOT NULL,
  `ano_fabricacao` int(4) unsigned NOT NULL,
  `ano_modelo` int(4) unsigned NOT NULL,
  `chassi` int(10) unsigned DEFAULT NULL,
  `renavam` int(30) unsigned DEFAULT NULL,
  `ativo` char(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `veiculo_FKIndex1` (`cliente_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `veiculo`
--

INSERT INTO `veiculo` (`id`, `cliente_id`, `placa`, `marca_modelo`, `ano_fabricacao`, `ano_modelo`, `chassi`, `renavam`, `ativo`) VALUES
(1, 1, 'ssa3232', '3232rdsadf', 2221, 1213, 1233212132, 2122231, '1'),
(2, 1, 'jzy5206', 'moto cbx honda 250cc twistter', 2002, 2002, 2121221, 121221212, '1');

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `fk_chat_remetente` FOREIGN KEY (`remetente`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
