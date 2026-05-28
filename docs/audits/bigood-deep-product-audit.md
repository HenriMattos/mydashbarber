# Auditoria profunda do Bigood

Exame de produto, fluxos, coerencia e decisoes antes do backend.

Data: 2026-05-20  
Escopo: frontend atual do Bigood como prototipo navegavel e base de produto.  
Nao escopo: implementacao, refatoracao, seguranca tecnica, banco de dados e avaliacao de backend pronto.

## 1. Produto real que existe hoje

### 1.1 Mapa de modulos e submodulos

| Modulo | Finalidade aparente | Usuario principal | Fluxos que suporta | Grau de maturidade | Observacoes |
|---|---|---|---|---|---|
| Dashboard | Leitura operacional do dia e visao estrategica | Dono/gestor | Ver agenda de hoje, faturamento, clientes, ticket, metas e horarios de pico | Maduro para produto visual | Boa primeira tela, mas ainda falta "o que exige acao agora". |
| Agenda | Organizar horarios por profissional | Barbeiro/operador | Ver dia, criar agendamento, bloquear horario, criar intervalo, sugerir retorno | Parcial | Tem boa estrutura, mas nao e ainda a central operacional completa do atendimento. |
| Clientes | Acompanhar base, recorrencia e recompras | Dono/atendente | Ver carteira, destaques, listagem, cadastro, recompras sugeridas | Parcial | A area parece CRM resumido, mas falta ficha operacional do cliente. |
| Profissionais | Cadastrar e gerenciar equipe | Dono/gestor | Cadastrar, editar, ativar/inativar, ver escalas simples | Parcial | Serve para cadastro basico; fraco para agenda real e portal. |
| Servicos | Gerenciar catalogo da barbearia | Dono/gestor | Cadastrar, listar, ordenar, destacar, ocultar | Parcial | Bom inicio, mas falta informacao comercial/publica e relacao com planos. |
| Planos | Criar e gerenciar produtos de assinatura | Dono/comercial | Criar plano, listar cards, editar dados principais, inativar | Precisa ser redesenhado antes do backend | E o pilar do produto, mas a tela mistura muitos campos sem deixar a regra operacional clara. |
| Assinaturas | Gerenciar adesoes de clientes aos planos | Dono/financeiro | Criar assinatura, editar, pausar, filtrar, ver inadimplentes | Parcial | A separacao plano x assinatura esta correta em tese, mas pouco explicada ao usuario. |
| Caixa | Operar dinheiro do dia | Barbeiro/caixa | Ver saldo, criar comanda, registrar entrada e saida | Parcial | Tem boa base, mas precisa virar fluxo de fechamento do atendimento e do dia. |
| Comandas | Detalhar atendimento/venda | Barbeiro/caixa | Criar, editar, adicionar produtos e servicos, status de pagamento | Parcial | A comanda e util, mas nao deixa claro assinante x avulso e falta desconto/pagamento parcial. |
| Financeiro | Visao gerencial de receitas/despesas | Dono/gestor | Indicadores, receitas, despesas, contas, categorias, formas de pagamento | Bonito, mas funcionalmente raso | Visualmente forte, mas ainda generico para decisoes de barbearia. |
| Empresa / Configuracoes | Configurar empresa, portal, endereco, imagens, regras | Dono/admin | Dados da empresa, portal, horario exibido, pagamentos, imagens, localizacao, redes, tolerancia | Parcial | Cobre muito, mas algumas regras operacionais estao dispersas e nomes sao pouco claros. |
| Portal do cliente | Experiencia mobile do cliente final | Cliente avulso/assinante | Ver barbearia, servicos, planos, agendar, ver agenda, perfil | Maduro visualmente; parcial funcionalmente | Forte como app mobile, mas fraco para explicar plano, cobertura, regras e estado da conta. |
| Landing / comercial | Aquecer lead e demonstrar valor | Visitante/dono | Conhecer produto, pedir demonstracao, entrar | Maduro para produto visual | Esta fora do fluxo operacional, mas comunica bem o produto. |

### 1.2 Modelo mental atual do sistema

O modelo atual implicito e este:

| Conceito | O que o Bigood parece dizer hoje | Leitura critica |
|---|---|---|
| Cliente | Pessoa atendida pela barbearia, com telefone, email, visitas, ticket e status | Claro como cadastro basico, incompleto como centro operacional. |
| Assinante | Cliente associado a um plano e a uma proxima cobranca | Correto em tese, mas visualmente pouco ligado a beneficios, consumo e atendimento. |
| Plano | Produto comercial recorrente com preco, beneficio e limite simples | Ambiguo: parece produto, regra de beneficios e contrato ao mesmo tempo. |
| Assinatura | Adesao individual de cliente a plano | Conceito correto, mas tela precisa explicar melhor diferenca entre plano e assinatura. |
| Agendamento | Reserva de horario na agenda | Ambiguo: nao fica claro quando vira atendimento, falta, cancelamento ou comanda. |
| Atendimento | Nao aparece como entidade clara | Problema central: atendimento esta misturado entre agenda e comanda. |
| Comanda | Registro operacional de venda/atendimento | Boa ideia, mas deveria nascer naturalmente do atendimento ou da agenda. |
| Caixa | Controle do dia, entradas, saidas e comandas | Parcialmente claro, mas falta fechamento do dia. |
| Financeiro | Visao gerencial consolidada | Claro como painel gerencial, generico como rotina de dono. |
| Portal | Camada do cliente para agendar, ver planos e perfil | Visualmente conectado, mas conceitualmente ainda nao reflete todas as regras do painel. |

