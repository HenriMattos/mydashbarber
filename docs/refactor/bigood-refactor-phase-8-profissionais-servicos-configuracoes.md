# Bigood Refactor Phase 8 - Profissionais, Servicos e Configuracoes Operacionais

## Objetivo da fase

Refatorar a base operacional do Bigood para que profissionais, servicos e configuracoes da barbearia passem a representar a rotina real de operacao antes do agendamento, do portal, dos planos e da comanda.

## Decisoes tomadas

- Profissionais passaram a carregar informacoes operacionais como servicos realizados, dias de trabalho, horario, unidade, observacoes e visibilidade no portal.
- Servicos passaram a expor duracao, preco, visibilidade no portal, elegibilidade para plano, profissionais vinculados e flags operacionais simples.
- Configuracoes da barbearia passaram a concentrar regras de horario, antecedencia, cancelamento, remarcacao, portal, meios de pagamento e unidade.
- O portal passou a ler essas configuracoes para esconder o que nao estiver liberado.
- Servicos inativos, ocultos ou nao liberados para o portal deixaram de aparecer como opcao de agendamento.
- Profissionais inativos, ausentes ou em ferias deixam de se comportar como opcoes normais de agendamento no portal e na leitura operacional.

## Como profissionais aparecem na interface

- Listagem com busca, filtro de status, resumo de agenda e receita estimada.
- Cards e tabela mostram nome, funcao, status, servicos, horarios, agenda de hoje e proximo atendimento.
- Cadastro permite associar servicos, dias da semana, horarios, intervalo, unidade, observacoes e visibilidade no portal.
- Acoes rapidas incluem editar, ativar/desativar, ver agenda e ver servicos.

## Como servicos aparecem na interface

- Listagem e catalogo mostram preco, duracao, portal, plano, profissionais e status.
- Cadastro de servico inclui descricao, descricao interna, profissionais vinculados, disponibilidade online, elegibilidade para plano e observacoes.
- Servicos ficam claros como base da agenda, da comanda, do portal e dos planos.
- Servicos inativos ou ocultos nao sao tratados como disponiveis na operacao diaria.

## Como configuracoes operacionais aparecem

- A tela de configuracoes foi organizada com dados da barbearia, horarios de funcionamento, regras de agendamento, portal, pagamentos e unidade.
- A fase inclui antecedencia minima, cancelamento, remarcacao, encaixe, escolha de profissional, exibicao de preco, exibicao de duracao e politicas textuais.
- A configuracao de portal controla o que o cliente ve no fluxo de agendamento.
- O local de trabalho atual e a unidade aparecem como parte da leitura operacional quando houver suporte.

## Como disponibilidade e representada visualmente

- Horarios de trabalho do profissional sao mostrados no cadastro e na listagem.
- Dias disponiveis e intervalo de atendimento ajudam a orientar a agenda.
- Servicos com disponibilidade online desligada nao aparecem como opcoes de agendamento no portal.
- Profissionais sem status ativo nao sao tratados como opcoes normais para atendimento online.

## Como portal, agenda, planos e comandas usam essas informacoes

- O portal consome o catalogo filtrado por status, visibilidade e liberacao online.
- A agenda passa a enxergar profissionais e servicos com leitura mais coerente de disponibilidade.
- Planos continuam usando servicos existentes, com identificacao clara de quais podem entrar em beneficio.
- Comandas e caixa continuam lendo servicos com preco, duracao e cobertura de plano sem confundir produto com servico.

## Cenarios mockados

- Profissional ativo com varios servicos.
- Profissional com agenda reduzida.
- Profissional inativo.
- Profissional em ferias.
- Servico ativo e visivel no portal.
- Servico ativo apenas interno.
- Servico inativo.
- Servico elegivel para plano.
- Servico fora de plano.
- Configuracao com horario normal.
- Configuracao com dia fechado.
- Configuracao com politica de cancelamento e antecedencia minima.

## Ajustes feitos nas telas

- Tela de profissionais com metricas, busca, filtro, tabela e modal de edicao operacional.
- Tela de cadastro de profissional com servicos, agenda, unidade, observacoes e visibilidade no portal.
- Tela de servicos com metrics operacionais, filtros, catalogo e modal de detalhes.
- Tela de cadastro de servico com foco em portal, planos, profissionais e regras.
- Tela de configuracoes com bloco operacional da barbearia e leitura de portal.
- Portal do cliente alinhado com as novas flags de visibilidade e agendamento online.

## Decisoes abertas

- Regra definitiva de comissao por profissional.
- Suporte real a preco diferente por profissional.
- Multiunidade completa no frontend.
- Motor real de disponibilidade por agenda.
- Regras futuras por feriado e bloqueios por unidade.

## Riscos

- A disponibilidade continua representada por mocks e regras visuais, nao por um motor de agenda real.
- Alguns campos operacionais ainda sao apenas leitura e nao alteram calculos reais.
- Multiunidade ainda e superficial e precisa de backend futuro para ser consistente.
- O portal precisa permanecer coerente com o painel para evitar divergencia de leitura.

## Proxima fase recomendada

Fase 9 - auditoria final de coesao do frontend, simulando barbeiro, gestor e cliente para validar se os modulos ja formam um produto unico antes do backend real.
