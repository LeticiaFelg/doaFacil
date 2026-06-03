# Documentacao da API DoaFacil

Este arquivo documenta as rotas HTTP ja criadas no backend do projeto DoaFacil. Ele serve como referencia rapida para integrar as paginas do frontend com a API, entender quais endpoints exigem autenticacao e o que cada rota faz.

Base local recomendada para testes:

```text
http://localhost:5000/api
```

Observacao: se o backend estiver rodando na porta padrao do `.env.example`, use `http://localhost:5000/api`.

## Autenticacao

As rotas marcadas como **protegidas** exigem o header:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

O token e retornado nas rotas de cadastro e login como `token` e tambem como `access_token`, para compatibilidade.

## Health Check

### `GET /api/health`

Verifica se a API esta online.

Retorna status simples da aplicacao, usado para teste rapido de conexao.

## Usuarios

### `POST /api/users/register`

Cria uma nova conta de usuario.

Recebe dados como `name`, `email`, `password`, `phone`, `cpf` e `bairro`. Valida campos obrigatorios, impede cadastro com e-mail ou CPF repetido, salva o usuario no banco e retorna o usuario criado com token JWT.

### `POST /api/users/login`

Realiza login do usuario.

Recebe `email` e `password`, valida as credenciais e retorna os dados do usuario autenticado com token JWT.

### `POST /api/users/logout` protegida

Confirma o logout no backend.

Como a autenticacao usa JWT, o logout efetivo acontece no frontend removendo o token salvo no `localStorage`.

### `GET /api/users/me` protegida

Retorna o perfil do usuario autenticado.

Deve ser usada por paginas como `perfil.html` e outras telas que precisam saber quem esta logado.

### `PUT /api/users/me` protegida

Atualiza o perfil do usuario autenticado.

Permite alterar dados como nome, bio, bairro/localizacao, telefone, avatar e tipo de perfil.

### `DELETE /api/users/me` protegida

Exclui a conta do usuario autenticado.

Remove tambem itens e reservas diretamente associados a esse usuario.

### `GET /api/users/me/profile` protegida

Alias de compatibilidade para buscar o perfil do usuario autenticado.

Mantida para nao quebrar chamadas antigas que ainda usem esse caminho.

### `GET /api/users/me/donations` protegida

Lista os itens doados pelo usuario autenticado.

Retorna uma lista paginada de doacoes criadas pelo usuario.

### `GET /api/users/search?q=texto`

Busca usuarios por nome ou e-mail.

Exige pelo menos dois caracteres no parametro `q`.

### `GET /api/users/:id`

Retorna o perfil publico de um usuario pelo ID.

Inclui estatisticas basicas de doacoes, recebimentos e recorrencia.

### `GET /api/users/:id/statistics`

Retorna estatisticas publicas de um usuario.

Inclui total de itens doados, recebidos, itens ativos e data de entrada.

## Autenticacao Legada

Estas rotas existem em `/api/auth` e mantem compatibilidade com uma organizacao anterior do backend.

### `POST /api/auth/register`

Cria usuario usando o fluxo antigo de autenticacao.

### `POST /api/auth/login`

Realiza login usando o fluxo antigo de autenticacao.

### `GET /api/auth/me` protegida

Retorna o usuario autenticado pelo fluxo antigo.

### `GET /api/auth/verify-token` protegida

Verifica se o token JWT enviado ainda e valido.

## Itens

### `GET /api/items`

Lista itens disponiveis.

Aceita filtros por query string como `page`, `per_page`, `category`, `status` e `search`.

Cada item inclui dados basicos do doador em `donor`, mas nao inclui telefone.

### `GET /api/items/my` protegida

Lista os itens cadastrados pelo usuario autenticado.

Usada para recuperar os itens que o proprio usuario colocou para doacao.

Cada item inclui dados basicos do doador em `donor`, mas nao inclui telefone.

### `GET /api/items/:id`

Busca um item especifico pelo ID.

Retorna o item e dados basicos do doador, mas nao inclui telefone. O contato via WhatsApp deve usar a rota protegida propria para isso.

### `POST /api/items/:id/contact/whatsapp` protegida

Gera o link de contato via WhatsApp para o doador de um item.