Ponto mais importante: o produto ainda nao separa bem `agendamento`, `atendimento`, `comanda` e `pagamento`. Isso tende a gerar confusao de produto se for levado para implementacao definitiva sem decisao explicita.

## 2. Estrutura funcional: correta ou mal concebida?

### Agenda

A agenda nao deveria ser apenas calendario. Para uma barbearia, ela e a central operacional do dia. Hoje ela se aproxima disso, mas ainda opera mais como quadro de horarios.

Deveria concentrar:

- proximo cliente;
- status de chegada;
- inicio do atendimento;
- conclusao;
- falta;
- cancelamento;
- remarcacao;
- abrir comanda;
- identificar cliente assinante;
- destacar encaixes possiveis.

Falta uma camada clara de "atendimento em andamento". A solucao mais simples nao e criar um modulo separado agora, e sim fazer a agenda ganhar acoes operacionais e um status de atendimento.

### Clientes

Clientes deveriam ser o centro que conecta historico, plano, agendamentos, comandas, preferencias e relacionamento. Hoje a area de clientes serve mais como resumo de carteira e lista editavel.

Boa direcao: recompras e clientes em destaque.  
Problema: falta ficha de cliente. Sem ela, a informacao fica espalhada por agenda, assinaturas, caixa e planos.

### Planos e assinaturas

A separacao conceitual correta seria:

- Plano: modelo comercial e regra de beneficios.
- Assinatura: adesao de um cliente a um plano.

O Bigood aponta nessa direcao, mas a interface ainda nao ensina isso bem. A criacao de plano tenta cobrir descontos, servicos, produtos, profissionais, dias e contrato, mas nao transforma isso em uma narrativa simples: "o cliente paga X e tem direito a Y dentro de Z regras".

Aqui existe risco de concepcao: a tela de plano esta rica demais antes de estar clara.

### Caixa, comanda e financeiro

A organizacao ideal para barbearia:

1. Agenda/reserva.
2. Atendimento acontece.
3. Comanda registra o que foi consumido.
4. Caixa recebe ou marca pendencia.
5. Financeiro interpreta o realizado.

Hoje as pecas existem, mas a interface ainda nao deixa esse caminho inevitavel. A comanda parece modulo independente e o financeiro parece painel gerencial separado do fechamento do dia.

Mais simples: colocar a agenda como ponto de inicio e o caixa como ponto de fechamento do atendimento. Financeiro deve ser leitura posterior, nao competir com caixa.

### Portal do cliente

O portal e centrado em agendar, o que esta correto para avulso. Para assinante, ele deveria ser centrado em "meu plano + o que posso usar + proximos horarios". Hoje planos aparecem bem, mas ainda como vitrine, nao como estado operacional de conta.

## Erros de concepcao detectados

| Gravidade | Problema | Por que e conceitualmente errado | Exemplo concreto no Bigood | Consequencia se for para o backend assim | Melhor direcao |
|---|---|---|---|---|---|
| Critica | Atendimento nao existe como conceito claro | Barbearia opera atendimentos, nao apenas agendamentos e comandas | Agenda cria reserva; comanda fecha venda; nao ha etapa "em atendimento" | Backend pode misturar appointment, sale e service usage | Tratar atendimento como ciclo operacional: reservado, iniciado, concluido, faltou, cancelado. |
| Critica | Plano tenta ser card, contrato, regra e desconto ao mesmo tempo | O dono precisa entender direito o que vende | Criacao de plano tem muitos blocos, mas resumo operacional fraco | Modelagem de plano ficara confusa e dificil de validar | Redesenhar plano como regra simples de beneficios por ciclo. |
| Alta | Comanda esta independente demais da agenda | No dia a dia, comanda normalmente nasce de atendimento ou venda rapida | Caixa permite criar comanda separada e escolher agendamento | Operador pode duplicar ou perder contexto | Agenda deve ter "abrir comanda"; caixa deve permitir venda avulsa quando nao ha agenda. |
| Alta | Cliente nao e o centro do historico | Cliente deveria amarrar plano, agenda, consumo, preferencias e pagamentos | Listagem edita dados basicos, mas nao mostra linha do tempo | Historico ficara espalhado entre modulos | Criar ficha do cliente como hub. |
| Alta | Portal de assinante e vitrine, nao conta de assinante | Assinante quer saber direitos, uso e regras | Plano atual mostra beneficios, mas nao saldo/uso | Cliente e barbeiro terao expectativa diferente | Portal deve ter "meus beneficios" com usado/restante. |
| Media | Financeiro aparece antes de fechamento operacional estar claro | Dono primeiro confere dia, depois analisa gestao | Financeiro tem indicadores amplos, mas caixa nao tem fechamento forte | Pode virar painel bonito sem rotina confiavel | Fortalecer fechamento de caixa antes de aprofundar DRE. |
| Media | Configuracoes misturam essencial, opcional e termos externos | Dono pode nao saber o que precisa configurar para operar | Dpote, Clube da Barba, vale, portal e tolerancia no mesmo fluxo | Onboarding fica confuso | Agrupar por: empresa, agenda, portal, pagamentos, politicas. |
| Media | Profissional e pouco comercial no portal | Cliente escolhe barbeiro sem foto, bio ou especialidade | Portal lista nome e cargo | Escolha de profissional fica fria | Adicionar perfil simples: foto, especialidades e disponibilidade. |

## 3. Simulacao aprofundada de operacao real

### 3.1 Operacao normal de um dia

