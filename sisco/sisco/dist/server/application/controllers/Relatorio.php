<?php

if (!defined('BASEPATH'))
   exit('No direct script access allowed');

class Relatorio extends CI_Controller {

   private function inicializarDA() {
      $this->load->model('DaRelatorio');
      $this->load->model('DaSituacao');
      $this->load->library('mpdf');
   }

   private function CarregaLovs() {
      $this->load->model('DaSituacao');
      $jsonSituacao = $this->getArrayToJson($this->DaSituacao->Buscar(3));
      return '{
              "situacao":' . $jsonSituacao . '					
              }';
   }

   public function Buscar() {
      $this->inicializarDA();
      $lovs = $this->CarregaLovs();
      echo $this->MontarObjetoRetornoJson(null, $lovs);
   }

   public function Filtrar() {
      $this->getPostArray();
      $this->inicializarDA();
      $sessao = $this->sessaoBuscar();
      $id = $this->BuscarIdDonoDoUsuario();
      $dados = $this->DaRelatorio->ListarDados($this->entidade, $sessao, $id);
      echo $this->MontarObjetoRetornoJson($this->getArrayToJson($dados));
   }

   public function RelatorioOrcamentoAprovado($pedidoId = null) {
      // faz consulta
      $this->inicializarDA();
      $pedidoOrcamento = $this->DaRelatorio->RelatorioOrcamentoAprovado($pedidoId);
      $produtos = $this->DaRelatorio->ItensDoOrcamentoAprovado($pedidoOrcamento ['orcamento_id'], 1);
      $servicos = $this->DaRelatorio->ItensDoOrcamentoAprovado($pedidoOrcamento ['orcamento_id'], 2);

      $nomeRelatorio = null; // Relatório de Orçamento Aprovado";
      // #########################################DADOS DO ESTABELECIMENTO############################################################
      if (strlen($pedidoOrcamento ['estabelecimento_fone']) == 10) {
         $telefone = $this->Mask($pedidoOrcamento ['estabelecimento_fone'], '(##) ####-####');
      } else {
         $telefone = $this->Mask($pedidoOrcamento ['estabelecimento_fone'], '(##) #####-####');
      }

      if (strlen($pedidoOrcamento ['estabelecimento_cpf_cnpj']) == 11) {
         $titulo = "CPF:";
         $cpf_cnpj = $this->Mask($pedidoOrcamento ['estabelecimento_cpf_cnpj'], '###.###.###-##');
      } else {
         $titulo = "CNPJ:";
         $cpf_cnpj = $this->Mask($pedidoOrcamento ['estabelecimento_cpf_cnpj'], '##.###.###/####-##');
      }
      $html = ' <!DOCTYPE html>'
              . '<html lang="pt" ng-app="app">'
              . '<head>'
              . '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'            
              . '</head>'
              . '<body>';

      $html .= "<table style='width: 100%'>
		<thead>
		<tr>
                <th colspan='3' style='text-align: center;border:solid 1px #BEBEBE;'>		
                  <p><h2>{$pedidoOrcamento ['estabelecimento']}</h2></p>
                  <p>{$pedidoOrcamento ['estabelecimento_endereco']} {$pedidoOrcamento ['estabelecimento_bairro']}</p>
                  <p>{$pedidoOrcamento ['estabelecimento_cidade']} - {$pedidoOrcamento ['estabelecimento_uf']}, Site: {$pedidoOrcamento['estabelecimento_site']}</p>
                  <p>$titulo $cpf_cnpj tefefone: $telefone</p>
                </th>		
                <th colspan='2' style='text-align: center;border-right:solid 1px  #BEBEBE;border-top:solid 1px  #BEBEBE;border-bottom:solid 1px #BEBEBE;padding:5px;'>		
                  <p><h3> Pedido N°</h3>{$pedidoOrcamento['pedido_id']}</p>				
                  <p>{$pedidoOrcamento['data_criacao']}</p>			
                </th>		
		</tr>				
		</thead>
		<tbody>
            <tr>
              <td colspan='5' style='text-align: center;'>
                  <h3>ORÇAMENTO Nº: {$pedidoOrcamento['orcamento_id']}</h3>
              </td>
            </tr>			
		<tr>";

      // #########################################DADOS DO CLIENTE##################################################################

      if (strlen($pedidoOrcamento ['cliente_fone']) == 10) {
         $telefone0 = $this->Mask($pedidoOrcamento ['cliente_fone'], '(##) ####-####');
      } else {
         $telefone0 = $this->Mask($pedidoOrcamento ['cliente_fone'], '(##) #####-####');
      }

      if (strlen($pedidoOrcamento ['cliente_cpf_cnpj']) == 11) {
         $cpf_cnpj0 = $this->Mask($pedidoOrcamento ['cliente_cpf_cnpj'], '###.###.###-##');
      } else {
         $cpf_cnpj0 = $this->Mask($pedidoOrcamento ['cliente_cpf_cnpj'], '##.###.###/####-##');
      }

      $html .= "<td colspan='5' style='text-align: center;background-color:#BEBEBE;'><h3>Dados do cliente</h3></td>
              </tr>		
              <tr>
                <td colspan='3'><strong>Nome:</strong>&nbsp;{$pedidoOrcamento ['cliente_razao']}</td>			
                <td colspan='2'><strong>Fone:</strong>&nbsp;$telefone0</td>
              </tr>
              <tr>
                <td colspan='3'><strong>Razão Social:</strong>&nbsp;{$pedidoOrcamento ['cliente_nome']}</td>
                <td colspan='2'><strong>Cidade-UF:</strong>&nbsp;{$pedidoOrcamento ['cliente_cidade']} - {$pedidoOrcamento ['cliente_uf']}</td>
              </tr>
              <tr>
                <td colspan='3'><strong>CPF/CNPJ:</strong>&nbsp;$cpf_cnpj0</td>
                <td colspan='2'><strong>Site:</strong>&nbsp;{$pedidoOrcamento['cliente_site']}</td>
              </tr>			
              <tr>
                <td colspan='3'><strong>Usuário Criou:</strong>&nbsp;{$pedidoOrcamento['usuario_criou']}</td>
                <td colspan='2'><strong>Usuário Aprovou:</strong>&nbsp;{$pedidoOrcamento['usuario_aprovou']}</td>
              </tr>
              <tr>
              <td colspan='4'><hr/></td>
              <tr>";

      // ##############################################DADOS DO VEÍCULO#####################################################################

      $html .= "<tr>
            <td colspan='5' style='text-align:center;background-color: #BEBEBE;'><h3>Dados do Veículo</h3></td>
            </tr>
            <tr>
            <td colspan='2'><strong>Marca/Modelo:</strong>&nbsp;{$pedidoOrcamento ['marca_modelo']}</td>
            <td colspan='1'><strong>Placa:</strong>&nbsp;{$pedidoOrcamento ['placa']}</td>
            <td colspan='2'><strong>Ano:</strong>&nbsp;{$pedidoOrcamento['ano_fabricacao']} / {$pedidoOrcamento['ano_modelo']}</td>
            </tr>
            <tr>
            <tr>
            <td colspan='2'><strong>Chassi:</strong>&nbsp;{$pedidoOrcamento ['chassi']}</td>
            <td colspan='1'><strong>Km:</strong>&nbsp;" . str_replace(",", ".", number_format($pedidoOrcamento ['km'])) . "</td>
            <td colspan='2'><strong>Renavam:</strong>&nbsp;{$pedidoOrcamento ['renavam']}</td>				
            </tr>
            <tr><td colspan='5'><hr/></td></tr>";

      // #########################################################DADOS DO SERVICO#####################################################################
      $html .= "<tr>
                 <td colspan='5' style='text-align:center;background-color:#BEBEBE;'><h3>Dados do servico</h3></td>
              </tr>				
              <tr>
                 <td colspan='2'><strong>Descrição da solicitação:</strong>&nbsp;{$pedidoOrcamento ['observacao']}</td>
               </tr>
                    <tr>
                      <td colspan='2'><strong>Data aprovação:</strong>&nbsp;{$pedidoOrcamento['data_aprovacao']}</td>			
                      <td colspan='1'><strong>Prazo Entrega:</strong>&nbsp;{$pedidoOrcamento['prazo_entrega']} dias</td>
                      <td colspan='2'><strong>Categoria:</strong>&nbsp;{$pedidoOrcamento ['categoria']}</td>			
                    </tr>
               <tr><td colspan='5'><hr/></td></tr>";

      // ###########################################################RELA��O DE PRODUTOS################################################################

      $html .= "<tr>
		<td colspan='5' width='40%' style='text-align:center;background-color:#BEBEBE;'><h3>RELAÇÃO DE PRODUTOS</h3></td>					
              </tr>
              <tr>
                <td colspan='1' width='40%'  style='background-color:  #DCDCDC;'><strong>Descrião do Produto</strong></td>
                <td colspan='1' width='15%'  style='background-color:  #DCDCDC;'><strong>Qtd</strong></td>
                <td colspan='1' width='25%'  style='background-color:  #DCDCDC;'><strong>Vlr. Uni.</strong></td>
                <td colspan='1' width='30%'  style='background-color: #DCDCDC;'><strong>Vlr. Total</strong></td>
             </tr>";

      if ($produtos->num_rows > 1) {
         $contador = 0;
         foreach ($produtos->result_array() as $key => $item) {

            $valorUnitario = number_format($item ['preco_unitario'], 2, ',', '.');
            $valorTotal = number_format($item ['Total'], 2, ',', '.');

            if (($contador % 2) == 0) {
               $html .= "<tr>
                      <td colspan='1'>{$item ['descricao']}</td>
                      <td colspan='1'>{$item['quantidade']}</td>
                      <td colspan='1' align='right'>{$valorUnitario}</td>
                      <td colspan='1' align='right'>{$valorTotal}</td>
                      </tr>";
            } else {
               $html .= "<tr>
                        <td colspan='1' style='background-color: #F5F5F5;'>{$item ['descricao']}</td>
                        <td colspan='1' style='background-color: #F5F5F5;'>{$item['quantidade']}</td>
                        <td colspan='1' style='background-color: #F5F5F5' align='right'>{$valorUnitario}</td>
                        <td colspan='1' style='background-color: #F5F5F5' align='right'>{$valorTotal}</td>
                        </tr>";
            }
            $contador ++;
         }
      } else if ($produtos->num_rows == 1) {
         $item = $produtos->row_array();
         $html .= "<tr>
                  <td colspan='1'>{$item ['descricao']}</td>
                  <td colspan='1'>{$item['quantidade']}</td>
                  <td colspan='1' align='right'>" . number_format($item ['preco_unitario'], 2, ',', '.') . "</td>
                  <td colspan='1' align='right'>" . number_format($item ['Total'], 2, ',', '.') . "</td>
		</tr>";
      }

      $html .= "				
              <tr>
                <td colspan='5'  style='background-color:#DCDCDC;'><strong>sub total produto:</strong>&nbsp;" . number_format($pedidoOrcamento ['sub_total_produto'], 2, ',', '.') . "
                &nbsp;&nbsp;<strong>Desconto no produto:</strong>&nbsp;" . number_format($pedidoOrcamento ['desconto_produto'], 2, ',', '.') . "
                &nbsp;&nbsp;<strong>Total no produto:</strong>&nbsp;" . number_format($pedidoOrcamento ['total_produto'], 2, ',', '.') . "</td>
             </tr>";

      // ############################################################RELAÇÃO DE SERVICOS###########################################################################
      if ($servicos->num_rows > 1 || $servicos->num_rows == 1) {

         $html .= "<tr><td colspan='5'><hr/></td></tr>
                  <tr>
                      <td colspan='5' width='40%' style='text-align:center;background-color:#BEBEBE;'>
                      <h3>RELAÇÃO DE SERVIÇOS</h3></td>
                   </tr>
                <tr>
                  <td colspan='1' width='40%'  style='background-color:  #DCDCDC;'><strong>Descrição do Produto</strong></td>
                  <td colspan='1' width='15%'  style='background-color:  #DCDCDC;'><strong>Qtd</strong></td>
                  <td colspan='1' width='25%'  style='background-color:  #DCDCDC;'><strong>Vlr. Uni.</strong></td>
                  <td colspan='1' width='30%'  style='background-color:  #DCDCDC;'><strong>Vlr. Total</strong></td>
                </tr>";
      }

      if ($servicos->num_rows > 1) {
         $contador = 0;
         foreach ($servicos->result_array() as $key => $item) {

            $valorUnitario = number_format($item ['preco_unitario'], 2, ',', '.');
            $valorTotal = number_format($item ['Total'], 2, ',', '.');

            if (($contador % 2) == 0) {
               $html .= "<tr>
                      <td colspan='1' >{$item ['descricao']}</td>
                      <td colspan='1'>{$item['quantidade']}</td>
                      <td colspan='1' align='right'>{$valorUnitario}</td>
                      <td colspan='1' align='right'>{$valorTotal}</td>
		   </tr>";
            } else {
               $html .= "<tr>
                      <td colspan='1' style='background-color: #F5F5F5;'>{$item ['descricao']}</td>
                      <td colspan='1' style='background-color: #F5F5F5;'>{$item['quantidade']}</td>
                      <td colspan='1' style='background-color: #F5F5F5' align='right'>{$valorUnitario}</td>
                      <td colspan='1' style='background-color: #F5F5F5' align='right'>{$valorTotal}</td>
		    </tr>";
            }
            $contador ++;
         }
      } else if ($servicos->num_rows == 1) {
         $item = $servicos->row_array();
         $html .= "<tr>
                  <td colspan='1'>{$item ['descricao']}</td>
                  <td colspan='1'>{$item['quantidade']}</td>
                  <td colspan='1' align='right'>" . number_format($item ['preco_unitario'], 2, ',', '.') . "</td>
                  <td colspan='1' align='right'>" . number_format($item ['Total'], 2, ',', '.') . "</td>
		</tr>";
      }

      if ($servicos->num_rows > 1 || $servicos->num_rows == 1) {
         $html .= "<tr>
                  <td colspan='5'  style='background-color:#DCDCDC;'><strong>Sub total no serviço:</strong>&nbsp;" . number_format($pedidoOrcamento ['sub_total_servico'], 2, ',', '.') . "
                  &nbsp;&nbsp;<strong>Desconto no serviço:</strong>&nbsp;" . number_format($pedidoOrcamento ['desconto_servico'], 2, ',', '.') . "
                  &nbsp;&nbsp;<strong>Total no serviço:</strong>&nbsp;" . number_format($pedidoOrcamento ['total_servico'], 2, ',', '.') . "</td>
               </tr>";
      }

      // ##################################################TOTALIZADOR E RODAPE######################################################################################################################
      $html .= "<tr><td colspan='5'><hr/></td></tr>
                <tr>
                    <td colspan='1'></td>
                    <td colspan='1'></td>
                    <td colspan='1' align='right'><h4>SUBTOTAL:</h4></td>
                    <td colspan='1' align='right'><h4> " . number_format($pedidoOrcamento ['sub_total'], 2, ',', '.') . "</h4></td>
                </tr>
                <tr>				
                    <td colspan='1'></td>
                    <td colspan='2' align='right'><h4>DESCONTO EM PRODUTO:</h4></td>
                    <td colspan='1' align='right'  style='color: blue'><h4>" . number_format($pedidoOrcamento ['desconto_produto'], 2, ',', '.') . "</h4></td>
                </tr>
                <tr>
                  <td colspan='1'></td>
                  <td colspan='2' align='right'><h4>DESCONTO EM SERVIÇO:</h4></td>
                  <td colspan='1' align='right'  style='color: blue'><h4>" . number_format($pedidoOrcamento ['desconto_servico'], 2, ',', '.') . "</h4></td>
                </tr>
                <tr>
                  <td colspan='1'></td>
                  <td colspan='1'></td>
                  <td colspan='1' align='right'><h4>TOTAL:</h4></td>
                  <td colspan='1' align='right'  style='color: red'><h4>" . number_format($pedidoOrcamento ['valor_total'], 2, ',', '.') . "</h4></td>
                </tr>		
          </tbody>
          </table></body></html>";
      // gera Pdf
      $this->mpdf->GerarPdf($html, $nomeRelatorio);
   }

   //Teste
   public function ImprimirTodos() {
      $this->getPostArray();
      $this->inicializarDA();
      //$dados=$this->DaRelatorio->ListarDados ($this->entidade);

      $html = '<div style="position: absolute; left:0; right: 0; top: 0; bottom: 0;">
	    <img   style="width: 400px; height: 400px; margin: 0;" src="C:\Users\elton\Pictures\imagens pra site\desenvolvimento-de-softwares.jpg" /></div>';

      // gera Pdf
      $this->mpdf->GerarPdf($html, "Relatório", true);
   }

}
