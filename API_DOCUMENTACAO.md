# Documentacao Da API DoaFacil

Referencia rapida das rotas HTTP da API ativa do DoaFacil.

Base local:

```text
http://localhost:5000/api
```

API ativa:

```text
node/src
```

A pasta `backend/` existe no repositorio, mas representa uma estrutura antiga/paralela e nao e a API usada pelas paginas atuais.

## Autenticacao

Rotas protegidas exigem:

```http
Authorization: Bearer TOKEN_JWT
```

O token e retornado nas rotas de cadastro e login como `token` e `access_token`, por compatibilidade.

## Respostas De Erro

Formato mais comum:

```json
{
  "error": "Mensagem do erro"
}
```

Codigos frequentes:

- `400`: dados invalidos.
- `401`: token ausente ou invalido.
- `403`: usuario sem permissao.
- `404`: recurso nao encontrado.
- `409`: conflito de regra de negocio.
- `500`: erro interno.

## Health

### `GET /api/health`

Verifica API e conexao com banco.

Resposta de sucesso:

```json
{
  "status": "ok",
  "database": "connected",
  "message": "API DoaFacil esta funcionando"
}
```

Resposta de indisponibilidade:

```json
{
  "status": "error",
  "database": "disconnected",
  "message": "Banco de dados indisponivel"
}
```

## Usuarios

### `POST /api/users/register`

Cria uma nova conta.

Body:

```json
{
  "name": "Lucas R",
  "email": "lucas@example.com",
  "password": "senha123",
  "phone": "21999998888",
  "cpf": "12345678901",
  "bairro": "Barra",
  "roles": ["doador", "receptor"]
}
```

Regras:

- `name` deve ter pelo menos 3 caracteres.
- `email` deve ser valido e unico.
- `phone` deve ter 10 ou 11 digitos.
- `cpf` deve ter 11 digitos e ser unico.
- `password` deve ter pelo menos 6 caracteres.

Resposta:

```json
{
  "message": "Usuario criado com sucesso",
  "user": {},
  "token": "jwt",
  "access_token": "jwt"
}
```

### `POST /api/users/login`

Realiza login.

Body:

```json
{
  "email": "lucas@example.com",
  "password": "senha123"
}
```

Resposta:

```json
{
  "message": "Login realizado com sucesso",
  "user": {},
  "token": "jwt",
  "access_token": "jwt"
}
```

### `POST /api/users/forgot-password`

Solicita recuperacao de senha.

Body:

```json
{
  "email": "lucas@example.com"
}
```

Resposta neutra:

```json
{
  "message": "Se o e-mail estiver cadastrado, enviaremos instrucoes para redefinir sua senha."
}
```

Observacoes:

- Nao exige login.
- Nao revela se o e-mail existe.
- Se o usuario existir, gera token temporario de 15 minutos.
- O banco salva apenas o hash do token.
- O envio de e-mail acontece por Ethereal, SMTP/Mailtrap ou log de desenvolvimento.

### `PUT /api/users/reset-password`

Redefine a senha usando token temporario.

Body:

```json
{
  "token": "token-recebido-por-email",
  "password": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

Resposta:

```json
{
  "message": "Senha redefinida com sucesso"
}
```

Regras:

- Nao exige login.
- Token precisa existir, nao estar expirado e nao ter sido usado.
- Senha deve ter pelo menos 6 caracteres.
- `password` e `confirmPassword` devem ser iguais.
- Token usado e marcado como consumido.

### `POST /api/users/logout` protegida

Confirma logout no backend.

Como a autenticacao usa JWT, o logout efetivo acontece no frontend removendo o token salvo.

### `GET /api/users/me` protegida

Retorna o perfil do usuario autenticado, incluindo estatisticas:

```json
{
  "id": 1,
  "name": "Maria Clara Souza",
  "email": "maria.clara@example.com",
  "stats": {
    "donated": 12,
    "donations_completed": 9,
    "received": 0,
    "is_recurrent": true
  }
}
```

### `PUT /api/users/me` protegida

Atualiza perfil do usuario autenticado.

Body aceito:

```json
{
  "name": "Novo Nome",
  "bio": "Texto de bio",
  "location": "Barra",
  "bairro": "Barra",
  "phone": "21999998888",
  "avatar": "LR",
  "roles": ["doador", "receptor"]
}
```

### `DELETE /api/users/me` protegida

Exclui a conta autenticada e remove itens/reservas diretamente associados.

### `GET /api/users/me/profile` protegida

Alias de compatibilidade para `GET /api/users/me`.

### `GET /api/users/me/donations` protegida

Lista itens doados pelo usuario autenticado.

Query:

- `page`
- `per_page`

### `GET /api/users/search?q=texto`

Busca usuarios por nome ou e-mail.

Regra:

- `q` deve ter pelo menos 2 caracteres.

### `GET /api/users/:id`

Retorna perfil publico de um usuario.

### `GET /api/users/:id/statistics`

Retorna estatisticas publicas do usuario.

## Auth Legado

Rotas em `/api/auth` mantidas por compatibilidade:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` protegida
- `GET /api/auth/verify-token` protegida

## Itens

### `GET /api/items`

Lista itens.

Query:

- `page`: padrao `1`.
- `per_page`: padrao `12`.
- `category`: categoria ou `all`.
- `status`: padrao `disponivel`; use `all` para listar todos.
- `search`: busca em titulo e descricao.

Resposta:

```json
{
  "items": [],
  "total": 0,
  "pages": 0,
  "current_page": 1
}
```

Cada item inclui dados basicos do doador em `donor`, sem telefone.

### `GET /api/items/my` protegida

Lista itens cadastrados pelo usuario autenticado.

Query:

- `page`
- `per_page`

### `GET /api/items/category/:category`

Lista itens disponiveis de uma categoria.

Exemplo:

```http
GET /api/items/category/moveis
```

Resposta:

```json
{
  "category": "moveis",
  "items": []
}
```

### `GET /api/items/:id`

Busca item por ID.

Inclui dados basicos do doador, sem telefone.

### `POST /api/items/:id/contact/whatsapp` protegida

Gera link de contato via WhatsApp.

Resposta:

```json
{
  "url": "https://wa.me/5521999998888?text=..."
}
```

Observacao: o telefone nao e exposto nas rotas publicas de item.

### `POST /api/items` protegida

Cria item para doacao.

Aceita JSON ou `multipart/form-data`.

Campos:

```json
{
  "title": "Sofa de 3 lugares",
  "description": "Sofa em tecido cinza.",
  "category": "moveis",
  "condition": "bom",
  "location": "Copacabana, RJ",
  "images": ["./assets/img/items/item1.jpg"],
  "dimensions": "220 x 85 x 90 cm",
  "material": "Tecido / Madeira",
  "color": "Cinza claro",
  "pickup": "A combinar",
  "address": {
    "neighborhood": "Copacabana",
    "city": "Rio de Janeiro"
  }
}
```

Regras:

- `title` e `description` sao obrigatorios.
- `description` tem limite de 1000 caracteres.
- se `category` nao for enviada, usa `outros`.
- o item nasce com `status: "disponivel"`.
- o doador vem do token autenticado.

Upload:

- campo de arquivos: `images`;
- maximo de 3 imagens;
- ate 5 MB por imagem;
- apenas MIME `image/*`;
- arquivos locais sao salvos em `node/uploads/items`.

### `PUT /api/items/:id` protegida

Atualiza item.

Somente o doador do item pode atualizar.

Aceita os mesmos campos de criacao e tambem `status`.

### `DELETE /api/items/:id` protegida

Cancela item por soft delete.

Somente o doador pode cancelar.

Efeito:

```json
{
  "status": "cancelado"
}
```

## Reservas

### `POST /api/reservations` protegida

Cria reserva.

Body:

```json
{
  "itemId": 1,
  "message": "Tenho interesse no item."
}
```