| Etapa | O Bigood sustenta? | Onde? | O que falta? | O que esta mal pensado? | Como deveria ser mais simples? |
|---|---|---|---|---|---|
| 1. Dono abre o sistema | Parcial | Dashboard | Alertas e "agora" | Numeros bons, pouca urgencia operacional | Bloco "agora na barbearia". |
| 2. Ve agenda do dia | Sim parcial | Agenda / Dashboard | Status mais ricos e proximo atendimento destacado | Agenda e calendario, nao cockpit | Timeline por profissional + lista de proximos. |
| 3. Confere profissionais ativos | Parcial | Profissionais / Agenda | Ocupacao e ausencias do dia | Escala pouco ligada ao dia | Mostrar equipe ativa hoje na agenda. |
| 4. Checa clientes agendados | Parcial | Agenda | Tipo de cliente, plano, historico rapido | Card nao prioriza info operacional | Card com cliente, servico, plano, status, acao. |
| 5. Identifica avulsos e assinantes | Fraco | Clientes / Assinaturas | Selo no agendamento e comanda | Conceito nao acompanha o fluxo | Selo "Avulso" / "Plano X" em agenda e caixa. |
| 6. Cliente chega | Fraco | Agenda | Acao "cliente chegou" | Nao ha status de chegada | Botao rapido no card. |
| 7. Barbeiro inicia atendimento | Fraco | Agenda | Acao iniciar | Atendimento nao existe | Estado "em atendimento". |
| 8. Cliente pede extra | Parcial | Comanda | Distincao extra pago vs incluso | Extra e item comum | Comanda mostrar cobertura do plano e extras. |
| 9. Atendimento termina | Fraco | Agenda / Comanda | Concluir atendimento | Finalizacao nao e um fluxo guiado | "Concluir" abre/resume comanda. |
| 10. Gera comanda | Parcial | Caixa / Comandas | Criacao a partir do atendimento | Comanda parece paralela | Botao direto na agenda. |
| 11. Diferencia se corte entra no plano | Fraco | Planos / Comanda | Cobertura do beneficio | Barbeiro nao sabe se cobrar | Resumo de direito do cliente na comanda. |
| 12. Extras sao cobrados | Parcial | Comanda | Separar incluso, desconto e extra | Tudo vira item de venda | Agrupar: incluso no plano / extras / produtos. |
| 13. Pagamento e feito | Parcial | Comanda / Caixa | Parcial, dividido, desconto, gorjeta | Pagamento e simples demais | Modal de pagamento completo. |
| 14. Caixa recebe | Parcial | Caixa | Fechamento e conferencia | Saldo existe, mas rotina do dia falta | Abrir/fechar caixa com resumo por forma. |
| 15. Financeiro reflete | Parcial visual | Financeiro | Origem por servico/produto/plano | Financeiro generico | Financeiro como relatorio do realizado. |
| 16. Historico do cliente atualiza | Fraco | Clientes | Linha do tempo | Cliente nao e hub | Ficha do cliente com historico. |
| 17. Dono fecha o dia | Fraco | Caixa / Financeiro | Fluxo de fechamento | Nao ha ritual claro | Tela "Fechamento do dia". |

### 3.2 Cliente avulso: caminhos importantes

| Cenario | Existe? | Esta correto? | Precisa existir? | Melhor solucao |
|---|---|---|---|---|
| Cliente novo agenda online | Parcial | Fluxo e facil, mas falta explicar pagamento e politica | Sim, essencial | Portal deve mostrar valor, regras e dados minimos antes de confirmar. |
| Cliente existente agenda online | Parcial | Cliente entra e ve agendamentos, mas sem ficha rica | Sim | Reconhecer historico e preferencias no portal. |
| Cliente chega sem agendar | Parcial | Pode abrir comanda/venda, mas nao ha fluxo "encaixe" forte | Sim, essencial | Agenda deve ter acao "encaixar agora". |
| Cliente manda WhatsApp e barbeiro agenda | Sim parcial | Agenda manual cobre bem o basico | Sim | Adicionar origem do agendamento e confirmacao. |
| Cliente muda de profissional | Parcial | Reagendar existe no portal, mas sem contexto de troca | Sim | Reagendamento deve permitir alterar profissional/data/hora com resumo. |
| Cliente remarca | Parcial | Botao existe, mas parece criar novo fluxo | Sim | Modal dedicado de remarcacao com motivo opcional. |
| Cliente cancela | Fraco | Nao aparece como acao principal no portal | Sim | Cancelar com politica e confirmacao. |
| Cliente falta | Fraco | Falta nao e status claro | Sim | Acao "marcar falta" na agenda. |
| Cliente consome servico e produto | Sim parcial | Comanda cobre itens | Sim | Comanda deve ser mais rapida e ligada ao atendimento. |
| Cliente paga parcialmente | Nao claro | Pagamento parcial existe como status, mas sem fluxo robusto | Importante | Modal de pagamento parcial/dividido. |
| Cliente recebe desconto | Fraco | Desconto nao e evidente no fluxo de comanda atual | Sim | Campo desconto com motivo. |
| Cliente volta depois de 30 dias | Parcial | Recompras sugeridas existem | Sim | Lembrete individual e acao de reagendar. |
| Cliente recebe proposta de plano | Parcial | Acoes recomendadas sugerem oferecer planos | Sim | Acao "oferecer plano" no perfil do cliente. |
| Cliente vira assinante | Parcial | Assinatura pode ser criada | Sim | Fluxo guiado a partir do cliente ou comanda. |

### 3.3 Cliente assinante: operacao de verdade

