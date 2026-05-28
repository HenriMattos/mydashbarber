# Bigood Functional Consolidation Spec

Especificação oficial de consolidação funcional antes do backend.

Fonte principal: `docs/audits/bigood-deep-product-audit.md`  
Data: 2026-05-20  
Status: proposta oficial para orientar ajustes de frontend, regras de produto e futura implementação backend.

---

## Objetivo

Consolidar o Bigood como produto coerente antes da implementação real do backend.

Esta spec define:

- conceitos oficiais do produto;
- fluxos operacionais adotados;
- estados mínimos;
- MVP de planos e assinaturas;
- ajustes necessários no frontend;
- complexidades adiadas;
- critérios de aceite para considerar o produto funcionalmente coeso.

Esta spec não implementa telas, não define schema técnico e não substitui contratos de API futuros. Ela define o funcionamento correto que a UI deve comunicar.

---

# 1. Princípios oficiais do produto

| Princípio | O que significa | O que muda no produto | Módulos afetados |
|---|---|---|---|
| Agenda é a central operacional do dia | A agenda não é apenas calendário. Ela é o lugar onde o barbeiro vê, inicia, acompanha e encerra a rotina de atendimento. | Cards da agenda devem mostrar status, tipo de cliente, plano, serviço, horário e ações rápidas. | Dashboard, Agenda, Atendimento, Comandas, Caixa, Portal |
| Cliente é o centro do histórico e relacionamento | Todo relacionamento com a barbearia deve poder ser entendido a partir da ficha do cliente. | A ficha do cliente deve reunir agendamentos, atendimentos, planos, comandas, preferências, observações e recompras. | Clientes, Agenda, Assinaturas, Caixa, Portal |
| Plano é uma regra de benefícios, não apenas um card comercial | Plano define quais serviços o assinante pode usar, em qual ciclo e com qual quantidade por serviço incluso. | Tela de planos deve priorizar serviços inclusos, quantidade por serviço, desconto em extras e regras simples. | Planos, Assinaturas, Portal, Comandas |
| Assinatura é a adesão individual de um cliente a um plano | Assinatura representa um cliente vinculado a um plano, com status, saldo disponível, saldo reservado, consumo do ciclo e próxima cobrança. | O produto deve tratar assinatura como estado de um cliente, não apenas uma linha em tabela. | Clientes, Assinaturas, Portal, Comandas |
| Atendimento é o elo entre agendamento, consumo, comanda e histórico | Atendimento é a execução real de um horário agendado ou encaixe. Ele termina quando o serviço termina, mesmo que a cobrança continue pendente na comanda. | O produto passa a diferenciar reserva futura, execução real, cobrança e pagamento. | Agenda, Atendimento, Comandas, Clientes |
| Caixa é o fechamento operacional | Caixa registra o que aconteceu no dia: comandas, recebimentos, entradas, saídas e fechamento. | Caixa deve responder “quanto entrou hoje e o que está pendente”. | Caixa, Comandas, Financeiro |
| Financeiro é a leitura gerencial posterior | Financeiro interpreta receitas, despesas, margens e tendências depois da operação. | Financeiro não deve competir com caixa; deve separar realizado, previsto e analítico. | Financeiro, Dashboard, Caixa |
| Portal do cliente deve refletir regras configuradas no painel | O cliente deve ver serviços, profissionais, planos, horários e políticas coerentes com o que a barbearia configurou. | Portal deve informar quando algo é avulso, incluso no plano, extra pago ou indisponível. | Portal, Empresa, Serviços, Profissionais, Planos, Agenda |

---

# 2. Modelo conceitual oficial

