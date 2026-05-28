# Bigood Refactor Phase 2 - Agenda e Atendimento

## Objetivo da fase

Transformar a agenda em uma tela operacional de barbearia sem redesenhar a interface. A fase aplica os contratos oficiais da Fase 1 para deixar claro o que e agendamento, atendimento e comanda dentro do frontend.

Esta fase nao implementa backend, APIs reais, autenticacao, persistencia ou regras definitivas de pagamento.

## Decisoes tomadas

| Decisao | Aplicacao |
|---|---|
| Agendamento continua separado de atendimento | A agenda usa `pending`, `confirmed`, `cancelled` e `no_show` apenas para reserva de horario. |
| Atendimento passa a aparecer como camada operacional | Cards e detalhes exibem `client_arrived`, `in_progress`, `completed` e `cancelled` quando houver atendimento vinculado. |
| Comanda nao vira estado do atendimento | A UI exibe selos derivados da comanda, como `Aberta`, `Aguardando pagamento`, `Parcialmente paga` ou `Paga`. |
| Remarcacao nao vira status ativo | Ao mudar data, horario ou profissional de um agendamento existente, o registro original fica `cancelled` com motivo `rescheduled`, e um novo agendamento e criado. |
| Beneficio reservado aparece como informacao operacional | Agendamentos confirmados podem carregar `reservedBenefitServiceId`; a agenda mostra cobertura e reserva sem consumir beneficio. |
| Falta/no-show segue decisao aberta | A UI permite marcar `no_show`, mas nao fixa se isso consome ou libera beneficio. |

## O que foi ajustado na agenda

| Area | Ajuste |
|---|---|
| Cards de agenda | Passaram a mostrar cliente, horario, status do agendamento, tipo de cliente, cobertura de plano, atendimento e comanda. |
| Filtros | Foram adicionados filtros operacionais para assinantes, avulsos, inadimplentes, atencao, em atendimento, comandas pendentes, faltas e cancelados. |
| Detalhes do agendamento | O modal atual recebeu um painel operacional com plano, cobertura, atendimento, comanda e acoes rapidas. |
| Acoes rapidas | Confirmar, cliente chegou, iniciar atendimento, concluir atendimento, abrir comanda, marcar falta e cancelar aparecem conforme contexto. |
| Remarcacao | Edicao que altera data, horario ou profissional preserva o agendamento original como cancelado por remarcacao e cria novo horario vinculado. |
| Estados vazios | A agenda mostra mensagem clara quando nao ha horario para o filtro selecionado. |
| Mocks | A massa de agenda passou a cobrir avulso, assinante ativo, assinante sem saldo, inadimplente, atendimento em andamento, atendimento concluido com comanda paga/pendente, falta, cancelamento e encaixe. |

## Status usados

### Agendamento

- `pending`
- `confirmed`
- `cancelled`
- `no_show`

### Atendimento

- `client_arrived`
- `in_progress`
- `completed`
- `cancelled`

### Comanda

- `open`
- `awaiting_payment`
- `partially_paid`
- `paid`
- `cancelled`

## Como os conceitos aparecem na interface

| Conceito | Como aparece |
|---|---|
| Appointment | Status do horario reservado: pendente, confirmado, cancelado ou falta. |
| Attendance | Estado da execucao real: cliente chegou, em atendimento ou concluido. |
| Command | Selo financeiro-operacional derivado da comanda vinculada, sem alterar o atendimento. |
| Subscription | Tipo de cliente e status da assinatura: ativo, inadimplente, pausado etc. |
| Benefit reserve | Badge de beneficio reservado quando o agendamento confirmado usa saldo de plano. |
| No-show | Status de agendamento `no_show`, com nota de que a politica de beneficio segue aberta. |

## Cenarios mockados

| Cenario | Onde aparece |
|---|---|
| Cliente assinante ativo com beneficio reservado e comanda paga | Henrique Demo, Rafael, 09:00. |
| Cliente assinante ativo sem saldo suficiente ou servico fora da cobertura | Gabriel Silva, Lucas, 10:00. |
| Cliente inadimplente com beneficio bloqueado e comanda pendente | Marcos Almeida, Diego, 11:30. |
| Agendamento pendente vindo do portal | Joao Pedro, Rafael, 13:30. |
| Atendimento em andamento com comanda aberta | Felipe Costa, Rafael, 10:30. |
| Falta/no-show | Bruno Lima, Rafael, 15:00. |
| Cancelamento | Andre Rocha, Rafael, 16:00. |
| Encaixe manual com cliente chegou | Thiago Souza, Rafael, 17:00. |

## Decisoes abertas

| Decisao | Motivo |
|---|---|
| Falta consome ou libera beneficio reservado | Precisa ser validado com barbeiros por impacto comercial e atrito com assinante. |
| Cancelamento fora da janela gera taxa, consumo de uso ou apenas ocorrencia | A interface apenas prepara a comunicacao da politica. |
| Comanda criada automaticamente ao concluir atendimento | A fase preserva separacao conceitual e nao cria comanda real sem backend. |
| Notificacao ao cliente em cancelamento/remarcacao | A UI pode indicar futuramente, mas nao ha canal real nesta fase. |
| Atendimento de encaixe pode nascer direto em `in_progress` por preferencia operacional | A base aceita os dois estados, mas a UI ainda usa fluxo simples. |

## Proxima fase recomendada

Fase 3: Caixa e Comandas.

Objetivo sugerido: consolidar a relacao entre atendimento concluido, servico extra, abatimento de plano, pagamento parcial, comanda pendente e fechamento de caixa no frontend.