| Cenario | Portal sustenta? | Dashboard sustenta? | A regra esta clara? | O fluxo e correto? | Decisao antes do backend |
|---|---|---|---|---|---|
| Visualiza planos | Sim parcial | Sim | Parcial | Vitrine boa, detalhe fraco | Definir modelo minimo de comparacao de planos. |
| Entende um plano | Parcial | Parcial | Nao totalmente | Beneficios sao genericos | Definir linguagem de beneficio: incluso, limite, desconto, regra. |
| Contrata ou e cadastrado manualmente | Parcial | Parcial | Parcial | Caminhos existem, mas pouco conectados | Decidir se assinatura nasce no portal, no balcao ou ambos. |
| Passa a ter status de assinante | Parcial | Parcial | Parcial | Status simples demais | Definir status oficiais. |
| Agenda servico incluso | Fraco | Fraco | Nao | Portal nao deixa claro cobertura | Definir se cobertura e mostrada no agendamento. |
| Agenda servico nao incluso | Fraco | Fraco | Nao | Falta aviso de extra pago | Definir regra de extra fora do plano. |
| Agenda acima do limite | Fraco | Fraco | Nao | Nao ha feedback de limite | Definir bloqueia, cobra extra ou permite aviso. |
| Agenda profissional elegivel/nao elegivel | Fraco | Parcial | Nao | Profissionais por plano aparecem na criacao, mas nao viram experiencia clara | Definir elegibilidade por profissional. |
| Agenda em dia permitido/nao permitido | Fraco | Parcial | Nao | Dias de gratuidade/confusos | Definir se plano restringe dia ou so da beneficio. |
| Usa beneficio parcial | Fraco | Fraco | Nao | Nao ha saldo visual | Definir unidade de consumo. |
| Compra extra | Parcial | Parcial | Parcial | Comanda aceita item, mas nao separa extra | Definir exibicao de extra pago. |
| Falta atendimento | Fraco | Fraco | Nao | Falta nao existe bem | Definir se falta consome beneficio. |
| Cancela | Fraco | Parcial | Nao | Cancelamento nao e regra visivel | Definir janela e penalidade. |
| Fica inadimplente | Fraco | Parcial | Parcial | Inadimplentes existe, portal nao comunica estado | Definir bloqueio/aviso. |
| Plano pausado | Fraco | Parcial | Parcial | Pausar assinatura existe, mas sem efeito visual claro | Definir direitos em pausa. |
| Plano expirado | Fraco | Fraco | Nao | Status nao esta completo | Definir expiracao e renovacao. |
| Renova | Fraco | Parcial | Nao | Proxima cobranca aparece, renovacao nao e fluxo | Definir renovacao automatica/manual. |
| Troca de plano | Fraco | Fraco | Nao | Nao ha upgrade/downgrade claro | Definir troca e prorata se existir. |
| Cancela assinatura | Fraco | Fraco | Nao | Acao nao esta clara | Definir cancelamento e efeito no portal. |

## 4. Coerencia entre dashboard e portal

### 4.1 Matriz Painel -> Portal

| Configuracao no painel | Reflete no portal? | Como? | Esta correto? | Problema |
|---|---|---|---|---|
| Servicos | Sim parcial | Lista de servicos com nome, duracao, preco | Parcial | Falta descricao publica, categoria e indicacao de plano. |
| Preco | Sim | Valor aparece no card e agendamento | Sim parcial | Falta diferenciar preco avulso, desconto e incluso. |
| Duracao | Sim | Minutos no portal | Sim | Nao considera variacao por profissional. |
| Profissionais | Sim parcial | Nome e cargo | Parcial | Falta foto, especialidade, bio e disponibilidade. |
| Horarios | Parcial | Horario exibido da empresa | Parcial | Slots do agendamento nao parecem guiados por configuracao fina. |
| Bloqueios | Nao claro | Nao aparece ao cliente como indisponibilidade explicada | Fraco | Bloqueio e operacional, mas deveria afetar horario visivel. |
| Regras de agenda | Nao claro | Tolerancia existe em empresa, mas nao aparece no portal | Fraco | Cliente nao ve politica antes de agendar/cancelar. |
| Planos | Sim parcial | Cards de planos | Parcial | Beneficios simplificados demais. |
| Beneficios | Sim parcial | Bullets genericos | Fraco | Falta uso/restante e regra especifica. |
| Limites | Parcial | "X atendimentos por ciclo" | Fraco | Nao explica limite por servico, ciclo ou excesso. |
| Empresa | Sim | Nome, slogan, endereco, redes | Bom | Pode melhorar microcopy. |
| Branding | Sim | Logo/banner | Bom | Um dos pontos fortes. |
| Endereco | Sim | Pill e detalhe do agendamento | Bom | Poderia ter abrir mapa. |
| Politicas | Nao claro | Pouco visivel no portal | Fraco | Cancelamento, atraso e no-show precisam aparecer. |
| Unidades | Nao | Nao ha experiencia clara | Em aberto | Se multiunidade e futuro, precisa decidir quando aparece. |

### 4.2 Matriz Portal -> Painel

| Item do portal | De onde deveria vir no painel | Dono controla? | Existe regra configuravel? | Promessa sem sustentacao clara |
|---|---|---|---|---|
| Agendamento | Agenda, servicos, profissionais, horarios | Parcial | Parcial | Disponibilidade e regras nao estao claras. |
| Selecao de servico | Servicos | Parcial | Parcial | Nao ha descricao/segmentacao suficiente. |
| Selecao de profissional | Profissionais | Parcial | Fraco | Falta perfil publico e elegibilidade. |
| Planos disponiveis | Planos | Parcial | Parcial | Plano nao tem regra completa de beneficio. |
| Plano atual | Assinaturas | Parcial | Parcial | Falta estado de uso, inadimplencia e beneficios. |
| Proximos horarios | Agenda/configuracoes | Parcial | Fraco | Slots parecem simples demais para operacao real. |
| Cancelamento/remarcacao | Agenda/regras | Fraco | Parcial | Portal mostra reagendar, mas cancelamento e regras sao fracos. |
| Historico | Clientes/agenda | Fraco | Nao | Historico do cliente no painel e pouco centralizado. |
| Beneficios | Plano/assinatura | Fraco | Fraco | Beneficio nao e operacional o bastante. |
| Regras de uso | Planos/configuracoes | Fraco | Fraco | Cliente nao ve contrato resumido. |
| Mensagens ao cliente | Configuracoes/notificacoes | Fraco | Fraco | Comunicacao ainda nao e produto. |