| Entidade | O que representa no produto | Não deve ser confundida com | Relações principais |
|---|---|---|---|
| Cliente | Pessoa atendida pela barbearia, avulsa ou assinante. | Usuário admin, assinatura, agendamento. | Pode ter agendamentos, atendimentos, comandas, assinaturas, preferências e histórico. |
| Profissional | Pessoa que realiza serviços na barbearia. | Usuário administrativo, cadeira, unidade. | Atende serviços, possui disponibilidade, aparece na agenda e pode aparecer no portal. |
| Serviço | Item de atendimento vendido ou incluso em plano. | Produto, benefício, plano. | Tem preço avulso, duração, categoria, disponibilidade online e pode ser incluso em plano. |
| Plano | Regra comercial de benefícios recorrentes. | Assinatura individual, pagamento, card visual. | Define ciclo, preço, serviços inclusos, quantidade por serviço incluso e desconto em extras. |
| Assinatura | Vínculo de um cliente a um plano. | Plano, pagamento único, status do cliente. | Tem cliente, plano, status, saldo disponível/reservado/consumido por serviço, próxima cobrança e histórico de uso. |
| Agendamento | Reserva futura de horário. | Atendimento, comanda, pagamento. | Pode reservar benefício, virar atendimento, ser cancelado, gerar registro de remarcação ou ser marcado como não compareceu. |
| Atendimento | Execução real de um agendamento ou encaixe. | Agendamento, comanda, pagamento. | Gera consumo de serviço, pode abrir/revisar comanda e atualiza histórico. |
| Comanda | Documento operacional com itens consumidos e valores a cobrar/abater. | Atendimento, pagamento, caixa. | Contém serviços, produtos, descontos, abatimentos de plano, extras e status de pagamento. |
| Pagamento | Acerto financeiro de uma comanda ou assinatura. | Comanda, caixa, financeiro. | Pode ser total, parcial, dividido, pendente ou cancelado. |
| Caixa | Controle operacional do dia/unidade. | Financeiro, comanda individual. | Consolida comandas, pagamentos, entradas, saídas e fechamento do dia. |
| Financeiro | Leitura gerencial de desempenho. | Caixa, pagamento, comanda. | Usa realizado e previsto para mostrar receita, despesas, margem e tendência. |
| Unidade | Local físico/filial da barbearia. | Empresa, profissional, cadeira. | Agrupa agenda, profissionais, caixa, serviços e políticas quando multiunidade estiver ativo. |

## Regras de separação obrigatórias

- Agendamento não é atendimento. Agendamento reserva horário; atendimento executa o serviço.
- Atendimento não é comanda. Atendimento registra a execução; comanda registra consumo, abatimentos, cobrança e pendência.
- Comanda não é pagamento. Comanda mostra o que cobrar; pagamento quita total ou parcialmente.
- Plano não é assinatura. Plano define regra; assinatura aplica a regra a um cliente.
- Caixa não é financeiro. Caixa fecha o dia; financeiro analisa o negócio.

---

# 3. Fluxo operacional oficial da barbearia

## Fluxo A — Atendimento com agendamento

| Etapa | Ação do usuário | Sistema mostra | Estado gerado | Módulos afetados |
|---|---|---|---|---|
| 1 | Cliente agenda no portal ou equipe agenda no painel. | Serviço, profissional, data, horário, preço/cobertura e saldo disponível. | Agendamento pendente ou confirmado; reserva de benefício quando coberto e confirmado. | Portal, Agenda, Assinatura |
| 2 | Agendamento entra na agenda. | Card com cliente, serviço, horário, profissional e tipo avulso/assinante. | Agendamento visível no dia. | Agenda, Dashboard |
| 3 | Equipe confirma, se necessário. | Ação de confirmar e impacto no saldo. | Agendamento confirmado; reserva criada se o serviço for incluso e houver saldo. | Agenda, Portal, Assinatura |
| 4 | Cliente chega. | Botão `Cliente chegou` no card. | Atendimento nasce em `Cliente chegou`. | Agenda, Atendimento |
| 5 | Operador inicia atendimento. | Botão `Iniciar atendimento`. | Atendimento em atendimento. | Agenda, Atendimento |
| 6 | Serviços reais são confirmados. | Lista de serviços previstos e extras. | Itens de atendimento confirmados. | Atendimento, Comanda |
| 7 | Sistema mostra cobertura de plano. | Incluso com reserva, sem saldo, fora do plano ou extra com desconto. | Reserva mantida ou item marcado como extra. | Atendimento, Assinatura, Comanda |
| 8 | Comanda é aberta ou revisada. | Itens inclusos, extras, produtos, descontos e total. | Comanda aberta. | Comanda, Caixa |
| 9 | Inclusos no plano e extras são separados. | Linha `Incluso no plano`, linha `extra pago`, produtos, descontos e total. | Abatimentos e valores definidos na comanda. | Assinatura, Comanda |
| 10 | Operador conclui o atendimento. | Resumo do serviço executado e comanda vinculada. | Atendimento concluído; reserva convertida em consumo quando houver abatimento de plano. | Atendimento, Clientes, Assinatura, Comanda |
| 11 | Pagamento é registrado. | Pago, parcial ou pendente. | Comanda paga, parcialmente paga ou aguardando pagamento. | Pagamento, Caixa |
| 12 | Agenda exibe encerramento operacional. | Atendimento concluído e selo derivado da comanda, como `comanda pendente` quando necessário. | Agenda atualizada sem reabrir estado do atendimento. | Agenda, Comanda |
| 13 | Histórico do cliente é atualizado. | Linha do tempo com serviço, plano, comanda e observações. | Registro de histórico. | Clientes |
| 14 | Caixa recebe efeito operacional. | Total por forma, comandas abertas, pendências. | Caixa atualizado. | Caixa |
| 15 | Financeiro recebe leitura posterior. | Receita realizada, receita prevista, categorias. | Indicadores gerenciais. | Financeiro |

