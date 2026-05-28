# Bigood Refactor Phase 6 - Portal do Cliente

## Objetivo da fase

Refatorar o Portal do Cliente para que a experiencia mobile fique coerente com o painel administrativo e com os contratos oficiais consolidados nas fases anteriores. O portal passa a comunicar, de forma simples e confiavel, a diferenca entre cliente avulso e assinante, plano ativo e plano bloqueado, beneficio disponivel e beneficio reservado, agendamento futuro e cobranca no atendimento.

## Decisoes tomadas

- O portal ganhou leitura por cenarios de demo via `scenario` ou `demo` na URL, para validar estados de cliente avulso, saldo esgotado, inadimplencia, pausa, cancelamento e expiracao.
- A tela inicial agora apresenta a barbearia com mais contexto, CTA de agendamento, CTA de planos e CTA de WhatsApp quando existir contato.
- O fluxo de agendamento foi mantido em etapas claras: servico, profissional, data, horario e confirmacao.
- O portal passou a carregar cobertura do servico antes da confirmacao, distinguindo atendimento incluso, extra cobrado, avulso e bloqueado por plano.
- Agendamento confirmado com cobertura de plano reserva beneficio no saldo local do portal.
- Cancelamento visual libera reserva quando o agendamento tinha beneficio reservado.
- A area logada agora mostra plano atual, saldo por servico, proximos agendamentos e historico basico.
- O portal evita prometer algo que o painel nao representa visualmente.

## Como o portal diferencia cliente avulso e assinante

- Cliente avulso ve agendamento normal, preco avulso e opcao de conhecer planos, sem linguagem de assinatura forçada.
- Cliente assinante ve nome do plano, status, renovacao, alertas e saldo por servico.
- Cliente assinante inadimplente, pausado, cancelado ou expirado recebe linguagem de bloqueio ou indisponibilidade.
- Ex-assinante continua com historico preservado e pode retomar agendamento avulso.

## Como o portal exibe planos, saldo e beneficios

- Cada plano exibe nome, preco, recorrencia, beneficios inclusos, descontos e regras resumidas.
- A area logada mostra saldo disponivel, reservado e consumido por servico incluso.
- O portal diferencia:
  - beneficio incluso;
  - beneficio reservado;
  - beneficio consumido;
  - saldo esgotado;
  - beneficio bloqueado;
  - servico cobrado a parte.
- Textos do tipo "Este servico esta incluso no seu plano" e "Este servico sera cobrado a parte" foram usados para reduzir ambiguidade.

## Como o portal representa agendamento, remarcacao e cancelamento

- O fluxo de agendamento foi mantido como jornada mobile curta e progressiva.
- A confirmacao mostra resumo do servico, profissional, data, horario, preco e leitura de cobertura.
- A area de proximos agendamentos passou a exibir status, beneficio reservado e cobranca no atendimento quando houver.
- Remarcacao e cancelamento aparecem como intencao visual completa, com confirmacao e aviso de impacto.
- O portal indica quando um horario usa beneficio reservado e quando a liberacao de saldo depende da regra da barbearia.

## Como o portal usa a linguagem do painel

- Usa os mesmos conceitos oficiais: servico, profissional, plano, assinatura, beneficio, saldo, reservado, consumido, avulso, inadimplente, pausado, cancelado e expirado.
- Nao transforma pagamento em etapa do portal; o foco aqui continua sendo agendar e entender cobertura.
- A cobertura de plano no portal segue a mesma leitura visual que a agenda e a comanda usam no painel.

## Cenarios mockados

- Cliente avulso sem plano.
- Cliente avulso com agendamento futuro.
- Cliente assinante ativo com saldo disponivel.
- Cliente assinante com beneficio reservado.
- Cliente assinante sem saldo para o servico desejado.
- Cliente inadimplente com beneficios bloqueados.
- Cliente pausado.
- Cliente cancelado.
- Cliente expirado.

## Ajustes feitos nas telas

- Header com mais contexto da barbearia.
- Home com acesso ao plano atual, saldo e CTA de contato.
- Cards de servicos com leitura de cobertura.
- Fluxo de booking com cobertura exibida antes da confirmacao.
- Area de proximos agendamentos com selos de status e acoes de remarcar/cancelar.
- Modal de cancelamento de agendamento.
- Area logada com historico basico e saldo resumido.
- Checkout/planos com reforco comercial simples e coerente.

## Decisoes abertas

- Regra definitiva de cancelamento fora da janela.
- Se falta consome ou libera beneficio por padrao.
- Se a compra do plano sera feita diretamente no portal ou apenas como demonstracao.
- Se o portal deve mostrar unidade explicitamente em multitenancy.
- Se WhatsApp vai virar integracao real ou continuar como CTA externo simples.

## Riscos

- O portal continua dependente de mocks e storage local.
- A cobertura de saldo ainda e simulada no frontend.
- A experiencia de remarcacao e cancelamento nao persiste em backend.
- O portal precisa continuar alinhado com a agenda e a comanda para nao introduzir leitura divergente.

## Proxima fase recomendada

Fase 7 - Financeiro, Indicadores e Gestao, consolidando faturamento, assinaturas, pendencias, caixa, recorrencia e leitura gerencial para o dono.
