CREATE TABLE configuracao (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  empresa VARCHAR(60) NULL,
  smtp_host VARCHAR(60) NULL,
  smtp_user VARCHAR(60) NULL,
  smtp_pass VARCHAR(60) NULL,
  smtp_port INTEGER UNSIGNED NULL,
  smtp_timeout INTEGER UNSIGNED NULL,
  myhost VARCHAR(60) NULL,
  PRIMARY KEY(id)
);

CREATE TABLE usuario (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL,
  email VARCHAR(40) NOT NULL,
  senha VARCHAR(200) NOT NULL,
  nivel INTEGER UNSIGNED NOT NULL,
  token VARCHAR(200) NOT NULL,
  foto VARCHAR(500) NULL,
  PRIMARY KEY(id)
);

CREATE TABLE situacao (
  id INTEGER UNSIGNED NOT NULL,
  descricao VARCHAR(30) NULL,
  nivel INTEGER UNSIGNED NULL,
  observação TEXT NULL,
  ativo INTEGER UNSIGNED NULL,
  PRIMARY KEY(id)
);

CREATE TABLE uf (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(60) NULL,
  sigla VARCHAR(2) NULL,
  PRIMARY KEY(id)
);

CREATE TABLE chat (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  msg VARCHAR(25) NULL,
  remetente INTEGER UNSIGNED NULL,
  alert INTEGER UNSIGNED NULL,
  data_hora TIMESTAMP NULL,
  destinatario INTEGER UNSIGNED NULL,
  PRIMARY KEY(id)
);

CREATE TABLE categoria (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(100) NULL,
  ativo INTEGER UNSIGNED NULL,
  PRIMARY KEY(id)
);

-- ------------------------------------------------------------
-- Pode se colocar o Carro, gol, celta astra..
-- ------------------------------------------------------------

