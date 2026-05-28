# Bigood Refactor Phase 4 - Planos, Assinaturas e Beneficios

## Objetivo da fase

Consolidar a leitura de planos, assinaturas e saldo de beneficios no frontend, para que o Bigood represente melhor uma barbearia com clientes avulsos e clientes por assinatura.

## Decisoes tomadas

| Decisao | Aplicacao |
|---|---|
| Plano passou a representar regra comercial e operacional | A tela de criacao e a listagem passaram a mostrar recorrencia, status, destaque, servicos inclusos, descontos e regras de uso. |
| Assinatura passou a representar estado de cliente assinante | A tela de assinaturas agora destaca status, proxima cobranca, saldo e alerta de uso. |
| Beneficio nao e um card comercial | O saldo por servico passa a ser lido como disponivel, reservado e consumido. |
| Plano ativo nao significa saldo livre | O cliente pode estar ativo e ainda assim estar sem saldo em um servico especifico. |
| Inadimplencia bloqueia beneficios | A assinatura continua visivel, mas recebe alerta e leitura de bloqueio. |
| Plano pode ter beneficio ilimitado | O contrato de servico incluso agora aceita leitura de uso ilimitado no ciclo. |

## Como Plan aparece na interface

| Area | Como aparece |
|---|---|
| Lista de planos | Cards com nome, texto comercial, recorrencia, preco, servicos inclusos, assinantes, MRR e status. |
| Criacao de plano | Formulario com dados basicos, recorrencia, status, destaque, regras, servicos inclusos e beneficios adicionais. |
| Detalhes comerciais | A interface mostra cobertura por ciclo, descontos em extras e descontos em produtos quando existirem. |

## Como Subscription aparece na interface

| Area | Como aparece |
|---|---|
| Listagem de assinaturas | Tabela com cliente, plano, valor, proxima cobranca, saldo e status. |
| Resumo operacional | Indicadores de ativas, inadimplentes, pausadas e saldo reservado. |
| Detalhe da assinatura | Modal com cliente, plano, status, valor, renovacao, saldo por servico e historico recente. |

## Como BenefitUsage e saldo aparecem na interface

| Estado | Leitura visual |
|---|---|
| Disponivel | Quantidade ainda util no ciclo. |
| Reservado | Uso futuro ja segurado por agendamento. |
| Consumido | Uso ja abatido em atendimento concluido. |
| Esgotado | Nao ha mais cobertura para o servico no ciclo. |
| Bloqueado | Assinatura inadimplente ou condicao equivalente. |
| Fora do plano | Servico ou produto cobrado a parte. |

## Como a UI diferencia cliente avulso, assinante ativo, inadimplente, pausado, cancelado e expirado

| Situacao | Diferenca visual |
|---|---|
| Cliente avulso | Nao exibe cobertura por plano e usa leitura de cobranca normal. |
| Assinante ativo | Exibe plano atual, saldo e beneficios visiveis. |
| Inadimplente | Exibe alerta e leitura de bloqueio ou conferencia. |
| Pausado | Exibe status de pausa e indisponibilidade temporaria dos beneficios. |
| Cancelado | Exibe encerramento da assinatura sem saldo ativo. |
| Expirado | Exibe contrato vencido e necessidade de renovacao. |

## Cenarios mockados

| Cenario | Descricao |
|---|---|
| Plano com 2 cortes por ciclo | Plano de entrada com cobertura simples. |
| Plano com corte e barba | Cobertura separada por servico, com desconto em extras. |
| Plano premium | Inclui servico ilimitado em um caso de teste. |
| Plano inativo | Aparece como indisponivel na vitrine. |
| Assinatura ativa com saldo e reserva | Mostra uso, reserva e saldo por servico. |
| Assinatura ativa sem saldo suficiente | Mostra alerta de cobranca a parte. |
| Assinatura inadimplente | Mostra bloqueio visual. |
| Assinatura pausada | Mostra suspensao temporaria. |
| Assinatura cancelada | Mostra encerramento. |
| Assinatura expirada | Mostra necessidade de renovacao. |

## Ajustes feitos nas telas

| Tela | Ajuste |
|---|---|
| Planos | Listagem mais gerencial, com cobertura, assinantes e MRR. |
| Criar plano | Formulario refeito para falar de recorrencia, servicos inclusos, beneficios adicionais e regras. |
| Gerenciar planos | Cards com cobertura por servico, assinantes, MRR e status comercial. |
| Assinaturas | Tabela com saldo, status e leitura detalhada por assinatura. |
| Portal | Planos e assinatura atual passaram a refletir status, descontos e saldo por servico. |

## Decisoes abertas

| Decisao | Motivo |
|---|---|
| Regra final de ausencia e cancelamento | Ainda pode variar por barbearia e precisa de validacao de negocio. |
| Visualizacao de profissionais especificos por plano | O contrato permite leitura, mas a operacao pode ser refinada depois. |
| Arquivamento formal de planos | O MVP trabalha com ativo, rascunho e inativo. |
| Calculo definitivo de MRR | A interface mostra estimativa local, nao financeiro real. |

## Riscos

- Planos antigos salvos no localStorage precisam de normalizacao.
- O saldo por servico ainda e mockado e nao tem validacao de backend.
- O fluxo de assinatura no portal continua simplificado.
- O MRR exibido no frontend nao representa receita contabil real.

## Proxima fase recomendada

Fase 5: Clientes e Relacionamento.

Objetivo sugerido: consolidar ficha do cliente, historico, preferencia, avulso x assinante, conversao para plano e jornada de retorno.