## Fluxo B — Encaixe ou cliente sem agendamento

O encaixe deve ser tratado como atendimento aberto diretamente pela agenda ou caixa, sem reserva prévia. Ele não deve exigir que o operador crie um agendamento falso.

| Etapa | Ação do usuário | Sistema mostra | Estado gerado | Módulos afetados |
|---|---|---|---|---|
| 1 | Operador clica em `Encaixar agora`. | Modal curto com cliente, profissional, serviço e horário atual/próximo slot. | Atendimento em `Cliente chegou` ou `Em atendimento`, conforme ação escolhida. | Agenda, Atendimento |
| 2 | Operador busca ou cadastra cliente rapidamente. | Cliente existente ou cadastro mínimo. | Cliente associado. | Clientes, Atendimento |
| 3 | Operador marca serviço. | Preço avulso e cobertura de plano se houver assinatura. | Itens de atendimento. | Atendimento, Comanda |
| 4 | Atendimento segue para comanda. | Itens consumidos, produtos e extras. | Comanda aberta. | Comanda, Caixa |
| 5 | Operador conclui atendimento. | Resumo do serviço executado. | Atendimento concluído. | Atendimento, Clientes |
| 6 | Pagamento é registrado. | Forma de pagamento, desconto, parcial ou pendente. | Comanda paga, parcialmente paga ou aguardando pagamento. | Caixa, Comanda |
| 7 | Histórico é atualizado. | Atendimento de encaixe no perfil e selo de comanda se pendente. | Histórico do cliente. | Clientes |

## Fluxo C — Venda rápida sem atendimento

Venda rápida será permitida no MVP para produtos, ajustes de caixa e venda sem serviço. Ela deve ficar separada de atendimento para não poluir agenda e histórico de serviços.

| Etapa | Ação do usuário | Sistema mostra | Estado gerado | Módulos afetados |
|---|---|---|---|---|
| 1 | Operador escolhe `Venda rápida` no caixa. | Modal simples de cliente opcional, produto/descrição e valor. | Comanda de venda rápida. | Caixa, Comanda |
| 2 | Adiciona produto ou item avulso. | Itens e total. | Comanda aguardando pagamento. | Comanda |
| 3 | Registra pagamento. | Forma, desconto, parcial se aplicável. | Comanda paga/parcial. | Caixa |
| 4 | Se cliente informado, registra histórico. | Linha `Venda rápida`. | Histórico comercial. | Clientes |

---

# 4. Estados oficiais

## 4.1 Agendamento

Estados mínimos:

- `Pendente`: horário solicitado, aguardando confirmação da barbearia ou do cliente.
- `Confirmado`: horário reservado e pronto para o dia.
- `Cancelado`: horário cancelado dentro ou fora da regra.
- `Não compareceu`: cliente não veio e a barbearia marcou falta.

`Cliente chegou` e `Em atendimento` não serão estados do agendamento. Eles pertencem ao atendimento. Essa é a modelagem mais simples porque preserva o agendamento como reserva e cria o atendimento quando a operação real começa.

`Remarcado` também não será um estado operacional ativo no MVP. Remarcação é um evento histórico: o agendamento original fica cancelado com motivo `remarcado` e um novo agendamento é criado vinculado ao anterior. A UI pode mostrar o texto simples `Remarcado`, mas a modelagem funcional deve preservar o novo horário como um novo agendamento confirmado ou pendente.

| Estado | Quando nasce/muda | Ação que provoca | Painel | Portal |
|---|---|---|---|---|
| Pendente | Ao solicitar horário que exige confirmação. | Criar agendamento pendente. | Card com alerta. | Mostra aguardando confirmação. |
| Confirmado | Ao confirmar reserva. | Confirmar agendamento. | Card normal do dia. | Mostra confirmado. |
| Cancelado | Ao cancelar ou ao substituir por remarcação. | Cancelar ou remarcar. | Card removido/linha de histórico com motivo. | Mostra cancelado ou remarcado com novo horário. |
| Não compareceu | No dia, após ausência. | Marcar falta. | Alerta no histórico. | Mostra falta se for apropriado ao cliente. |

