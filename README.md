# DoaFacil

> Plataforma digital de redistribuicao de bens materiais, conectando doadores com quem mais precisa.

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)](https://getbootstrap.com)
[![Backend](https://img.shields.io/badge/API-Node.js%20%2B%20Express-brightgreen)](#stack-tecnologico)
[![Database](https://img.shields.io/badge/Database-SQLite-lightgrey)](#stack-tecnologico)

---

## Sumario

- [Sobre](#sobre)
- [Features](#features)
- [Stack Tecnologico](#stack-tecnologico)
- [Estrutura Do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Telas Principais](#telas-principais)
- [Documentacao](#documentacao)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licenca](#licenca)

---

## Sobre

O **DoaFacil** e uma plataforma web para redistribuicao de bens materiais. A proposta e conectar pessoas que possuem itens em bom estado a pessoas que precisam desses itens, facilitando cadastro de doacoes, reservas, contato entre usuarios e acompanhamento de historico.

A plataforma busca fortalecer:

- solidariedade local;
- reaproveitamento de recursos;
- economia circular;
- organizacao do processo de doacao.

### Missao

Simplificar a solidariedade e reduzir desperdicios conectando quem doa com quem mais precisa.

---

## Features

### Autenticacao E Conta

- Cadastro de usuario com nome, e-mail, telefone, CPF, bairro e senha.
- Login com JWT.
- Sessao salva no frontend.
- Edicao de perfil.
- Exclusao de conta.
- Recuperacao de senha com token temporario e envio de e-mail.

### Home E Feed

- Listagem de itens pela API.
- Cards responsivos com imagem, categoria, condicao, descricao e localizacao.
- Filtro por categoria.
- Busca por texto.
- Ordenacao visual.
- Destaques da semana.
- Painel de impacto.

### Itens

- Criacao de item para doacao.
- Upload local de ate 3 imagens por item.
- Pagina de detalhes carregada por `GET /api/items/:id`.
- Edicao de item pelo doador.
- Cancelamento de item por soft delete.
- Status: `disponivel`, `reservado`, `concluido`, `cancelado`.

### Reservas

- Reserva de item disponivel.
- Mensagem opcional ao doador.
- Alteracao automatica do item para `reservado`.
- Cancelamento de reserva.
- Confirmacao/conclusao de entrega.
- Contato via WhatsApp sem expor telefone nas consultas publicas.

### Perfil E Historico

- Perfil com dados do usuario.
- Doacoes ativas.
- Itens recebidos recentemente.
- Historico de doacoes feitas e itens recebidos.
- Filtros, busca, ordenacao e acoes por status.

### Conteudo Informativo

- Menu hamburguer com modais de Sobre, FAQ e Contato.
- Footer reutilizavel.
- Navbar reutilizavel.

---

## Stack Tecnologico

| Camada | Tecnologia |
| --- | --- |
| Frontend | HTML5, CSS3, Bootstrap 5.3, Bootstrap Icons |
| JavaScript | jQuery + JavaScript |
| Componentes | HTML parcial carregado por JS |
| Backend | Node.js + Express |
| Banco | SQLite + Sequelize |
| Autenticacao | JWT + bcryptjs |
| Upload | multer + pasta local `node/uploads/items` |
| E-mail | nodemailer com Ethereal, SMTP/Mailtrap ou log local |
| Desenvolvimento | nodemon |

---

## Estrutura Do Projeto

```text
DoaFacil/
├── index.html
├── pages/
│   ├── login.html
│   ├── redefinir-senha.html
│   ├── perfil.html
│   ├── item.html
│   └── historico.html
├── assets/
│   ├── components/
│   │   ├── navbar.html
│   │   ├── footer.html
│   │   └── info-modals.html
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   ├── config.js
│   │   ├── modal.js
│   │   └── components/
│   └── img/
├── node/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   └── services/
│   ├── uploads/
│   ├── package.json
│   └── .env.example
├── backend/
├── API_DOCUMENTACAO.md
├── ARQUITETURA.md
├── FUNCIONALIDADES.md
└── guia_deploy_local.md
```

Observacao: a pasta `backend/` contem uma estrutura antiga/paralela. A API ativa do projeto fica em `node/`.

---

## Como Usar

### 1. Clonar O Repositorio

```bash
git clone https://github.com/LeticiaFelg/doaFacil.git
cd doaFacil
```

### 2. Instalar Dependencias Do Backend

```bash
cd node
npm install
```

### 3. Configurar Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

No PowerShell, se preferir:

```powershell
Copy-Item .env.example .env
```

Configuracao local recomendada:

```text
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:8000
EMAIL_PROVIDER=ethereal
```

### 4. Rodar Backend

Dentro da pasta `node/`:

```bash
npm run dev
```

A API deve ficar em:

```text
http://localhost:5000/api
```

Teste rapido:

```powershell
Invoke-RestMethod "http://localhost:5000/api/health"
```

Ao iniciar, o backend sincroniza o SQLite e executa o seed demonstrativo com Maria Clara Souza, itens, reservas e historicos.

### 5. Rodar Frontend

Em outro terminal, volte para a raiz do projeto:

```bash
cd ..
python -m http.server 8000
```

Acesse:

```text
http://localhost:8000
```

### 6. Login Demonstrativo

Usuario criado pelo seed:

```text
E-mail: maria.clara@example.com
Senha: senha123
```

### 7. Recuperacao De Senha Em Desenvolvimento

Com `EMAIL_PROVIDER=ethereal`, o backend imprime no terminal uma URL de preview do e-mail. Use essa preview para abrir o link de redefinicao.

Fluxo:

1. Acesse `pages/login.html`.
2. Clique em "Esqueceu a senha?".
3. Informe o e-mail.
4. Veja a preview URL no terminal do backend.
5. Abra o link de redefinicao.
6. Defina a nova senha.

### 8. Atualizar Branch Apos Merge Do PR

Depois que `back_novo` for mergeada em `main`:

```bash
git checkout main
git pull origin main
git checkout back_novo
git merge main
git push origin back_novo
```

---

## Telas Principais

### Login E Cadastro

Arquivo:

```text
pages/login.html
```

Recursos:

- login;
- cadastro;
- alerta apos conta criada;
- modal de recuperacao de senha;
- redirecionamento para perfil apos login.

### Redefinir Senha

Arquivo:

```text
pages/redefinir-senha.html
```

Recursos:

- leitura de token pela URL;
- nova senha;
- confirmacao de senha;
- chamada para `PUT /api/users/reset-password`;
- alerta de sucesso;
- redirecionamento para login.

### Home

Arquivo:

```text
index.html
```

Recursos:

- carrossel principal;
- destaques;
- feed carregado da API;
- filtro por categoria;
- busca;
- cards clicaveis para pagina de item.

### Item

Arquivo:

```text
pages/item.html
```

Recursos:

- busca por ID na API;
- detalhes do item;
- dados basicos do doador;
- reserva;
- contato por WhatsApp;
- edicao quando o usuario logado e o doador.

### Perfil

Arquivo:

```text
pages/perfil.html
```

Recursos:

- dados do usuario;
- edicao de perfil;
- doacoes ativas;
- itens recebidos recentemente;
- sair da conta;
- apagar conta.

### Historico

Arquivo:

```text
pages/historico.html
```

Recursos:

- doacoes feitas;
- itens recebidos;
- busca;
- filtro por status;
- ordenar;
- cancelar item/reserva;
- concluir reserva.

---

## Documentacao

Arquivos de apoio:

- [ARQUITETURA.md](ARQUITETURA.md): decisoes tecnicas, modelos, banco, upload e recuperacao de senha.
- [API_DOCUMENTACAO.md](API_DOCUMENTACAO.md): endpoints, parametros e exemplos.
- [FUNCIONALIDADES.md](FUNCIONALIDADES.md): explicacao funcional para usuarios e apresentacao.
- [guia_deploy_local.md](guia_deploy_local.md): notas sobre execucao local e deploy estatico.
- [node/README.md](node/README.md): resumo especifico da API.

---

## Roadmap

Pontos planejados:

- Criar container para system tests.
- Implementar testes unitarios.
- Implementar testes de integracao.
- Implementar testes de sistema automatizados.
- Evoluir upload de imagens para S3 com presigned URL.
- Separar `GET /api/health` e `GET /api/ready`, caso necessario.
- Refinar conteudo final do FAQ.

---

## Contribuindo

1. Crie uma branch para sua alteracao.
2. Faca commits com mensagens claras.
3. Envie para o remoto.
4. Abra um Pull Request.
5. Depois do merge, atualize `main` e sincronize sua branch de trabalho.

Exemplo:

```bash
git checkout -b feature/minha-feature
git add .
git commit -m "feat: descreve minha feature"
git push origin feature/minha-feature
```

---

## Licenca

Este projeto esta sob a licenca MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Conectar quem doa com quem mais precisa**

Made by UI - Devs Squad - Way Anima Hub

</div>