### Contradicoes painel x portal

- Portal usa linguagem de "beneficios exclusivos", mas o painel ainda nao ajuda o dono a operar beneficio com clareza.
- Painel permite configurar campos de plano muito especificos, mas portal resume em bullets simples.
- Portal permite reagendar, mas o painel nao apresenta uma experiencia operacional equivalente de solicitacao, aprovacao ou motivo.
- Painel tem recompras e recorrencia, mas portal nao usa isso para sugerir retorno.
- Painel fala em caixa, comanda e financeiro; portal nao comunica ao cliente quando um servico e avulso, incluso ou extra.
- Painel tem profissionais como equipe interna; portal precisa de profissionais como escolha de confianca.
- Configuracoes incluem politicas, mas portal nao as apresenta com destaque suficiente.

## 5. Auditoria do conceito central: assinatura

### 5.1 A assinatura e realmente o centro?

Hoje o Bigood parece um bom sistema de agenda/caixa com planos adicionados. Ainda nao parece um produto cuja assinatura e o motor operacional.

O dono entende que ha planos e assinaturas, mas nao entende rapidamente:

- como proteger margem;
- como controlar uso;
- como saber se o cliente esta usando demais ou de menos;
- como saber o que cobrar no atendimento;
- como vender o plano certo para um cliente recorrente.

O cliente entende que existem planos, mas nao entende plenamente:

- o que esta incluso;
- quanto ja usou;
- o que resta;
- se um servico escolhido sera cobrado;
- quais regras podem bloquear uso.

### 5.2 Mecanismos essenciais, importantes ou exagerados

| Mecanismo | Classificacao | Motivo |
|---|---|---|
| Servico incluso no plano | Essencial para MVP | Sem isso, plano nao opera. |
| Quantidade de usos por ciclo | Essencial para MVP | Controla valor e margem. |
| Uso/restante no portal | Essencial para MVP | Evita duvida do assinante. |
| Extra pago fora do plano | Essencial para MVP | Barbearias vendem servicos/produtos adicionais. |
| Status ativo/inadimplente/pausado/cancelado | Essencial para MVP | Define atendimento e comunicacao. |
| Consumo refletido na comanda | Essencial para MVP | Barbeiro precisa saber cobrar ou abater. |
| Renovacao/proxima cobranca | Essencial para MVP | Recorrencia depende disso. |
| Limite por servico | Importante depois | Pode entrar quando houver planos mais complexos. |
| Regras por profissional | Importante depois | Util para barbearias maiores; nao deve travar MVP. |
| Regras por unidade | Importante depois | Depende de multiunidade. |
| Regras por dia da semana | Importante depois | Boa para margem, mas pode complicar cedo. |
| Beneficio acumulavel ou nao | Importante depois | Relevante, mas pode ser decisao simples no MVP: nao acumula. |
| Periodo de carencia | Importante depois | Pode esperar se venda for local/consultiva. |
| Upgrade/downgrade | Importante depois | Necessario para maturidade, nao para primeiro backend. |
| Uso nao transferivel | Importante depois | Pode ser texto de regra antes de automatizar. |
| Indicadores de uso baixo/excessivo | Importante depois | Excelente para gestao, nao bloqueia MVP. |
| Produtos inclusos sofisticados | Exagero agora | Pode confundir; comece por servicos e desconto simples. |
| Multiplas regras por unidade/profissional/dia combinadas | Exagero agora | Alto custo mental e operacional. |

Direcao recomendada: MVP de assinatura deve ser simples:

1. Plano tem preco, ciclo, status e descricao.
2. Plano inclui N usos de servicos selecionados por ciclo.
3. Extras podem ter desconto percentual.
4. Assinatura tem status e saldo do ciclo.
5. Comanda mostra incluso/restante/extra.

## 6. Auditoria de simplicidade

| Area | O que parece complexo demais | Por que pode atrapalhar | Versao mais simples recomendada |
|---|---|---|---|
| Planos | Muitos blocos: categorias, servicos, produtos, profissionais, gratuidade, contrato | Dono pode nao saber qual regra realmente importa | Assistente de plano com 4 passos: dados, servicos inclusos, descontos extras, preview. |
| Financeiro | Muitos indicadores antes de fechamento do dia estar forte | Pode parecer sofisticado, mas nao ajudar o caixa | Priorizar "hoje", "semana", "mes" e origem da receita. |
| Configuracoes | Empresa, portal, pagamento, Dpote, clube, vale e politicas juntos | Dificulta descobrir onde ajustar regra | Separar em abas: Empresa, Portal, Agenda, Pagamentos, Politicas. |
| Comanda | Criacao manual em etapas sem sempre vir da agenda | Pode ser lenta no balcao | "Abrir comanda" a partir da agenda; venda avulsa como alternativa. |
| Clientes | Dashboard de carteira antes da ficha completa | Bonito, mas atendimento precisa de detalhe | Ficha do cliente como centro; carteira como resumo. |
| Profissionais | Escala simples e cadastro separados, mas pouco ligados ao portal | Nao ajuda cliente a escolher | Perfil publico simples do profissional. |
| Assinaturas | Gerenciar assinatura separado de cliente sem ficha | Dono pensa por cliente, nao por tabela | Assinaturas aparecem na ficha do cliente e em visao geral. |
| Agenda | Modal completo, mas card pouco acionavel | Operador precisa agir rapido | Card com acoes rapidas e detalhes progressivos. |