## 4.2 Atendimento

Estados mínimos:

- `Cliente chegou`: cliente presente, atendimento ainda não iniciado.
- `Em atendimento`: serviço em execução.
- `Concluído`: serviço executado e encerrado operacionalmente.
- `Cancelado`: atendimento iniciado por engano ou interrompido.

Não existe estado `Criado` no MVP. O atendimento nasce quando existe fato operacional real:

- em agendamento, nasce diretamente como `Cliente chegou` quando a equipe marca a chegada;
- em encaixe, nasce como `Cliente chegou` se o cliente aguardará atendimento, ou como `Em atendimento` se o barbeiro já iniciou o serviço.

Também não existe estado `Aguardando pagamento` dentro de atendimento. Pagamento pertence à comanda. Um atendimento pode estar `Concluído` com a comanda ainda `Aguardando pagamento` ou `Parcialmente paga`. A agenda pode exibir um selo derivado da comanda, como `comanda pendente`, sem transformar pendência financeira em estado do atendimento.

| Estado | Quando nasce/muda | Ação que provoca | Painel | Portal |
|---|---|---|---|---|
| Cliente chegou | Quando cliente se apresenta. | Cliente chegou. | Selo no card. | Opcional: “você está na fila” no futuro. |
| Em atendimento | Quando barbeiro começa. | Iniciar atendimento. | Card destacado. | Não necessário no MVP. |
| Concluído | Serviço finalizado, independentemente da quitação. | Concluir atendimento. | Histórico atualizado e selo de comanda se houver pendência. | Histórico do cliente. |
| Cancelado | Atendimento não ocorreu. | Cancelar atendimento. | Registro interno. | Portal só se afetar cliente. |

## 4.3 Assinatura

Estados mínimos:

- `Ativa`: pode usar benefícios.
- `Inadimplente`: pagamento pendente; pode agendar avulso, mas benefício fica bloqueado.
- `Pausada`: benefícios suspensos temporariamente.
- `Cancelada`: encerrada pelo cliente ou barbearia.
- `Expirada`: ciclo/contrato terminou sem renovação.

| Estado | Quando nasce/muda | Ação que provoca | Painel | Portal |
|---|---|---|---|---|
| Ativa | Assinatura criada/regularizada. | Criar, reativar ou regularizar. | Selo verde, saldo disponível. | Plano ativo e benefícios. |
| Inadimplente | Pagamento em atraso. | Marcar atraso ou falha de pagamento. | Alerta, ação de cobrar. | Aviso e benefício bloqueado. |
| Pausada | Pausa manual. | Pausar assinatura. | Selo neutro/amber. | Aviso de pausa. |
| Cancelada | Encerramento manual. | Cancelar. | Histórico, sem saldo ativo. | Sem plano ativo, histórico preservado. |
| Expirada | Fim de vigência sem renovação. | Expirar ciclo/contrato. | Alerta de renovação. | Aviso de expirado. |

## 4.4 Comanda

Estados mínimos:

- `Aberta`: contém itens, ainda em edição.
- `Aguardando pagamento`: itens fechados, pagamento pendente.
- `Parcialmente paga`: parte do valor foi recebida.
- `Paga`: valor resolvido.
- `Cancelada`: comanda anulada.

| Estado | Quando nasce/muda | Ação que provoca | Painel | Portal |
|---|---|---|---|---|
| Aberta | Ao criar comanda. | Abrir comanda. | Editável no caixa. | Não aparece no MVP. |
| Aguardando pagamento | Ao fechar itens. | Finalizar itens. | Total pendente. | Não aparece no MVP. |
| Parcialmente paga | Ao receber parte. | Registrar parcial. | Saldo restante. | Não aparece no MVP. |
| Paga | Ao quitar. | Registrar pagamento total. | Entra no fechamento. | Histórico pode mostrar pago no futuro. |
| Cancelada | Ao anular. | Cancelar comanda. | Histórico operacional. | Não aparece no MVP. |

---

# 5. Regra oficial de planos e assinaturas para MVP

## 5.1 Plano

No MVP, um plano deve ter:

- nome;
- descrição curta;
- preço;
- ciclo: mensal ou anual;
- serviços inclusos selecionados;
- quantidade por serviço incluso em cada ciclo;
- desconto opcional em extras;
- status: ativo, rascunho ou inativo;
- texto de regras simples para exibição ao cliente.