Essa rota deve ser chamada somente quando o usuario clicar no botao "Contato via WhatsApp". A consulta publica do item nao retorna telefone. A API busca o telefone do doador no backend, monta a URL `https://wa.me/<numero>?text=<mensagem>` e retorna apenas `url`.

### `POST /api/items` protegida

Cria um novo item para doacao.

Recebe os dados enviados pelo modal "Cadastrar Item para Doacao". O doador e definido automaticamente pelo token do usuario autenticado.

Campos principais do corpo:

```json
{
  "title": "Sofa de 3 lugares",
  "description": "Sofa em tecido cinza, estrutura firme.",
  "category": "moveis",
  "condition": "bom",
  "location": "Copacabana, Rio de Janeiro",
  "images": ["sofa.jpg"],
  "dimensions": "220 x 85 x 90 cm",
  "material": "Tecido / Madeira",
  "color": "Cinza claro",
  "pickup": "A combinar",
  "address": {
    "street": "Rua Exemplo",
    "number": "123",
    "neighborhood": "Copacabana",
    "city": "Rio de Janeiro"
  }
}
```

Observacao: neste momento o frontend envia os nomes dos arquivos selecionados em `images`. Upload real dos arquivos/imagens exigiria uma etapa separada de armazenamento.

### `PUT /api/items/:id` protegida

Atualiza um item existente.

Somente o usuario doador do item pode altera-lo.

### `DELETE /api/items/:id` protegida

Remove um item.

Somente o usuario doador do item pode remove-lo.

### `GET /api/items/category/:category`

Lista itens disponiveis de uma categoria especifica.

Cada item inclui dados basicos do doador em `donor`, mas nao inclui telefone.

## Reservas

### `POST /api/reservations` protegida

Cria uma reserva para um item.

Aceita `itemId` ou `item_id`. Verifica se o item existe, se ja esta reservado e se o usuario ja reservou aquele item.

### `GET /api/reservations/received` protegida

Lista reservas recebidas pelo usuario autenticado como doador.

Retorna reservas feitas por outras pessoas em itens cadastrados por esse usuario.

### `GET /api/reservations/donated` protegida

Lista reservas feitas pelo usuario autenticado.

Representa itens que o usuario tentou receber/reservar.

### `PATCH /api/reservations/:id/status` protegida

Atualiza o status de uma reserva.

Aceita status como `pendente`, `confirmada`, `concluida` e `cancelada`. Tambem atualiza o status do item relacionado quando necessario.

### `GET /api/reservations/:id` protegida

Busca uma reserva pelo ID.

### `PUT /api/reservations/:id/confirm` protegida

Confirma uma reserva.

Somente o doador do item pode confirmar.

### `PUT /api/reservations/:id/complete` protegida

Marca uma reserva como concluida.

Pode ser usada pelo doador ou pelo recebedor, desde que a reserva esteja confirmada.

### `PUT /api/reservations/:id/cancel` protegida

Cancela uma reserva.

Pode ser usada pelo doador ou pelo recebedor, desde que a reserva ainda nao esteja concluida ou cancelada.

### `GET /api/reservations/my/pending` protegida

Lista reservas pendentes relacionadas ao usuario autenticado.

Retorna tanto reservas feitas pelo usuario quanto reservas recebidas em itens dele.

### `GET /api/reservations/item/:item_id`

Lista reservas de um item especifico.

## Historico

### `GET /api/history/my` protegida

Retorna o historico completo do usuario autenticado para a pagina `historico.html`.

Entrega em uma unica resposta os dados do usuario, resumo das metricas, doacoes feitas e itens recebidos. A pagina aplica busca, filtros e ordenacao no frontend.

### `GET /api/history/my/donations` protegida

Lista historico de doacoes do usuario autenticado.

Aceita paginacao e filtro por status.

### `GET /api/history/my/received` protegida

Lista historico de itens recebidos pelo usuario autenticado.

Aceita paginacao e filtro por status.

### `GET /api/history/my/statistics` protegida

Retorna estatisticas do historico do usuario autenticado.

Inclui totais de doacoes e recebimentos.

### `GET /api/history/user/:user_id/donations`

Lista doacoes concluidas de um usuario especifico.

Usada para visualizar historico publico de doacoes.

### `GET /api/history/statistics`

Retorna estatisticas globais da plataforma.

Inclui itens doados, familias ajudadas e doadores ativos.