## Decisoes obrigatorias antes do backend

| Decisao | Por que precisa ser definida agora | O que o frontend atual sugere | Risco de seguir sem decidir | Recomendacao |
|---|---|---|---|---|
| O que e um atendimento? | E o elo entre agenda, comanda e historico | Nao aparece claramente | Misturar reserva, venda e consumo | Definir atendimento como execucao de um agendamento ou encaixe. |
| Quando uma comanda nasce? | Afeta caixa e operacao | Pode nascer manualmente ou de agendamento | Fluxos duplicados | Nasce ao iniciar/concluir atendimento; venda avulsa e excecao. |
| Agendamento concluido sempre vira atendimento? | Define historico e consumo | Nao definido | Historico inconsistente | Sim, se status concluido; falta/cancelado nao vira atendimento. |
| Plano cobre no agendamento ou na comanda? | Define expectativa do cliente | Portal sugere antes, comanda cobra depois | Cliente pode achar que usou algo sem confirmacao | Mostrar previsao no agendamento e confirmar consumo na comanda. |
| Cliente inadimplente pode agendar? | Define experiencia e risco | Inadimplencia existe no painel, nao no portal | Regra contraditoria | Permitir ver horarios, bloquear beneficio ou exigir regularizacao. |
| Falta consome beneficio? | Protege agenda e margem | Falta nao e clara | Discussao com cliente | Definir regra simples e mostrar no portal. |
| Cancelamento consome beneficio? | Afeta plano e politica | Tolerancia existe, mas pouco aplicada | Penalidade obscura | Nao consome dentro da janela; consome ou penaliza fora dela. |
| Assinante pode comprar extra? | Barbearia precisa vender alem do plano | Comanda aceita itens | Se nao separar, margem fica invisivel | Sim, com secao "extras pagos". |
| Plano e por unidade ou empresa? | Multiunidade futura | Unidade ainda fraca | Redesenho de assinatura depois | MVP por empresa; preparar campo de unidade sem expor demais. |
| Profissional pode ter agenda propria? | Essencial para barbearia | Sim, horarios por profissional | Se nao detalhar dias, disponibilidade ruim | Sim, com dias/intervalos por profissional. |
| Servico varia por profissional? | Duracao/preco podem variar | Nao claro | Agenda calcula errado | MVP usa duracao padrao; variacao depois. |
| Caixa e por unidade, usuario ou dia? | Fechamento depende disso | Caixa do dia generico | Fechamento confuso | MVP: caixa por empresa/unidade e dia. |
| Comanda pode existir sem agendamento? | Walk-in existe | Sim | Se nao separar, relatorios confundem | Sim: tipo venda avulsa/encaixe. |
| Financeiro registra previsao ou realizado? | Indicadores dependem disso | Mistura leitura gerencial com caixa | Numeros perdem confianca | Separar previsto de realizado visualmente. |
| Plano pode acumular uso? | Define saldo do assinante | Nao claro | Cliente espera acumulado | MVP: nao acumula. |
| Quem pode cancelar/remarcar? | Portal precisa orientar | Reagendar existe; cancelar fraco | Cliente sem regra | Definir janela e mensagens. |

## 8. Inspecao do codigo como evidencia

Esta auditoria usou o codigo apenas para confirmar comportamento e conceitos visiveis.

Evidencias principais:

- `components/admin/nav-items.ts`: confirma a estrutura de modulos e submodulos do painel.
- `components/admin/dashboard-view.tsx`: dashboard alterna entre operacional e estrategico; agenda de hoje e metas existem.
- `components/admin/agenda-view.tsx`: agenda tem eventos, bloqueios, intervalos, cadastro rapido de cliente, retorno/recompra e modal em etapas.
- `components/admin/clientes-list-manager.tsx` e `app/(admin)/clientes/page.tsx`: clientes existem como carteira/listagem, mas nao como ficha completa.
- `app/(admin)/planos/criar/page.tsx`: criacao de plano possui varios campos de regras, descontos e produtos, mas a experiencia nao resume a regra de forma simples.
- `app/(admin)/assinaturas/gerenciar/page.tsx`: assinatura e adesao individual com status basicos.
- `components/admin/caixa-view.tsx` e `components/admin/comandas-view.tsx`: comanda suporta produtos, servicos e status, mas nao evidencia fortemente plano/beneficio/desconto/pagamento parcial.
- `components/admin/financeiro-view.tsx`: financeiro tem indicadores, contas, categorias e formas de pagamento; bom visual gerencial, mas generico.
- `components/admin/company-view.tsx`: configuracao cobre portal, imagens, localizacao, redes e politicas, mas agrupa conceitos heterogeneos.
- `components/client-portal/client-portal-shell.tsx`, `booking-flow.tsx`, `checkout-screen.tsx`: portal e mobile-first, com home, agenda, planos, perfil, fluxo de agendamento e checkout demonstrativo.
- `types/admin.ts` e `types/client-portal.ts`: estados de cliente, assinatura e agendamento ainda divergem entre painel e portal, sinal de que o modelo de produto precisa ser consolidado antes de virar contrato definitivo.

## 9. O que manter, ajustar ou redesenhar