Modelo oficial do MVP: **quantidade por serviço incluso**.

Exemplo conceitual:

| Serviço incluso | Quantidade no ciclo |
|---|---|
| Corte | 4 por mês |
| Barba | 2 por mês |

O Bigood não adotará, no MVP, o modelo de “N usos livres entre todos os serviços elegíveis”. Esse modelo parece mais simples na tela, mas cria ambiguidade comercial: um plano anunciado como corte e barba poderia ser consumido apenas em barba, mesmo que a intenção da barbearia fosse limitar cada benefício. Quantidade por serviço continua simples e mais aderente a planos reais de barbearia.

Ficam fora do MVP: regras combinadas por unidade, dia da semana e profissional. A UI pode preparar espaço conceitual para isso, mas não deve fazer o dono configurar algo que o produto ainda não precisa operar.

## 5.2 Assinatura

Uma assinatura deve:

- vincular cliente a plano;
- ter status;
- ter data de início;
- ter próxima cobrança;
- ter saldo de benefícios por serviço incluso, separado em disponível, reservado e consumido;
- permitir pausa, cancelamento e regularização;
- aparecer na ficha do cliente e na área de assinaturas.

## 5.3 Uso do plano

Regra oficial:

- No agendamento, o sistema mostra cobertura real para o momento: incluso com saldo disponível, extra, sem saldo ou benefício bloqueado.
- Ao confirmar um agendamento coberto por plano, o sistema reserva 1 benefício do serviço correspondente.
- Agendamento pendente não reserva benefício; deve avisar que a cobertura só será garantida após confirmação.
- O saldo da assinatura deve distinguir `disponível`, `reservado` e `consumido`.
- Cancelamento dentro da regra libera a reserva.
- Atendimento concluído converte a reserva em consumo quando a comanda confirma o abatimento.
- Se o cliente trocar o serviço durante o atendimento, a reserva original deve ser liberada ou convertida para o serviço correto, conforme o saldo disponível.
- Cancelamento dentro da regra não consome benefício.
- Cancelamento fora da regra pode gerar penalidade, mas a política precisa ser exibida antes de confirmar.
- Falta consumir benefício não será regra fixa no MVP. A spec reserva esse ponto como decisão de produto configurável, com recomendação preliminar de permitir que a barbearia escolha se falta confirmada converte reserva em consumo ou libera a reserva.
- Cliente inadimplente pode ver horários e agendar como avulso, mas não pode usar benefício enquanto inadimplente.

| Situação | Portal | Painel | Comanda | Regra recomendada |
|---|---|---|---|---|
| Serviço incluso | Mostra `Incluso no seu plano`, saldo disponível e aviso de reserva ao confirmar. | Agenda mostra selo do plano e benefício reservado. | Linha de abatimento `Incluso no plano`. | Reserva no agendamento confirmado; consome ao concluir atendimento com abatimento. |
| Serviço fora do plano | Mostra preço avulso e aviso `extra pago`. | Agenda mostra `extra pago`. | Item cobrado normalmente, com desconto se houver. | Não consome saldo. |
| Limite já atingido | Mostra `limite usado neste ciclo` e preço avulso. | Agenda mostra `sem saldo`. | Cobra como extra. | Permitir agendar como avulso. |
| Assinatura inadimplente | Mostra aviso de pendência e benefício bloqueado. | Agenda/comanda destacam bloqueio. | Cobra serviços como avulso. | Benefício fica bloqueado até regularizar. |
| Cliente falta | Portal mostra política antes de confirmar. | Agenda permite marcar `não compareceu` e mostra reserva envolvida. | Sem comanda, salvo taxa futura. | Decisão em aberto: configurável; recomendação preliminar é permitir consumir ou liberar reserva por política da barbearia. |
| Cliente cancela dentro da regra | Mostra cancelamento permitido. | Agenda registra cancelado e libera reserva. | Sem comanda. | Não consome benefício; libera reserva. |
| Cliente cancela fora da regra | Mostra aviso de penalidade antes de confirmar. | Agenda registra cancelado fora da regra e mostra reserva envolvida. | Pode gerar penalidade visual futura. | Decisão em aberto: registrar ocorrência no MVP; consumo/taxa após validação. |

---

# 6. Ajustes funcionais por módulo