CREATE TABLE grupo (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  categoria_id INTEGER UNSIGNED NOT NULL,
  descricao VARCHAR(60) NOT NULL,
  PRIMARY KEY(id),
  INDEX grupo_FKIndex1(categoria_id),
  FOREIGN KEY(categoria_id)
    REFERENCES categoria(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE cidade (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NULL,
  uf_id INTEGER UNSIGNED NULL,
  PRIMARY KEY(id),
  INDEX cidade_FKIndex1(uf_id),
  FOREIGN KEY(uf_id)
    REFERENCES uf(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE produto (
  id BIGINT NOT NULL AUTO_INCREMENT,
  grupo_id INTEGER UNSIGNED NOT NULL,
  categoria_id INTEGER UNSIGNED NOT NULL,
  sub_grupo_id INTEGER UNSIGNED NULL,
  codigo VARCHAR(60) NULL,
  descricao VARCHAR(60) NOT NULL,
  modelo VARCHAR(60) NULL,
  PRIMARY KEY(id),
  INDEX produto_FKIndex1(categoria_id),
  INDEX produto_FKIndex2(grupo_id),
  FOREIGN KEY(categoria_id)
    REFERENCES categoria(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(grupo_id)
    REFERENCES grupo(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

-- ------------------------------------------------------------
-- grupo ao qual o produto pertence;
-- Para-choque
-- ------------------------------------------------------------

CREATE TABLE sub_grupo (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  categoria_id INTEGER UNSIGNED NOT NULL,
  grupo_id INTEGER UNSIGNED NOT NULL,
  descricao VARCHAR(60) NULL,
  PRIMARY KEY(id),
  INDEX sub_grupo_FKIndex1(grupo_id),
  INDEX sub_grupo_FKIndex2(categoria_id),
  FOREIGN KEY(grupo_id)
    REFERENCES grupo(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(categoria_id)
    REFERENCES categoria(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE cliente (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  uf_id INTEGER UNSIGNED NOT NULL,
  cidade_id INTEGER UNSIGNED NOT NULL,
  situacao_id INTEGER UNSIGNED NOT NULL,
  nome_fantasia VARCHAR(60) NOT NULL,
  razao_social VARCHAR(60) NULL,
  cpf_cnpj VARCHAR(20) NULL,
  unidade VARCHAR(100) NULL,
  site VARCHAR(100) NULL,
  telefone VARCHAR(30) NOT NULL,
  observacao TEXT NULL,
  pessoa VARCHAR(1) NULL,
  PRIMARY KEY(id),
  INDEX cliente_FKIndex1(situacao_id),
  INDEX cliente_FKIndex2(cidade_id),
  INDEX cliente_FKIndex3(uf_id),
  FOREIGN KEY(situacao_id)
    REFERENCES situacao(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(cidade_id)
    REFERENCES cidade(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(uf_id)
    REFERENCES uf(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE estabelecimento (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  uf_id INTEGER UNSIGNED NOT NULL,
  categoria_id INTEGER UNSIGNED NOT NULL,
  situacao_id INTEGER UNSIGNED NOT NULL,
  cidade_id INTEGER UNSIGNED NOT NULL,
  nome_fantasia VARCHAR(60) NOT NULL,
  razao_social VARCHAR(60) NULL,
  pessoa VARCHAR(1) NOT NULL,
  cpf_cnpj VARCHAR(20) NULL,
  telefone VARCHAR(20) NOT NULL,
  unidade VARCHAR(100) NULL,
  site VARCHAR(100) NULL,
  bairro VARCHAR(100) NULL,
  complemento VARCHAR(300) NULL,
  observacao TEXT NULL,
  PRIMARY KEY(id),
  INDEX estabelecimento_FKIndex1(cidade_id),
  INDEX estabelecimento_FKIndex2(situacao_id),
  INDEX estabelecimento_FKIndex3(categoria_id),
  INDEX estabelecimento_FKIndex4(uf_id),
  FOREIGN KEY(cidade_id)
    REFERENCES cidade(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(situacao_id)
    REFERENCES situacao(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(categoria_id)
    REFERENCES categoria(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(uf_id)
    REFERENCES uf(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE veiculo (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  cliente_id INTEGER UNSIGNED NOT NULL,
  placa VARCHAR(10) NOT NULL,
  marca_modelo VARCHAR(60) NOT NULL,
  ano_fabricacao INTEGER(4) UNSIGNED NOT NULL,
  ano_modelo INTEGER(4) UNSIGNED NOT NULL,
  chassi INTEGER UNSIGNED NULL,
  renavam INTEGER(30) UNSIGNED NULL,
  ativo CHAR(1) NULL,
  PRIMARY KEY(id),
  INDEX veiculo_FKIndex1(cliente_id),
  FOREIGN KEY(cliente_id)
    REFERENCES cliente(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE produto_preco (
  id BIGINT NOT NULL AUTO_INCREMENT,
  estabelecimento_id INTEGER UNSIGNED NOT NULL,
  produto_id BIGINT NOT NULL,
  preco_unitario DECIMAL(11,2) NOT NULL,
  data_fabricacao DATE NULL,
  estoque FLOAT NULL,
  PRIMARY KEY(id),
  INDEX produto_preco_FKIndex1(produto_id),
  INDEX produto_preco_FKIndex2(estabelecimento_id),
  FOREIGN KEY(produto_id)
    REFERENCES produto(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(estabelecimento_id)
    REFERENCES estabelecimento(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE estabelecimento_usuario (
  usuario_id INTEGER UNSIGNED NOT NULL,
  estabelecimento_id INTEGER UNSIGNED NOT NULL,
  ativo INTEGER UNSIGNED NULL,
  PRIMARY KEY(usuario_id, estabelecimento_id),
  INDEX estabelecimento_usuario_FKIndex1(usuario_id),
  INDEX estabelecimento_usuario_FKIndex2(estabelecimento_id),
  FOREIGN KEY(usuario_id)
    REFERENCES usuario(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(estabelecimento_id)
    REFERENCES estabelecimento(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE cliente_usuario (
  usuario_id INTEGER UNSIGNED NOT NULL,
  cliente_id INTEGER UNSIGNED NOT NULL,
  ativo INTEGER UNSIGNED NULL,
  PRIMARY KEY(usuario_id, cliente_id),
  INDEX cliente_usuario_FKIndex1(usuario_id),
  INDEX cliente_usuario_FKIndex2(cliente_id),
  FOREIGN KEY(usuario_id)
    REFERENCES usuario(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(cliente_id)
    REFERENCES cliente(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE pedido (
  id BIGINT NOT NULL AUTO_INCREMENT,
  veiculo_id INTEGER UNSIGNED NULL,
  estabelecimento_id INTEGER UNSIGNED NULL,
  categoria_id INTEGER UNSIGNED NOT NULL,
  situacao_id INTEGER UNSIGNED NOT NULL,
  cliente_id INTEGER UNSIGNED NOT NULL,
  usuario_criou INTEGER UNSIGNED NULL,
  usuario_aprovou INTEGER UNSIGNED NULL,
  data_criacao TIMESTAMP NOT NULL,
  data_aprovacao TIMESTAMP NULL,
  data_finalizacao TIMESTAMP NULL,
  observacao VARCHAR(80) NOT NULL,
  motivo_cancelamento VARCHAR(200) NULL,
  data_notificacao TIMESTAMP NULL,
  notificacao BIGINT NULL,
  placa VARCHAR(7) NULL,
  chassi VARCHAR(20) NULL,
  marca_modelo VARCHAR(60) NULL,
  ano_fabricacao INTEGER(4) UNSIGNED NULL,
  ano_modelo INTEGER(4) UNSIGNED NULL,
  renavam INTEGER(30) UNSIGNED NULL,
  servico INTEGER UNSIGNED NULL,
  inserir_item INTEGER UNSIGNED NULL,
  km FLOAT NULL,
  PRIMARY KEY(id),
  INDEX orcamento_FKIndex1(cliente_id),
  INDEX orcamento_FKIndex2(situacao_id),
  INDEX pedido_FKIndex3(categoria_id),
  INDEX pedido_FKIndex4(estabelecimento_id),
  INDEX pedido_FKIndex5(usuario_criou),
  INDEX pedido_FKIndex6(usuario_aprovou),
  INDEX pedido_FKIndex7(veiculo_id),
  FOREIGN KEY(cliente_id)
    REFERENCES cliente(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(situacao_id)
    REFERENCES situacao(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(categoria_id)
    REFERENCES categoria(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(estabelecimento_id)
    REFERENCES estabelecimento(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(usuario_criou)
    REFERENCES usuario(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(usuario_aprovou)
    REFERENCES usuario(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(veiculo_id)
    REFERENCES veiculo(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE item (
  id BIGINT NOT NULL AUTO_INCREMENT,
  produto_id BIGINT NULL,
  pedido_id BIGINT NOT NULL,
  descricao VARCHAR(80) NULL,
  quantidade FLOAT NULL,
  sugestao CHAR(1) NULL,
  PRIMARY KEY(id),
  INDEX item_FKIndex1(pedido_id),
  INDEX item_FKIndex2(produto_id),
  FOREIGN KEY(pedido_id)
    REFERENCES pedido(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(produto_id)
    REFERENCES produto(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE orcamento (
  id BIGINT NOT NULL AUTO_INCREMENT,
  situacao_id INTEGER UNSIGNED NOT NULL,
  pedido_id BIGINT NOT NULL,
  estabelecimento_id INTEGER UNSIGNED NOT NULL,
  data_resposta TIMESTAMP NOT NULL,
  prazo_entrega INTEGER UNSIGNED NOT NULL,
  sub_total_produto DECIMAL(11,2) NULL,
  desconto_produto FLOAT NULL,
  total_produto DECIMAL(11,2) NULL,
  sub_total_servico DECIMAL(11,2) NULL,
  desconto_servico FLOAT NULL,
  total_servico DECIMAL(11,2) NULL,
  sub_total DECIMAL(11,2) NOT NULL,
  desconto FLOAT NOT NULL,
  valor_total DECIMAL(11,2) NOT NULL,
  PRIMARY KEY(id),
  INDEX orcamento_FKIndex1(estabelecimento_id),
  INDEX orcamento_FKIndex2(pedido_id),
  INDEX orcamento_FKIndex3(situacao_id),
  FOREIGN KEY(estabelecimento_id)
    REFERENCES estabelecimento(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(pedido_id)
    REFERENCES pedido(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(situacao_id)
    REFERENCES situacao(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);

CREATE TABLE item_orcamento (
  item_id BIGINT NOT NULL,
  orcamento_id BIGINT NOT NULL,
  preco_unitario DECIMAL(11,2) NOT NULL,
  tipo INTEGER UNSIGNED NULL,
  PRIMARY KEY(item_id, orcamento_id),
  INDEX item_orcamento_FKIndex1(item_id),
  INDEX item_orcamento_FKIndex2(orcamento_id),
  FOREIGN KEY(item_id)
    REFERENCES item(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
  FOREIGN KEY(orcamento_id)
    REFERENCES orcamento(id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
);