| Modulo | A direcao atual esta correta? | O que esta certo | O que esta errado | Manter, ajustar ou redesenhar? |
|---|---|---|---|---|
| Dashboard | Sim | Boa divisao operacional/estrategica | Falta urgencia e proximas acoes | Ajustar antes do backend |
| Agenda | Sim, mas incompleta | Grade por profissional e modal rico | Nao e ainda central de atendimento | Reorganizar parcialmente |
| Clientes | Parcial | Carteira, recompras e destaque sao bons | Falta ficha central | Reorganizar parcialmente |
| Profissionais | Sim para basico | Cadastro, escala, status | Falta perfil publico e servicos | Ajustar antes do backend |
| Servicos | Sim para catalogo | Preco, duracao, categoria, exibicao | Falta descricao publica e relacao com plano | Ajustar antes do backend |
| Planos | Direcao certa, execucao confusa | Ponto central existe e visual premium ajuda | Muita regra sem narrativa simples | Redesenhar conceitualmente |
| Assinaturas | Conceito correto | Separacao de adesoes e status | Falta detalhe operacional e ligacao com cliente | Reorganizar parcialmente |
| Caixa | Sim | Saldo, comandas, entradas/saidas | Falta fechamento e acao ligada a atendimento | Reorganizar parcialmente |
| Comandas | Sim | Etapas, produtos, servicos | Falta plano, desconto, parcial, motivo | Ajustar antes do backend |
| Financeiro | Sim como gestao | Indicadores bons | Generico para operacao de barbearia | Ajustar antes do backend |
| Portal do cliente | Sim | Visual e fluxo mobile fortes | Fraco para assinante e regras | Ajustar antes do backend |
| Configuracoes | Parcial | Cobertura ampla | Agrupamento confuso e algumas secoes prematuras | Reorganizar parcialmente |

## Falhas novas que nao apareceram no exame anterior

1. Retorno/recompra existe como ideia, mas nao esta conectado a uma acao operacional simples. Deveria virar "convidar para reagendar" ou "criar retorno".
2. "Sem preferencia por profissional" no agendamento e uma decisao importante. Se existir, o sistema precisa sugerir profissional automaticamente ou mostrar horarios por disponibilidade geral.
3. Grade de horarios do portal pode conflitar com duracao real do servico. Um servico de 75 minutos precisa gerar slots coerentes, nao apenas horario fixo.
4. Cadeiras/estacoes aparecem em comanda, mas nao esta claro se sao recurso operacional real ou detalhe visual. Para MVP, talvez seja secundario.
5. Dias especiais, feriados e fechamento excepcional nao aparecem com peso suficiente. Barbearia real altera horario em feriados e eventos.
6. Servicos por profissional sao citados como texto, mas a decisao de elegibilidade precisa ficar visual.
7. Desconto e margem de plano nao aparecem com clareza. O produto pode vender plano que parece bom mas nao mostra risco de uso excessivo.
8. Dashboard inicial pode parecer completo com metricas que nao orientam a proxima acao do dia.
9. Portal e forte visualmente, mas a "conta do cliente" ainda e fraca para assinante.
10. Multiunidade nao precisa ser produto agora, mas decisoes de unidade ja impactam plano, caixa, agenda e profissionais. Precisa ser preparado conceitualmente sem expor complexidade.
11. A criacao de plano usa "dias de gratuidade", mas esse termo e ambiguo: gratuidade de que, para quem, em qual ciclo?
12. A area de inadimplentes como modulo separado pode ser exagero se nao aparecer tambem dentro da assinatura e ficha do cliente.
13. Financeiro e caixa podem confundir dono: caixa e rotina do dia; financeiro e leitura gerencial. A interface precisa preservar essa fronteira.
14. O produto esta mais completo em quantidade de telas do que em fechamento dos fluxos criticos.

## 11. Classificacao final dos problemas

| ID | Gravidade | Tipo de problema | Area | Descricao | Evidencia | Impacto | Recomendacao |
|---|---|---|---|---|---|---|---|
| P01 | Critica | Erro de concepcao | Atendimento | Atendimento nao e entidade/estado claro | Agenda + comanda | Confunde fluxo central | Definir ciclo operacional de atendimento. |
| P02 | Critica | Regra de negocio nao definida | Planos | Plano nao expressa cobertura operacional suficiente | Criacao de plano / portal | Assinatura perde valor | Redesenhar plano por beneficios e ciclo. |
| P03 | Critica | Inconsistencia painel x portal | Assinatura | Assinante nao ve uso/restante | Portal planos | Cliente nao entende direito | Criar area de beneficios usados/restantes. |
| P04 | Alta | Fluxo incompleto | Agenda | Falta status operacional | Agenda | Barbeiro nao opera rapido | Status e acoes no card. |
| P05 | Alta | Fluxo incompleto | Comanda | Falta separar incluso no plano e extra pago | Caixa/comanda | Cobranca confusa | Blocos de incluso/extras/produtos. |
| P06 | Alta | Modulo mal posicionado | Clientes | Cliente nao e hub operacional | Clientes | Historico fica espalhado | Ficha completa do cliente. |
| P07 | Alta | Complexidade desnecessaria | Planos | Tela rica demais sem resumo claro | Planos/criar | Dono configura errado | Assistente e preview. |
| P08 | Alta | Falta funcional | Caixa | Falta fechamento do dia | Caixa | Dono nao confere operacao | Fluxo de abrir/fechar caixa. |
| P09 | Alta | Inconsistencia painel x portal | Portal | Politicas nao aparecem claramente | Empresa/portal | Cliente nao entende regras | Exibir politica no agendamento e detalhes. |
| P10 | Media | Falta funcional | Profissionais | Falta perfil publico | Profissionais/portal | Cliente escolhe no escuro | Foto, bio, especialidades. |
| P11 | Media | Falta funcional | Servicos | Falta descricao publica e elegibilidade em plano | Servicos/portal | Servico fica raso | Campos de apresentacao e plano. |
| P12 | Media | Terminologia ruim | Configuracoes | Dpote, Clube da Barba, dias de gratuidade pouco claros | Empresa/planos | Confusao do admin | Renomear ou esconder ate validar. |
| P13 | Media | Fluxo incompleto | Recompra | Recompra nao vira acao operacional clara | Clientes/recompras | Boa ideia perde efeito | Criar CTA por cliente. |
| P14 | Media | Risco para backend futuro | Multiunidade | Unidade e filial aparecem pouco definidas | Agenda/empresa | Retrabalho em agenda/caixa/plano | Definir escopo visual minimo. |
| P15 | Media | Regra nao definida | Cancelamento/falta | Falta regra visual para falta/cancelamento | Agenda/portal | Conflito com cliente | Definir politica e estados. |
| P16 | Media | Informacao sem respaldo | Financeiro | Indicadores sao genericos para decisao diaria | Financeiro | Baixa confianca operacional | Separar caixa realizado e gestao. |
| P17 | Baixa | Falta funcional | Portal | Falta botao WhatsApp mais evidente | Header portal | Menor conversao de contato | CTA de contato fixo/secundario. |
| P18 | Baixa | Ajuste UX | Dashboard | Falta ocupacao do dia | Dashboard | Menos leitura operacional | Card de ocupacao e proximos horarios vagos. |