| Módulo | Problema atual | Direção correta | Ajustes necessários no frontend | Prioridade |
|---|---|---|---|---|
| Dashboard | Mostra métricas, mas pouca urgência operacional. | Ser painel de abertura do dia. | Bloco `Agora`, próximos atendimentos, alertas de faltas/pagamentos, ocupação do dia. | Alta |
| Agenda | Ainda parece calendário com modal rico. | Virar central operacional. | Status oficiais, ações rápidas, iniciar atendimento, encaixar, abrir comanda, avulso/assinante. | Crítica |
| Clientes | Sem ficha completa. | Cliente como hub. | Ficha com histórico, plano, preferências, observações, próximos horários, comandas e CTAs. | Crítica |
| Profissionais | Cadastro básico. | Equipe operacional e perfil público. | Foto, especialidades, serviços atendidos, dias/horários, perfil do portal. | Média |
| Serviços | Catálogo pouco comercial. | Serviço como item de agenda, portal e plano. | Descrição pública, disponível online, incluso em plano, profissionais aptos, destaque. | Alta |
| Planos | Muitos campos sem narrativa operacional. | Plano como regra de benefícios por serviço. | Redesenhar criação em assistente: dados, serviços inclusos com quantidade por ciclo, extras, regras, preview. | Crítica |
| Assinaturas | Tabela operacional isolada. | Estado recorrente do cliente. | Detalhe de assinatura, saldo disponível/reservado/consumido por serviço, próxima cobrança, status e ações. | Alta |
| Caixa | Falta fechamento do dia. | Fechamento operacional. | Abrir/fechar caixa, resumo por forma, pendências, sangria/suprimento claros. | Alta |
| Comandas | Não evidencia plano, extras e desconto. | Fechar consumo real. | Seções de incluso no plano, extras, produtos, desconto, pagamento parcial. | Crítica |
| Financeiro | Gerencial genérico. | Leitura posterior do realizado. | Separar hoje/semana/mês, origem da receita, realizado vs previsto, vínculo com caixa. | Média |
| Portal | Forte visualmente, fraco para assinante. | Portal refletindo regras do painel. | Cobertura no agendamento, saldo disponível/reservado/consumido, políticas, plano atual detalhado. | Crítica |
| Configurações | Agrupamento heterogêneo. | Configurar operação por domínio. | Abas Empresa, Portal, Agenda, Pagamentos, Políticas; esconder termos prematuros. | Alta |

---

# 7. O que redesenhar, ajustar ou manter

| Área | Decisão | Justificativa |
|---|---|---|
| Dashboard | Ajustar | Base boa; precisa orientar ação do dia. |
| Agenda | Reorganizar parcialmente | Deve virar central operacional sem perder grade atual. |
| Clientes | Reorganizar parcialmente | Precisa de ficha central; carteira e recompras devem permanecer como visões. |
| Profissionais | Ajustar | Cadastro serve, mas falta representação operacional e pública. |
| Serviços | Ajustar | Catálogo bom, mas precisa sustentar portal e planos. |
| Planos | Redesenhar conceitualmente | Pilar de assinatura precisa de simplicidade e regra clara. |
| Assinaturas | Reorganizar parcialmente | Deve orbitar cliente e saldo disponível/reservado/consumido, não apenas tabela. |
| Caixa | Reorganizar parcialmente | Precisa de fechamento do dia e relação natural com comanda. |
| Comandas | Ajustar | Estrutura em etapas é boa; falta plano, desconto e pagamento parcial. |
| Financeiro | Ajustar | Deve ficar como análise gerencial, não caixa duplicado. |
| Portal | Ajustar | Visual forte; precisa refletir planos, políticas e cobertura. |
| Configurações | Reorganizar parcialmente | Agrupar por domínio operacional e reduzir ruído. |
| Landing | Manter quase como está | Está fora da consolidação operacional; manter apenas coerência de promessa. |

---

# 8. Pontos deliberadamente adiados

## 8.1 Pós-MVP próximo

| Item | Por que fica fora agora |
|---|---|
| Pacote de usos livres entre serviços inclusos | O MVP oficial usa quantidade por serviço para evitar ambiguidade comercial; uso livre pode ser validado depois se barbeiros pedirem planos mais flexíveis. |
| Regras por profissional | Importante, mas aumenta complexidade de plano e disponibilidade. |
| Upgrade/downgrade de plano | Deve esperar ciclo básico de assinatura estar claro. |
| Indicadores de uso baixo/excessivo | Excelente para retenção, mas depende de consumo bem definido. |
| Perfil público mais rico do profissional | Pode começar simples com foto e especialidade; agenda avançada depois. |

## 8.2 Fase posterior

