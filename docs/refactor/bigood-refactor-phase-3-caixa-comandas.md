# Bigood Refactor Phase 3 - Caixa e Comandas

## Objetivo da fase

Consolidar a experiencia de caixa e comandas como fluxo operacional real da barbearia, sem backend e sem redesenho visual.

Esta fase organiza a leitura de:

- comanda aberta;
- comanda aguardando pagamento;
- comanda parcialmente paga;
- comanda paga;
- origem da comanda;
- tipo de cliente;
- cobertura de plano;
- produtos e extras;
- fechamento visual do caixa.

## Decisoes tomadas

| Decisao | Aplicacao |
|---|---|
| Comanda nao e apenas uma lista de itens | A tela mostra origem, tipo de cliente, atendimento vinculado, itens cobertos pelo plano, itens cobrados e pendencias. |
| Pagamento fica separado de atendimento e de plano | Atendimento concluido nao significa pagamento concluido. |
| Cobertura de plano aparece como abatimento operacional | Itens `included_in_plan` sao mostrados com selo proprio e entram no total coberto. |
| Extras continuam cobrados | Produtos e servicos extras aparecem separados do que o plano cobriu. |
| Pagamento parcial e estado valido | Comandas parciais exibem valor pago, valor pendente e pagamentos registrados. |
| Caixa tem fechamento visual | O usuario consegue ver saldo projetado, recebido, pendente e confirmar um fechamento local. |

## Como `Command`, `Payment` e `CashRegister` aparecem na interface

| Conceito | Como aparece |
|---|---|
| Command | Card detalhado e modal de detalhes com status, origem, tipo de cliente, atendimento, totais, pagamentos e observacoes. |
| Payment | Lista de pagamentos dentro do modal de detalhes e resumo textual da forma usada, com indicacao de parcial ou pendencia. |
| CashRegister | Bloco de fechamento do dia no caixa, com status aberto/fechado, saldo projetado, recebido, pendente e observacao visual. |

## Como a UI diferencia plano, extra, produto e pagamento

| Situacao | Como a UI mostra |
|---|---|
| Servico coberto pelo plano | Item recebe selo `Coberto pelo plano` e entra no total coberto. |
| Servico extra | Item aparece como `Cobrado a parte`. |
| Produto | Continua visivel como item separado de servico. |
| Pagamento | Aparece em resumo da comanda e em lista de pagamentos, com status parcial ou pendente quando necessario. |

## Status de comanda usados

- `open`
- `awaiting_payment`
- `partially_paid`
- `paid`
- `cancelled`

## Ajustes feitos na tela

| Area | Ajuste |
|---|---|
| Caixa principal | Adicionou resumo do dia com saldo, recebido, pendencia e bloco de fechamento visual. |
| Comandas | Passou a funcionar como lista operacional com filtros, busca e cards mais informativos. |
| Cartoes de comanda | Passaram a exibir tipo de cliente, origem, atendimento, pagamento e saldo operacional. |
| Modal de detalhes | Adicionado para leitura rapida de itens, cobranca, pagamentos e observacoes. |
| Modal de fechamento | Adicionado para conferir saldo projetado e confirmar o encerramento visual do caixa. |
| Mocks | Foram expandidos para cobrir avulso, assinante ativo, assinante inadimplente, produto extra, servico extra, pagamento parcial e venda direta. |

## Cenarios mockados

| Cenario | Comanda |
|---|---|
| Cliente assinante ativo com servico coberto pelo plano | `CMD-1001` |
| Cliente avulso pago no Pix | `CMD-1002` |
| Assinante inadimplente com cobranca pendente | `CMD-1003` |
| Assinante ativo com produto extra em atendimento | `CMD-1004` |
| Assinante ativo com pagamento parcial | `CMD-1005` |
| Cliente avulso aguardando pagamento | `CMD-1006` |
| Assinante ativo com extra e pagamento pago | `CMD-1007` |
| Venda direta sem plano | `CMD-1008` |
| Assinante ativo com produto extra e desconto | `CMD-1009` |
| Assinante inadimplente para conferencia visual | `CMD-1010` |
| Comanda aberta aguardando pagamento | `CMD-1011` |

## Decisoes abertas

| Decisao | Motivo |
|---|---|
| Pagamento dividido precisa de contrato visual mais explicito | A fase permite refletir multiplas parcelas, mas o comportamento definitivo continua simplificado. |
| Fechamento de caixa precisa ou nao exigir confirmacao de pendencias | Hoje a confirmacao e visual; a regra definitiva pode vir depois. |
| Comanda aberta deve ou nao virar venda direta separada | A UI aceita a representacao, mas a modelagem operacional final ainda pode ser refinada. |
| Recibo detalhado e historico de recebimentos por comanda | A fase mostra resumo suficiente, mas nao fecha o fluxo documental. |

## Riscos

- Regras de pagamento parcial podem exigir refinamento quando o backend entrar.
- O fechamento visual do caixa ainda e local e nao representa persistencia real.
- O fluxo de comanda continua dependente da Fase 4 para integrar melhor planos, assinaturas e saldo por servico.

## Proxima fase recomendada

Fase 4: Planos, Assinaturas e Beneficios.

Objetivo sugerido: aprofundar a criacao e leitura de planos, assinatura do cliente, saldo por servico, inadimplencia e como isso aparece tanto para o barbeiro quanto para o cliente.
