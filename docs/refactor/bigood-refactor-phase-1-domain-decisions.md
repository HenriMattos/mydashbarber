# Bigood Refactor Phase 1 — Domain Decisions

Fonte: `docs/specs/bigood-functional-consolidation-spec.md`  
Data: 2026-05-20

## Decisões aplicadas

| Tema | Decisão |
|---|---|
| Estados oficiais de agendamento | `pending`, `confirmed`, `cancelled`, `no_show`. |
| Remarcação | Não é status operacional ativo. O agendamento original deve ser cancelado com motivo `rescheduled`, e o novo horário vira outro agendamento vinculado. |
| Estados oficiais de atendimento | `client_arrived`, `in_progress`, `completed`, `cancelled`. |
| Atendimento criado | Não existe estado `created` no MVP. Atendimento nasce em `client_arrived` ou `in_progress`. |
| Atendimento e pagamento | Não existe `awaiting_payment` em atendimento. Pendência de pagamento pertence à comanda. |
| Estados oficiais de assinatura | `active`, `delinquent`, `paused`, `cancelled`, `expired`. |
| Saldo de assinatura | Saldo fica separado por serviço em `available`, `reserved` e `consumed`. |
| Estados oficiais de comanda | `open`, `awaiting_payment`, `partially_paid`, `paid`, `cancelled`. |
| Plano MVP | Plano usa quantidade por serviço incluso, não limite total livre entre serviços. |
| Reserva de benefício | Agendamento confirmado reserva 1 benefício do serviço correspondente quando houver saldo. |
| Consumo de benefício | Atendimento concluído converte reserva em consumo quando a comanda confirma o abatimento. |
| Serviço fora do plano | Deve ser tratado como extra pago. |
| Assinatura inadimplente | Cliente pode agendar como avulso, mas não usa benefício enquanto estiver inadimplente. |
| Separação funcional | Agendamento, atendimento, comanda, pagamento, caixa e financeiro ficam separados nos contratos. |

## Decisões ainda em aberto

| Decisão | Situação |
|---|---|
| Falta consome benefício por padrão? | Aberta. Deve ser configurável ou validada com barbeiros. |
| Cancelamento fora da janela consome uso ou apenas registra ocorrência? | Aberta. MVP registra e mostra política; consumo/taxa ficam para validação. |
| Compra de assinatura diretamente no portal | Aberta. Pode ser checkout visual ou demonstração de interesse. |
| Unidade visível no portal | Aberta. Recomendação inicial: mostrar apenas quando multiunidade estiver ativa. |
| Taxa de no-show | Aberta. Depende da cultura comercial da barbearia. |
| Regras futuras por profissional/dia/unidade | Adiadas. Não entram no MVP funcional desta fase. |

## Riscos evitados

| Risco | Como a fase reduz o risco |
|---|---|
| Backend modelado errado | Contratos de frontend agora separam entidades antes de definir APIs. |
| Portal e painel com linguagens diferentes | Status oficiais ficam centralizados em `types/status.ts`. |
| Agenda misturada com atendimento | `AppointmentStatus` não contém `completed`, `client_arrived` ou `in_progress`. |
| Atendimento misturado com pagamento | `AttendanceStatus` não contém `awaiting_payment`. |
| Plano decorativo sem regra operacional | `Plan` passa a carregar serviços inclusos e quantidade por ciclo. |
| Assinatura sem saldo confiável | `Subscription` passa a carregar saldo `available/reserved/consumed` por serviço. |
| Comanda sem distinção de pendência | `CommandStatus` passa a ter `awaiting_payment` e `partially_paid`. |

## Critérios de aceite

- [ ] `npm run lint` passa.
- [ ] `npm run build` passa.
- [ ] Os tipos principais estão claros.
- [ ] Strings soltas de status foram reduzidas ou centralizadas nas áreas tocadas.
- [ ] Mocks principais refletem clientes avulsos, assinantes, inadimplência, reserva e consumo.
- [ ] Nenhum layout principal foi redesenhado.
- [ ] Nenhum fluxo visual grande foi implementado fora de escopo.
- [ ] Documentos da fase foram criados.

## Preparação para a Fase 2

- Agenda poderá receber ações de chegada/início/conclusão usando `AppointmentStatus` e `AttendanceStatus`.
- Atendimento já tem contrato próprio para virar elo entre agenda, comanda e histórico.
- Comanda já tem status compatíveis com pendência e pagamento parcial.
- Planos e assinaturas já carregam regra de benefício por serviço.
- Portal já pode comunicar cobertura e saldo por serviço sem depender de texto genérico.