| Item | Por que fica fora agora |
|---|---|
| Estoque completo | Bigood precisa fechar atendimento, plano e caixa antes de estoque. |
| Relatórios financeiros avançados | Sem fechamento de caixa forte, relatório avançado é prematuro. |
| Comissões avançadas por regra | Primeiro definir atendimento e comanda. |
| Múltiplas unidades expostas em toda UI | Multiunidade deve ser preparada conceitualmente, mas não dominar MVP. |
| Automações de marketing | Antes precisa haver ficha de cliente e recompras acionáveis. |

## 8.3 Validar com barbeiros antes

| Item | Por que validar |
|---|---|
| Falta consumir benefício automaticamente | Pode ser sensível comercialmente. |
| Cancelamento fora da regra consumir uso | Pode gerar atrito com cliente. |
| Taxa de no-show | Depende de cultura da barbearia. |
| Regras por dia da semana | Pode ser útil para margem, mas também confundir venda. |
| Cadeiras/estações como recurso central | Algumas barbearias operam por profissional, não por cadeira. |

---

# 9. Decisões ainda em aberto

| Decisão em aberto | Opções possíveis | Recomendação inicial | Impacto |
|---|---|---|---|
| Falta consome benefício por padrão? | Sempre consome; nunca consome; configurável. | Manter configurável e validar com barbeiros antes de fixar default operacional. | Afeta margem e atrito com assinante. |
| Cancelamento fora da janela gera que tipo de penalidade? | Apenas registro; consome uso; taxa futura. | MVP registra e avisa; consumo/taxa após validação. | Afeta políticas e portal. |
| Assinatura pode ser comprada diretamente no portal? | Sim; apenas interesse; apenas balcão. | MVP permite demonstrar interesse/checkout visual, mas regra comercial deve ser confirmada. | Afeta checkout e comercial. |
| Plano anual entra no MVP? | Sim com ciclo anual; não; apenas visual. | Permitir ciclo anual simples, sem pró-rata/upgrade. | Afeta precificação e renovação. |
| Unidade aparece no portal no MVP? | Não; apenas se houver mais de uma; sempre. | Mostrar apenas quando houver multiunidade ativa. | Afeta agendamento e endereços. |
| Pagamento parcial entra no primeiro ajuste visual? | Sim; depois; apenas status. | Sim na comanda, de forma simples. | Afeta caixa e pendências. |

---

# 10. Critérios de aceite da consolidação funcional

## 10.1 Checklist geral

- [ ] Agendamento, atendimento, comanda, pagamento, caixa e financeiro aparecem como conceitos distintos.
- [ ] Um barbeiro consegue sair da agenda até comanda/pagamento sem perder contexto.
- [ ] Um atendimento pode ser concluído mesmo com comanda aguardando pagamento ou parcialmente paga.
- [ ] Um cliente assinante entende antes de confirmar se o serviço está incluso ou será cobrado.
- [ ] Um cliente assinante não consegue receber promessa de dois agendamentos inclusos usando o mesmo saldo, porque benefícios confirmados ficam reservados.
- [ ] Uma comanda de assinante mostra plano, reserva convertida em consumo, abatimento e extras.
- [ ] Cliente possui ficha com histórico, plano, preferências e ações.
- [ ] Portal e painel usam a mesma linguagem para plano, assinatura, agendamento e status.
- [ ] Dashboard inicial mostra ações operacionais do dia, não apenas métricas.
- [ ] Configurações deixam claro o que afeta portal, agenda, pagamentos e políticas.

## 10.2 Checklist por módulo

| Módulo | Critérios de aceite |
|---|---|
| Dashboard | Mostra próximo atendimento, alertas, ocupação do dia e atalhos para ação. |
| Agenda | Cards exibem status, cliente, tipo avulso/assinante, serviço, horário e ações rápidas. |
| Clientes | Existe ficha com histórico, plano, observações, preferências, recompras e CTAs. |
| Profissionais | Profissional tem dados internos e apresentação mínima para portal. |
| Serviços | Serviço define preço, duração, descrição pública, disponibilidade online e relação com plano. |
| Planos | Criação de plano deixa claro serviços inclusos, quantidade por serviço no ciclo, desconto em extras e preview. |
| Assinaturas | Assinatura mostra status, saldo disponível/reservado/consumido por serviço, ciclo, próxima cobrança e ações de pausa/cancelamento. |
| Caixa | Existe fluxo de fechamento do dia com resumo por forma de pagamento e pendências. |
| Comandas | Comanda separa inclusos no plano, extras pagos, produtos, descontos, pagamento e pendências sem alterar estado do atendimento. |
| Financeiro | Separa leitura gerencial de caixa operacional e mostra origem da receita. |
| Portal | Mostra plano atual, saldo disponível/reservado/consumido, políticas e cobertura no agendamento. |
| Configurações | Regras de agenda e políticas ficam agrupadas e refletidas no portal. |

