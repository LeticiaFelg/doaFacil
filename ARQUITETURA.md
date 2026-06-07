# Arquitetura DoaFacil

Este documento registra as principais decisoes tecnicas do projeto. O README fica mais direto, com visao geral e instrucoes de uso; este arquivo explica como as partes se conectam e por que algumas escolhas foram feitas.

## Visao Geral

O DoaFacil e uma aplicacao web dividida em duas camadas:

- Frontend estatico em HTML, CSS, Bootstrap, jQuery e JavaScript.
- Backend Node.js/Express em `node/`, com banco SQLite via Sequelize.

Fluxo local atual:

```text
Browser -> Frontend estatico em localhost:8000 -> API Express em localhost:5000 -> SQLite em node/doafacil.db
```

O frontend consome a API por `window.API_BASE_URL`, definido em `assets/js/config.js`.

## Pasta backend/

A pasta `backend/` existe no repositorio como uma estrutura antiga/paralela, com referencias a serverless, DynamoDB e outra organizacao de API.

Ela nao e a API ativa usada pelas paginas atuais. A API em uso fica em:

```text
node/
```

## Frontend

As paginas principais sao:

- `index.html`: home/feed de itens, carrossel, categorias, busca e destaques.
- `pages/login.html`: login, cadastro e modal de recuperacao de senha.
- `pages/redefinir-senha.html`: pagina acessada pelo link temporario para criar nova senha.
- `pages/perfil.html`: dados do usuario, doacoes ativas e itens recebidos.
- `pages/item.html`: detalhes do item, reserva, contato WhatsApp e edicao pelo doador.
- `pages/historico.html`: historico de doacoes feitas e itens recebidos.

Componentes reutilizaveis:

- `assets/components/navbar.html`
- `assets/components/footer.html`
- `assets/components/info-modals.html`

Scripts principais:

- `assets/js/api.js`: camada jQuery AJAX para a API.
- `assets/js/config.js`: URL base da API.
- `assets/js/modal.js`: criacao e edicao de itens.
- `assets/js/components/*.js`: carregamento de navbar, footer e modais informativos.

## Backend Ativo

A API ativa fica em `node/src`.

Principais arquivos:

```text
node/src/server.js
node/src/config/database.js
node/src/models/
node/src/routes/
node/src/services/
node/src/seed/demoData.js
node/uploads/items/
```

O servidor registra:

- CORS para origens locais e `FRONTEND_URL`.
- JSON parser.
- Servico estatico de uploads em `/uploads`.
- Associacoes Sequelize.
- Rotas em `/api`.
- Health check em `/api/health`.
- Sincronizacao do banco e seed demonstrativo ao iniciar.

## Banco De Dados

O banco atual e SQLite:

```text
node/doafacil.db
```

Ele e criado/sincronizado automaticamente por `sequelize.sync()` ao iniciar o backend. O arquivo `.db` nao deve ser versionado.

Configuracao:

```text
node/src/config/database.js
```

## Modelos

### User

Guarda usuarios da plataforma.

Campos principais:

- `name`
- `email`
- `password`
- `phone`
- `cpf`
- `bairro`
- `location`
- `avatar`
- `bio`
- `verified`
- `roles`

A senha e armazenada com hash `bcryptjs`. A resposta JSON remove o campo `password`.

### Item

Guarda o catalogo de itens.

Campos principais:

- `title`
- `description`
- `category`
- `condition`
- `location`
- `status`
- `donor_id`
- `images`
- `dimensions`
- `material`
- `color`
- `pickup`
- `address`

`description` e `TEXT`. No backend, a descricao de item e limitada a 1000 caracteres.

Status usados:

- `disponivel`
- `reservado`
- `concluido`
- `cancelado`

### Reservation

Guarda reservas feitas por receptores.

Campos principais:

- `item_id`
- `user_id`
- `donor_id`
- `status`
- `message`
- `completed_at`

`message` e `TEXT`. No backend, a mensagem ao doador e limitada a 500 caracteres.

Status usados:

- `pendente`
- `confirmada`
- `concluida`
- `cancelada`

### History

Guarda fatos consolidados para historico.

Campos principais:

- `item_id`
- `donor_id`
- `receiver_id`
- `transaction_type`
- `status`
- `notes`

Tipos usados:

- `doacao`
- `recepcao`
- `cancelamento`

### PasswordReset

Guarda tokens temporarios de recuperacao de senha.

Campos principais:

- `user_id`
- `token_hash`
- `expires_at`
- `used_at`

O token enviado ao usuario nao e salvo puro no banco. O banco guarda o hash SHA-256 do token. O prazo atual de validade e 15 minutos.

## Relacionamentos

```text
User hasMany Item
Item belongsTo User as donor

Reservation belongsTo Item
Reservation belongsTo User as receiver
Reservation belongsTo User as donor
Item hasMany Reservation

User hasMany PasswordReset
PasswordReset belongsTo User
```

## Autenticacao E Sessao

O login e o cadastro retornam JWT.

O frontend salva:

- `doafacil_token`
- `doafacil_user`
- `doafacil_current_user`

As rotas protegidas usam:

```http
Authorization: Bearer TOKEN
```

Quando a API responde `401` em uma rota protegida, `assets/js/api.js` limpa a sessao local e redireciona para `pages/login.html`.

## Recuperacao De Senha

Fluxo atual:

1. Usuario clica em "Esqueceu a senha?".
2. Frontend abre modal em `pages/login.html`.
3. Frontend chama `POST /api/users/forgot-password`.
4. Backend valida o formato do e-mail.
5. Se o usuario existir, gera token temporario de 15 minutos.
6. Backend salva somente o hash do token em `PasswordReset`.
7. Backend monta link para `pages/redefinir-senha.html?token=...`.
8. E-mail e enviado por Ethereal, SMTP/Mailtrap ou log de desenvolvimento.
9. Usuario abre o link e envia nova senha.
10. Frontend chama `PUT /api/users/reset-password`.
11. Backend valida token, expiracao e uso anterior.
12. Senha e atualizada e o token e marcado como usado.

A resposta de solicitacao e neutra:

```text
Se o e-mail estiver cadastrado, enviaremos instrucoes para redefinir sua senha.
```

Isso evita revelar se um e-mail existe no sistema.

## E-mail

Configuracao em `node/.env.example`:

```text
EMAIL_PROVIDER=ethereal
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Modos suportados:

- `ethereal`: gera conta de teste e exibe preview URL no terminal.
- `smtp`: usa SMTP, adequado para Mailtrap ou provedor real.
- log de desenvolvimento: imprime o conteudo no terminal quando nao ha provedor configurado.

## Upload De Imagens

Implementacao local atual:

```text
node/uploads/items
```

Rotas de criacao e edicao de item aceitam `multipart/form-data` com ate 3 imagens.

Limites atuais:

- maximo de 3 imagens por item;
- ate 5 MB por imagem;
- apenas arquivos com MIME `image/*`.

As URLs sao salvas como caminhos relativos:

```text
/uploads/items/nome-do-arquivo.jpg
```

O frontend transforma esses caminhos em URLs completas usando a origem da API.

## Preparacao Para S3

Para producao, o frontend estatico pode ser publicado em S3, mas o S3 nao executa Express nem SQLite.

Para imagens em producao, o caminho planejado e:

1. Frontend seleciona o arquivo.
2. Frontend pede uma URL assinada ao backend.
3. Backend gera presigned URL no S3.
4. Browser envia a imagem diretamente ao bucket.
5. Backend salva a URL ou key da imagem no banco.

Existe um bloco comentado em `node/src/routes/items.js` com esboco real de implementacao futura usando AWS SDK.

## Seed Inicial

O seed fica em:

```text
node/src/seed/demoData.js
```

Ele cria ou atualiza:

- Maria Clara Souza como usuaria demonstrativa.
- 12 itens iniciais da Maria Clara.
- usuarios demonstrativos usados como receptores e doadores auxiliares.
- reservas demonstrativas.
- historicos demonstrativos de doacoes, recebimentos e cancelamentos.

O seed procura registros existentes antes de criar novos, evitando duplicacao simples ao reiniciar o backend.

## Health E Ready

Rota atual:

```http
GET /api/health
```

Ela verifica se a API esta viva e se o Sequelize consegue autenticar no banco.

Decisao atual: manter banco dentro do health check porque os fluxos principais dependem do banco para funcionar.

Possivel evolucao:

- `GET /api/health`: apenas processo Express vivo.
- `GET /api/ready`: API pronta, banco e dependencias externas funcionando.

## Testes

O projeto possui script:

```powershell
cd node
npm test
```

Mas a suite automatizada ainda precisa ser criada.

Proximos pontos planejados:

- container para system tests;
- testes unitarios;
- testes de integracao;
- testes de sistema automatizados.