Tambem aceita `item_id`.

Regras:

- item precisa existir;
- item precisa estar `disponivel`;
- nao pode haver reserva pendente/confirmada para o mesmo item;
- usuario nao pode reservar o mesmo item novamente;
- `message` tem limite de 500 caracteres.

Efeito:

- cria reserva com `status: "pendente"`;
- altera item para `status: "reservado"`.

### `GET /api/reservations/received` protegida

Lista reservas recebidas pelo usuario como doador.

### `GET /api/reservations/donated` protegida

Lista reservas feitas pelo usuario como receptor.

### `PATCH /api/reservations/:id/status` protegida

Atualiza status de reserva.

Body:

```json
{
  "status": "concluida"
}
```

Status aceitos:

- `pendente`
- `confirmada`
- `concluida`
- `cancelada`

Tambem atualiza o status do item quando necessario.

### `GET /api/reservations/my/pending` protegida

Lista reservas pendentes feitas e recebidas pelo usuario autenticado.

### `GET /api/reservations/item/:item_id`

Lista reservas de um item especifico.

### `GET /api/reservations/:id` protegida

Busca reserva por ID.

### `PUT /api/reservations/:id/confirm` protegida

Confirma reserva.

Somente o doador pode confirmar. Reserva precisa estar `pendente`.

### `PUT /api/reservations/:id/complete` protegida

Conclui reserva.

Pode ser usado pelo doador ou receptor relacionado. Reserva precisa estar `pendente` ou `confirmada`.

Efeito:

- reserva vira `concluida`;
- item vira `concluido`;
- cria registro em `histories` quando ainda nao existe.

### `PUT /api/reservations/:id/cancel` protegida

Cancela reserva.

Pode ser usado pelo doador ou receptor relacionado. Reserva nao pode estar `concluida` nem `cancelada`.

Efeito:

- reserva vira `cancelada`;
- se o item estava `reservado`, volta para `disponivel`.

## Historico

### `GET /api/history/my` protegida

Retorna pacote completo para `pages/historico.html`.

Resposta:

```json
{
  "user": {},
  "summary": {
    "donated": 0,
    "received": 0,
    "completed": 0,
    "in_progress": 0,
    "is_recurrent": false
  },
  "donated": [],
  "received": []
}
```

A pagina aplica busca, filtro e ordenacao no frontend.

### `GET /api/history/my/donations` protegida

Lista historico de doacoes do usuario autenticado.

Query:

- `page`
- `per_page`
- `status`

### `GET /api/history/my/received` protegida

Lista historico de itens recebidos pelo usuario autenticado.

Query:

- `page`
- `per_page`
- `status`

### `GET /api/history/my/statistics` protegida

Retorna estatisticas do historico autenticado.

### `GET /api/history/user/:user_id/donations`

Lista doacoes concluidas de um usuario.

### `GET /api/history/statistics`

Retorna estatisticas globais:

```json
{
  "items_donated": 0,
  "families_helped": 0,
  "active_donors": 0
}
```

## E-mail E Recuperacao De Senha

Variaveis em `node/.env.example`:

```text
EMAIL_PROVIDER=ethereal
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Para desenvolvimento, `EMAIL_PROVIDER=ethereal` cria um e-mail de teste e mostra a preview URL no terminal.

Para Mailtrap, use `EMAIL_PROVIDER=smtp` e preencha as credenciais SMTP.

## Comandos Rapidos Para Teste

Health:

```powershell
$base = "http://localhost:5000/api"
Invoke-RestMethod "$base/health"
```

Login:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "$base/users/login" -ContentType "application/json" -Body '{"email":"maria.clara@example.com","password":"senha123"}'
$headers = @{ Authorization = "Bearer $($login.token)" }
Invoke-RestMethod "$base/users/me" -Headers $headers
```

Itens:

```powershell
Invoke-RestMethod "$base/items"
Invoke-RestMethod "$base/items/category/moveis"
```
