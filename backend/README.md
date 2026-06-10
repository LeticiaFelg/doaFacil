# DoaFacil API - Node.js, Express e SQLite

API backend ativa do projeto DoaFacil.

## Inicio Rapido

```powershell
cd "C:\Users\Lucas R\Documents\IBMR\2026.1\A3\\backend"
npm install
npm run dev
```

A API roda em:

```text
http://localhost:5000/api
```

Health check:

```powershell
Invoke-RestMethod "http://localhost:5000/api/health"
```

## Banco de Dados

O banco atual e SQLite:

```text
backend/doafacil.db
```

A configuracao fica em:

```text
backend/src/config/database.js
```

O seed demonstrativo fica em:

```text
backend/src/seed/demoData.js
```

Ao iniciar o backend, `src/server.js` sincroniza as tabelas e executa o seed.

## Estrutura

```text
backend/
  src/
    server.js
    config/database.js
    middleware/auth.js
    models/
      User.js
      Item.js
      Reservation.js
      History.js
    routes/
      auth.js
      users.js
      items.js
      reservations.js
      history.js
    seed/demoData.js
  uploads/items/
  package.json
```

## Rotas Principais

### Health

- `GET /api/health`

### Usuarios

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/logout`
- `GET /api/users/me`
- `PUT /api/users/me`
- `DELETE /api/users/me`
- `GET /api/users/me/profile`
- `GET /api/users/me/donations`

### Auth Legado

As rotas abaixo existem por compatibilidade com organizacao anterior:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Itens

- `GET /api/items`
- `GET /api/items?status=all`
- `GET /api/items/category/:category`
- `GET /api/items/:id`
- `GET /api/items/my`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/items/:id/contact/whatsapp`

### Reservas

- `POST /api/reservations`
- `GET /api/reservations/received`
- `GET /api/reservations/donated`
- `GET /api/reservations/:id`
- `PUT /api/reservations/:id/confirm`
- `PUT /api/reservations/:id/complete`
- `PUT /api/reservations/:id/cancel`
- `PATCH /api/reservations/:id/status`

### Historico

- `GET /api/history/my`
- `GET /api/history/my/donations`
- `GET /api/history/my/received`
- `GET /api/history/my/statistics`
- `GET /api/history/statistics`

## Uploads

Imagens enviadas pelo modal de nova doacao sao salvas em:

```text
backend/uploads/items
```

E servidas por:

```text
http://localhost:5000/uploads/items/NOME_DO_ARQUIVO
```

## Scripts

```powershell
npm run dev
npm start
npm test
```

## Observacao Sobre backend_legacy/

A pasta `backend_legacy/` da raiz contem uma estrutura antiga/paralela. A API ativa deste projeto e a pasta `backend/`.

