# DoaFacil - Guia Atual de Execucao e Deploy

Este guia descreve o estado atual do projeto.

## Visao Geral Atual

```text
Browser -> Frontend estatico -> API Node/Express em node/ -> SQLite em node/doafacil.db
```

- Frontend: HTML, CSS e JavaScript na raiz, em `pages/` e em `assets/`.
- Backend ativo: pasta `node/`.
- API local: `http://localhost:5000/api`.
- Banco atual: SQLite em `node/doafacil.db`.
- Upload local de imagens: `node/uploads/items`.
- Pasta `backend/`: estrutura antiga/paralela, sem integracao ativa com o fluxo atual.

## Rodar o Backend

Use um PowerShell:

```powershell
cd "C:\Users\Lucas R\Documents\IBMR\2026.1\A3\node"
npm install
npm run dev
```

A API deve responder em:

```text
http://localhost:5000/api/health
```

Teste rapido:

```powershell
Invoke-RestMethod "http://localhost:5000/api/health"
```

## Rodar o Frontend

Use outro PowerShell:

```powershell
cd "C:\Users\Lucas R\Documents\IBMR\2026.1\A3"
python -m http.server 8000
```

Abra no navegador:

```text
http://localhost:8000
```

Tambem e possivel usar Live Server no VS Code:

```text
http://127.0.0.1:5500
```

Essas origens locais estao liberadas no CORS do backend.

## Configuracao da URL da API

O frontend usa `window.API_BASE_URL`, definido em:

```text
assets/js/config.js
```

Para desenvolvimento local:

```js
window.API_BASE_URL = 'http://localhost:5000/api';
```

Para um backend exposto por tunnel ou deploy externo, altere apenas esse valor.

## Deploy Estatico do Frontend em S3

O S3 hospeda somente arquivos estaticos. Ele nao executa Node.js, Express nem SQLite.

Para publicar o frontend:

```powershell
aws s3 sync . s3://NOME-DO-BUCKET `
  --exclude ".git/*" `
  --exclude "node/*" `
  --exclude "backend/*" `
  --exclude "*.md"
```

Antes de publicar, ajuste `assets/js/config.js` para apontar para a URL publica da API.

## Backend Durante Demonstracao

Se o frontend estiver publicado em S3, o backend ainda precisa estar acessivel por uma URL publica.

Opcoes:

1. Rodar o backend local em `node/` e expor com Cloudflare Tunnel.
2. Rodar o backend em uma plataforma propria de deploy.

Com Cloudflare Tunnel, o tunnel deve apontar para:

```text
http://localhost:5000
```

Depois, `assets/js/config.js` deve apontar para:

```js
window.API_BASE_URL = 'https://URL-PUBLICA-DA-API/api';
```

## Banco de Dados

O banco usado atualmente e:

```text
node/doafacil.db
```

O seed demonstrativo fica em:

```text
node/src/seed/demoData.js
```

Ao iniciar o backend, o `server.js` sincroniza o banco e executa o seed sem duplicar os registros ja existentes.

## Observacao Sobre a Pasta backend/

A pasta `backend/` contem uma arquitetura antiga/paralela, com referencias a porta `3000`, serverless e DynamoDB.

No fluxo atual, ela nao e usada pelo frontend nem pela API ativa. A pasta candidata a remocao e `backend/`; a pasta que deve permanecer e `node/`.
