# 🌿 DoaFácil API - Node.js + Express

API backend completa em Node.js com Express e SQLite para o projeto DoaFácil.

## 🚀 Início Rápido

### 1. Instalar dependências

```bash
cd node
npm install
```

### 2. Configurar ambiente

```bash
cp .env.example .env
```

### 3. Executar

```bash
npm run dev
```

Acesse: `http://localhost:5000/api/health`

---

## 📦 Estrutura

```
node/
├── src/
│   ├── server.js              # Arquivo principal
│   ├── config/
│   │   └── database.js        # Configuração Sequelize
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Reservation.js
│   │   └── History.js
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   └── routes/
│       ├── auth.js            # Autenticação
│       ├── items.js           # Itens/Doações
│       ├── users.js           # Perfis
│       ├── reservations.js    # Reservas
│       └── history.js         # Histórico
├── package.json
├── .env.example
└── README.md
```

---

## 📡 Rotas Principais

### Autenticação `/api/auth`

- **POST** `/register` — Cadastro
- **POST** `/login` — Login
- **GET** `/me` — Dados do usuário (requer auth)

### Itens `/api/items`

- **GET** `/` — Listar itens (com filtros)
- **GET** `/:id` — Detalhes do item
- **POST** `/` — Criar item (requer auth)
- **PUT** `/:id` — Atualizar item (requer auth)
- **DELETE** `/:id` — Deletar item (requer auth)
- **GET** `/category/:category` — Itens por categoria

### Usuários `/api/users`

- **GET** `/:id` — Perfil do usuário
- **GET** `/me/profile` — Meu perfil (requer auth)
- **PUT** `/me/profile` — Atualizar perfil (requer auth)
- **GET** `/me/donations` — Minhas doações (requer auth)

### Reservas `/api/reservations`

- **POST** `/` — Criar reserva (requer auth)
- **GET** `/:id` — Detalhes (requer auth)
- **PUT** `/:id/confirm` — Confirmar (requer auth)
- **PUT** `/:id/complete` — Completar (requer auth)
- **PUT** `/:id/cancel` — Cancelar (requer auth)

### Histórico `/api/history`

- **GET** `/my/donations` — Histórico de doações (requer auth)
- **GET** `/my/received` — Itens recebidos (requer auth)
- **GET** `/statistics` — Estatísticas globais

---

## 🔐 Autenticação com JWT

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"senha123"}'
```

### Usar token

```bash
curl -X GET http://localhost:5000/api/users/me/profile \
  -H "Authorization: Bearer {token}"
```

---

## 📝 Scripts

```bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Testes
npm test
```

---

## 📚 Stack

- **Express.js** — Framework web
- **Sequelize** — ORM para SQLite
- **JWT** — Autenticação
- **bcryptjs** — Hashing de senhas
- **CORS** — Requisições cross-origin
- **SQLite** — Banco de dados local

---

<div align="center">

**API DoaFácil** 🌿

Backend em Node.js para conectar doadores com quem precisa

</div>