## 12. Prioridades reais antes de avancar

### 12.1 Top 10 correcoes de produto antes do backend

| Prioridade | O que corrigir | Por que vem antes | Fluxo que melhora | Risco que evita | Tipo |
|---|---|---|---|---|---|
| 1 | Definir ciclo de atendimento | E o eixo agenda-comanda-cliente-caixa | Operacao diaria | Backend misturar conceitos | Decisao de regra + UI |
| 2 | Redesenhar plano como regra simples de beneficios | Assinatura e pilar do Bigood | Cliente assinante / dono vendendo plano | Plano virar card decorativo | Redesign |
| 3 | Adicionar status e acoes operacionais na agenda | Barbeiro trabalha pela agenda | Dia da barbearia | Agenda virar apenas calendario | Ajuste UI |
| 4 | Criar ficha completa do cliente | Cliente deve conectar historico, plano e vendas | CRM e atendimento | Dados espalhados | Redesign parcial |
| 5 | Ajustar comanda para plano, extra, desconto e pagamento | Fecha atendimento e dinheiro | Caixa/comanda | Cobranca ambigua | Ajuste UI |
| 6 | Criar fechamento de caixa | Dono precisa confiar no dia | Caixa/financeiro | Financeiro sem base operacional clara | Nova tela/fluxo |
| 7 | Melhorar portal do assinante | Cliente precisa saber direitos | Portal planos/agendamento | Quebra de expectativa | Ajuste UI |
| 8 | Reorganizar configuracoes de agenda/portal/politicas | Regras precisam ser encontradas | Admin configurando operacao | Regras implicitas | Reorganizacao |
| 9 | Enriquecer servicos e profissionais para portal | Cliente escolhe por clareza | Agendamento online | Portal bonito, mas pouco informativo | Ajuste UI |
| 10 | Simplificar assinaturas em torno do cliente | Dono pensa em clientes, nao so tabela | Base recorrente | Assinatura isolada | Reorganizacao parcial |

### 12.2 O que nao deve ser priorizado agora

- Regras complexas por dia da semana, profissional e unidade combinadas.
- Upgrade/downgrade sofisticado com calculo proporcional.
- Metas avancadas por profissional antes de fechar agenda/comanda.
- Estoque completo de produtos.
- Multiunidade exposta em muitas telas antes de validar fluxo de unidade.
- Relatorios financeiros avancados antes de fechamento de caixa.
- Automacoes de marketing complexas antes de ficha do cliente e recompras acionaveis.
- Gamificacao ou ranking visual de clientes antes de historico operacional.
- Contratos longos de plano dentro da interface antes de resumo simples de regras.

## 13. Veredito executivo final

1. O Bigood esta conceitualmente bem encaminhado, mas ainda precisa consolidar seus conceitos centrais antes do backend.
2. Ele ja parece um produto de barbearia real em aparencia e cobertura de modulos, mas ainda parece um dashboard bonito com partes soltas em fluxos criticos.
3. O posicionamento em barbearias com assinatura ainda nao esta plenamente refletido. Planos existem, mas assinatura ainda nao governa agenda, comanda, cliente e portal com clareza.
4. Painel e portal parecem uma plataforma unica visualmente, mas nao totalmente como experiencia operacional.
5. Devem ser preservados: identidade visual, portal mobile, navegacao geral, dashboard operacional/estrategico, agenda por profissional, conceito de comanda, recompras, planos premium e configuracao de portal.
6. Devem ser corrigidos antes do backend: conceito de atendimento, plano/beneficio, ficha do cliente, status da agenda, comanda de assinante, fechamento de caixa e portal do assinante.
7. O maior risco de retrabalho e iniciar backend sem definir a relacao entre agendamento, atendimento, comanda, assinatura e consumo de beneficio.
8. A forma mais simples e correta de consolidar o Bigood e assumir quatro centros de produto:
   - Agenda como central do dia.
   - Cliente como centro do historico.
   - Plano como regra de beneficio.
   - Caixa como fechamento operacional.

Se esses quatro centros forem definidos e simplificados antes da implementacao definitiva, o Bigood tem uma base visual forte para virar produto real com menos retrabalho.
