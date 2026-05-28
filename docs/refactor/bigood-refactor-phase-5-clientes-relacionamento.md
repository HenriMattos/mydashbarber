# Bigood Refactor Phase 5 - Clientes e Relacionamento

## Objetivo da fase

Refatorar a experiencia de clientes para que o frontend represente melhor a base real de uma barbearia: avulsos, recorrentes, assinantes, ex-assinantes, inadimplentes, sem retorno, com pendencias e com oportunidade de conversao.

## Decisoes tomadas

- A listagem de clientes passou a priorizar leitura operacional, nao apenas cadastro.
- A ficha do cliente foi consolidada como pagina propria para juntar relacionamento, plano, historico, preferencias e pendencias.
- O cadastro ganhou blocos separados para dados basicos, relacionamento, preferencias e conversao para plano.
- Os status de cliente foram alinhados com a operacao da barbearia e separados do status de assinatura.
- O relacionamento com assinatura, agendamento e comanda passou a aparecer na interface sem misturar conceitos.

## Como Cliente aparece na interface

- Como base operacional na pagina inicial de clientes.
- Como card filtravel na listagem.
- Como ficha detalhada em `/clientes/[id]`.
- Como oportunidade de retorno e conversao na pagina de recompras sugeridas.

## Como o sistema diferencia avulso, recorrente, assinante, inadimplente e ex-assinante

- `avulso`: cliente sem plano ativo, atendido e cobrado normalmente.
- `recorrente`: cliente com frequencia alta, mas ainda sem assinatura.
- `assinante ativo`: cliente com plano ativo e beneficios disponiveis.
- `assinante inadimplente`: cliente com plano vinculado, mas com alerta de bloqueio.
- `ex-assinante`: cliente que ja teve plano e pode ser reativado.

## Como historico, preferencias e observacoes aparecem

- Historico recente aparece na ficha como linha do tempo simples.
- Preferencias aparecem como informacao de continuidade de atendimento.
- Observacoes internas ficam visiveis na ficha, mas continuam separadas do que o cliente ve.

## Quais cenarios foram mockados

- Cliente avulso novo.
- Cliente avulso recorrente.
- Cliente assinante ativo.
- Cliente assinante inadimplente.
- Cliente ex-assinante.
- Cliente sem retorno.
- Cliente com proximo agendamento.
- Cliente com comanda pendente.
- Cliente com alta recorrencia.
- Cliente com interesse em plano.

## Ajustes feitos nas telas

- `app/(admin)/clientes/page.tsx`
- `app/(admin)/clientes/listagem/page.tsx` com nova leitura operacional via `ClientesListManager`
- `app/(admin)/clientes/cadastrar/page.tsx`
- `app/(admin)/clientes/[id]/page.tsx`
- `app/(admin)/clientes/recompras/page.tsx`
- `components/admin/clientes-data.tsx`
- `components/admin/clientes-list-manager.tsx`
- `services/admin.ts`
- `types/admin.ts`

## Decisoes abertas

- Automacoes reais de WhatsApp continuam fora do escopo.
- Conversao automatica de cliente para plano ainda depende de backend e regra comercial.
- Pontuacao ou CRM avancado de relacionamento fica para uma fase posterior.
- A politica comercial final de retenção e reativacao continua evoluindo com o produto.

## Riscos

- A base continua mockada, entao a leitura de comportamento depende dos cenarios de demo.
- A ficha do cliente usa dados derivados de agenda, comanda e assinatura; isso vai exigir contratos de API coerentes no backend.
- A pagina de clientes ganhou mais informacao, mas precisa continuar leve no mobile.

## Proxima fase recomendada

Fase 6 - Portal do Cliente.

O proximo passo e alinhar a experiencia mobile do cliente com a mesma linguagem da base administrativa: agendamento, plano, saldo, historico, cancelamento, remarcacao e CTA de WhatsApp.