---

# 11. Sequência recomendada de execução

## Fase 1 — Decisões de domínio e estados

| Campo | Definição |
|---|---|
| Objetivo | Consolidar linguagem e estados oficiais antes de mexer nas telas. |
| Entregáveis | Glossário do produto, estados de agendamento/atendimento/assinatura/comanda, regras de reserva e consumo MVP. |
| Dependências | Esta spec aprovada. |
| Critério de conclusão | Equipe consegue explicar o fluxo agenda → atendimento → comanda → pagamento → caixa sem misturar os conceitos. |

## Fase 2 — Agenda e atendimento

| Campo | Definição |
|---|---|
| Objetivo | Transformar agenda em central operacional do dia. |
| Entregáveis | Cards com status e ações, fluxo de chegada/início/conclusão independente de pagamento, encaixe, abrir comanda. |
| Dependências | Estados oficiais definidos. |
| Critério de conclusão | Barbeiro consegue operar um atendimento do card da agenda até a comanda. |

## Fase 3 — Planos e portal de assinante

| Campo | Definição |
|---|---|
| Objetivo | Tornar assinatura clara e operacional. |
| Entregáveis | Redesenho de plano com quantidade por serviço, saldo disponível/reservado/consumido, cobertura no portal, regras visíveis. |
| Dependências | Regra de uso do plano aprovada. |
| Critério de conclusão | Assinante e barbeiro veem a mesma cobertura, reservas e saldo por serviço. |

## Fase 4 — Ficha do cliente

| Campo | Definição |
|---|---|
| Objetivo | Fazer cliente virar hub de relacionamento. |
| Entregáveis | Perfil com histórico, plano, próximos horários, comandas, observações, preferências e recompras. |
| Dependências | Agenda/atendimento e assinatura definidos. |
| Critério de conclusão | Atendente entende a situação completa do cliente em uma tela. |

## Fase 5 — Comanda e caixa

| Campo | Definição |
|---|---|
| Objetivo | Fechar a operação do atendimento e do dia. |
| Entregáveis | Comanda com plano/extras/desconto/parcial; fechamento de caixa; pendências. |
| Dependências | Atendimento e reserva/consumo do plano definidos. |
| Critério de conclusão | Dono consegue conferir o dia por forma de pagamento e comandas. |

## Fase 6 — Configurações e refinamentos

| Campo | Definição |
|---|---|
| Objetivo | Organizar regras que sustentam portal e operação. |
| Entregáveis | Abas de configuração, políticas de cancelamento/falta, regras de agenda, portal refletindo regras. |
| Dependências | Fluxos principais estabilizados. |
| Critério de conclusão | Dono sabe onde configurar cada regra que o cliente vê no portal. |

---

# Veredito final da spec

A arquitetura funcional consolidada do Bigood passa a ser:

1. Agenda como central do dia.
2. Atendimento como elo operacional.
3. Cliente como centro do histórico.
4. Plano como regra de benefícios.
5. Assinatura como aplicação do plano ao cliente.
6. Comanda como registro de consumo e cobrança.
7. Pagamento como quitação total ou parcial da comanda.
8. Caixa como fechamento operacional.
9. Financeiro como leitura gerencial posterior.
10. Portal como reflexo das regras do painel.

A mudança mais importante em relação ao estado atual é explicitar `atendimento` como conceito central sem transformá-lo em cobrança. Sem isso, agenda, comanda, plano e histórico continuam parecendo módulos próximos, mas não um fluxo único.

Antes de qualquer backend real, devem estar decididos:

- estados oficiais de agendamento, atendimento, assinatura e comanda;
- regra MVP de reserva e consumo de benefício;
- relação entre atendimento, comanda, pagamento e caixa;
- ficha do cliente como hub;
- o que o portal mostra para avulso e assinante.

Pode ser prototipado visualmente depois:

- multiunidade avançada;
- regras complexas por profissional/dia/unidade;
- upgrade/downgrade sofisticado;
- estoque completo;
- automações de marketing;
- relatórios financeiros avançados.

Com esta consolidação, o Bigood deixa de ser apenas um conjunto de telas bem desenhadas e passa a ter uma arquitetura funcional clara para produto e backend.
