# Bigood Refactor Phase 7 - Financeiro, Indicadores e Gestao

## Objetivo da fase

Refatorar a leitura financeira e gerencial do Bigood para que o dono da barbearia consiga enxergar recebido, pendente, assinaturas, ocupacao, ticket medio, clientes em atencao e desempenho por profissional, servico e plano sem depender de interpretacao manual.

## Decisoes tomadas

- O dashboard passou a priorizar indicadores gerenciais reais em vez de cards genericos.
- A tela financeira ganhou um bloco de leitura gerencial com recebido, pendente, assinaturas, clientes sem retorno e ocupacao da agenda.
- Comandas pagas entram como recebido.
- Comandas abertas, aguardando e parcialmente pagas entram como pendencia.
- Assinaturas ativas compoem MRR estimado.
- Assinaturas inadimplentes aparecem como alerta, nao como receita confirmada.
- Beneficios cobertos por plano aparecem separados de cobranças avulsas.
- Produtos, extras e descontos passaram a aparecer em leitura propria.

## Como o sistema diferencia recebido, pendente e aberto

- Recebido: comandas pagas, entradas manuais e movimentos confirmados.
- Pendente: comandas abertas, aguardando pagamento ou parcialmente pagas.
- Aberto: comanda em edicao ou aguardando fechamento operacional.
- Pagamento parcial nao e tratado como pago.
- Beneficio de plano nao e tratado como venda avulsa.

## Como comandas impactam indicadores

- Comandas pagas aumentam receita recebida.
- Comandas parcialmente pagas aumentam o pendente e a leitura de atencao.
- Comandas abertas permanecem fora de recebido.
- Itens cobertos por plano aparecem como abatimento ou consumo de beneficio, nao como receita nova.
- Itens extras e produtos entram como receita quando pagos.

## Como assinaturas impactam indicadores

- Assinaturas ativas compoem o MRR estimado.
- Assinaturas inadimplentes entram em alerta e na leitura de pendencia.
- Assinaturas pausadas, canceladas e expiradas nao entram como receita ativa.
- Beneficios reservados e consumidos seguem como leitura operacional, nao financeira.

## Como servicos, produtos e extras aparecem

- Servicos avulsos aparecem como receita operacional.
- Servicos cobertos por plano aparecem separados do faturamento avulso.
- Extras aparecem como cobranca adicional.
- Produtos aparecem como receita propria.
- Descontos aparecem como reducao explicita da leitura.

## Como profissionais aparecem

- Profissionais passam a ser lidos por receita gerada, comandas atendidas e ticket medio estimado.
- A tela financeira pode destacar quais profissionais concentram mais faturamento.
- A ocupacao da agenda ajuda a correlacionar volume com resultado.

## Como clientes aparecem

- Clientes ativos e recorrentes ajudam a interpretar a base.
- Clientes sem retorno viram alerta gerencial.
- Clientes com comanda pendente aparecem como ponto de acao.
- Clientes assinantes e avulsos seguem separados na leitura da base.

## Cenarios mockados

- Receita recebida no periodo.
- Receita pendente no periodo.
- Comandas abertas, aguardando e parciais.
- Assinantes ativos e inadimplentes.
- Clientes sem retorno.
- Cliente com pendencia aberta.
- Servicos avulsos, produtos, extras e descontos.
- Indicadores de ocupacao e ticket medio.

## Ajustes feitos nas telas

- Dashboard com mais foco em recebido, pendente, assinantes ativos, inadimplentes, ocupacao e ticket medio.
- Tela financeira com bloco de leitura gerencial usando os mesmos conceitos do caixa e das comandas.
- Indicadores de origem da receita, com foco em avulso, planos, produtos, extras e descontos.
- Alertas gerenciais para pendencias, inadimplencia e base fria.

## Decisoes abertas

- Como comissao por profissional deve ser calculada no produto final.
- Se a leitura financeira vai receber agrupamento por dia, semana e mes com selecao persistida.
- Se o dashboard deve ter meta comercial editavel para todos os indicadores ou apenas para faturamento.
- Se o MRR estimado vai considerar apenas assinaturas ativas ou tambem renovacoes programadas.

## Riscos

- Parte da leitura ainda e estimada com base em mock.
- Movimentos financeiros locais continuam separados de uma contabilidade real.
- Comissao e margem definitiva ainda dependem de regra de negocio fechada.
- O dashboard precisa continuar coerente com caixa, comandas e assinaturas nas proximas fases.

## Proxima fase recomendada

Fase 8 - Profissionais, Servicos e Configuracoes Operacionais, refinando disponibilidade, servicos por profissional, horarios, unidades, politicas e parametros operacionais da barbearia.
