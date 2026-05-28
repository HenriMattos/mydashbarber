# Bigood Refactor Phase 1 — Domain Audit

Fonte: `docs/specs/bigood-functional-consolidation-spec.md`  
Escopo: tipos, status, mocks e contratos funcionais do frontend.  
Data: 2026-05-20

Esta auditoria registra os pontos encontrados antes da refatoração da Fase 1. O objetivo foi localizar divergências de domínio sem redesenhar telas.

| Área | Arquivos encontrados | Problema | Ação recomendada |
|---|---|---|---|
| Agenda/agendamento | `types/client-portal.ts`, `components/admin/agenda-view.tsx`, `services/admin.ts`, `components/client-portal/client-portal-shell.tsx` | O portal usava `completed` como status de agendamento, misturando agendamento com atendimento. A agenda admin tinha eventos sem status operacional explícito. | Centralizar `AppointmentStatus` com `pending`, `confirmed`, `cancelled`, `no_show`. Manter `client_arrived` e `in_progress` fora do agendamento. |
| Atendimento | Não havia contrato central dedicado. Havia fluxo implícito em `agenda-view.tsx`, `caixa-view.tsx` e mocks de comanda. | Atendimento era conceito implícito e podia ser confundido com agendamento ou comanda. | Criar contrato `Attendance` com estados oficiais: `client_arrived`, `in_progress`, `completed`, `cancelled`. Não criar `created` nem `awaiting_payment`. |
| Planos | `types/admin.ts`, `services/admin.ts`, `components/client-portal/client-portal-data.ts`, `app/(admin)/planos/*` | Plano usava `servicesLimit` como limite total genérico. Isso conflitava com a spec, que define quantidade por serviço incluso. | Adicionar `includedServices`, `benefitRule`, `billingCycle`, `extraDiscountPercent` e manter `servicesLimit` apenas como compatibilidade visual temporária. |
| Assinaturas | `types/admin.ts`, `types/client-portal.ts`, `services/admin.ts`, `app/(admin)/assinaturas/gerenciar/page.tsx` | Status usava rótulos PT-BR como tipo (`Ativa`, `Pausada`, `Em atraso`) e não havia saldo separado em disponível/reservado/consumido. | Centralizar `SubscriptionStatus` com `active`, `delinquent`, `paused`, `cancelled`, `expired` e adicionar `benefitBalances` por serviço. |
| Comandas | `types/admin.ts`, `components/admin/caixa-data.ts`, `components/admin/caixa-view.tsx`, `components/admin/comanda-card.tsx`, `services/admin.ts` | Status de comanda usava `aberta`, `paga`, `parcial`, `cancelada`, sem estado oficial `awaiting_payment`. | Centralizar `CommandStatus` com `open`, `awaiting_payment`, `partially_paid`, `paid`, `cancelled` e mapear labels PT-BR apenas na UI. |
| Pagamento | `types/admin.ts`, `components/admin/caixa-view.tsx`, `components/admin/financeiro-view.tsx` | Pagamento aparecia como string de forma de pagamento dentro da comanda, sem contrato funcional separado. | Criar contrato `Payment` separado para preparar a próxima fase, sem alterar fluxo visual agora. |
| Caixa | `components/admin/caixa-view.tsx`, `components/admin/caixa-data.ts`, `services/admin.ts` | Caixa calculava totais a partir dos status antigos de comanda. | Atualizar cálculos para `paid`, `open`, `awaiting_payment` e `partially_paid`. |
| Financeiro | `types/financial.ts`, `components/admin/financeiro-view.tsx`, `services/admin.ts` | Financeiro usa tipos próprios e ainda mistura status de formas de pagamento com status financeiro operacional. | Não alterar nesta fase. Apenas manter separado de `CashRegister` e preparar contrato `CashRegister`. |
| Portal do cliente | `types/client-portal.ts`, `components/client-portal/client-portal-data.ts`, `components/client-portal/client-portal-shell.tsx` | Portal mostrava planos como lista de benefícios genéricos e assinatura sem saldo confiável. | Adicionar serviços inclusos, desconto em extras e saldo de assinatura por serviço. Remover `completed` de agendamento. |
| Mocks | `services/admin.ts`, `components/client-portal/client-portal-data.ts` | Mocks mascaravam clientes assinantes sem diferenciar saldo, reserva, consumo, inadimplência e comanda pendente. | Atualizar mocks para cobrir cliente avulso, assinante com reserva/consumo, assinante sem saldo, inadimplente e comanda pendente. |

## Achados principais

- O frontend já tinha boas telas, mas os contratos misturavam rótulos de UI com estados funcionais.
- O portal e o painel não compartilhavam a mesma definição de agendamento e assinatura.
- Plano ainda era tratado como card comercial com `servicesLimit`, não como regra de benefícios por serviço.
- Comanda e pagamento estavam próximos demais no modelo, mas ainda podem ser separados sem redesenho visual.
- Não havia contrato explícito de atendimento, que é o elo definido pela spec.

## Ação aplicada nesta fase

- Criar contratos funcionais centrais em `types/*`.
- Atualizar os tipos legados do admin para apontarem para estados oficiais.
- Atualizar mocks mínimos em `services/admin.ts` e portal.
- Ajustar componentes apenas para compilar com os novos status e manter a UI existente.
