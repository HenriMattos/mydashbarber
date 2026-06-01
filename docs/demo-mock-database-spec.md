# Demo mock database spec

## Objetivo

Criar uma base mockada consistente para apresentar o Bigood com uma barbearia realista, incluindo painel administrativo, portal do cliente e contas de acesso de demonstracao.

## Escopo

- Uma barbearia demonstrativa com slug `bigood`.
- Painel admin preenchido com empresa, servicos, profissionais, planos, clientes, assinaturas, agenda, comandas, meios de pagamento e metricas.
- Base com 100 clientes assinantes ativos.
- Uma conta admin do barbeiro para acesso ao painel.
- Uma conta de cliente assinante para acesso ao portal.

## Regras de negocio mockadas

- Todos os clientes da base demonstrativa possuem assinatura ativa.
- O cliente de demonstracao pertence a mesma barbearia do portal.
- O portal deve funcionar sem backend real e sem cadastro manual previo.
- O estado do portal pode continuar persistido em localStorage, mas deve ter fallback de demonstracao.

## Credenciais de demonstracao

Admin barbeiro:

- URL: `/login`
- E-mail: `admin@bigood.com`
- Senha: `bigood123`

Cliente assinante:

- URL: `/portal/bigood`
- E-mail: `cliente@bigood.com`
- WhatsApp: `(11) 98888-0101`
- Senha: `cliente123`

## Backend futuro

- Substituir mocks por APIs multi-tenant filtradas por `companyId`.
- Autenticacao admin deve ser separada da autenticacao do cliente.
- Senhas devem ser armazenadas com hash no backend.
- Assinaturas, pagamentos e conflitos de agenda devem ser validados no servidor.
