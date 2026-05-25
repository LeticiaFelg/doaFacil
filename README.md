# 🌿 DoaFácil

> **Plataforma digital de redistribuição de bens materiais, conectando doadores com quem mais precisa**

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)](https://getbootstrap.com)
[![Responsive](https://img.shields.io/badge/Design-Responsivo-brightgreen)](#)

---

## 📋 Sumário

- [Sobre](#-sobre)
- [Features](#-features)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Usar](#-como-usar)
- [Telas Principais](#-telas-principais)
- [Guia de Navegação](#-guia-de-navegação)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 💡 Sobre

O **DoaFácil** é uma plataforma web inovadora que democratiza o acesso a bens materiais através de um sistema inteligente de doações. Conecta:

- 🤝 **Doadores** que desejam redistribuir bens em bom estado
- 🏠 **Receptores** que necessitam de suporte material
- 🏛️ **Instituições** parceiras que amplificam o impacto social

Com interface intuitiva, filtros inteligentes e rastreamento em tempo real, o DoaFácil promove **solidariedade e sustentabilidade** em uma única plataforma.

### 🎯 Missão

Reduzir desigualdades e desperdício através da conexão direta entre quem pode doar e quem necessita.

---

## ✨ Features

### Autenticação & Perfis Múltiplos

- ✅ Login e cadastro com painel atrativo
- 👥 Suporte para múltiplos perfis simultâneos (Doador, Receptor, Instituição)
- 🔐 Sistema de verificação com badges

### Feed de Doações

- 📱 Grid responsivo de cards com preview de itens
- 🏷️ Categorização inteligente (Móveis, Eletrônicos, Roupas, Utensílios, etc.)
- 📍 Localização aproximada de cada doação
- 🔍 Busca e filtros por categoria e disponibilidade
- 📊 Painel de Impacto em tempo real com contadores animados

### Gerenciamento de Itens

- 📷 Galeria multi-imagem com navegação
- 📋 Especificações técnicas detalhadas
- 🗺️ Mapa de localização integrado
- 🔄 Itens relacionados sugeridos automaticamente
- ⭐ Sistema de status dinâmico (Disponível, Reservado, Concluído)

### Perfil de Usuário

- 🎯 Dashboard personalizável por tipo de perfil
- 📈 Estatísticas de atividade
- 💾 Histórico de transações
- 🔔 Notificações de reservas

### Sistema de Reservas

- 📅 Reserva com confirmação modal
- 💬 Integração WhatsApp para contato direto
- ✉️ Notificação automática ao doador
- 🔄 Atualização visual instantânea do status

### Histórico Centralizado

- 📊 Dashboard com duas abas (Doações / Recebimentos)
- 🎨 Status visuais com pills coloridas
- 📑 Ordenação, busca e filtros funcionais
- 📈 Métricas resumidas

---

## 🛠️ Stack Tecnológico

| Componente        | Tecnologia                    | Versão          |
| ----------------- | ----------------------------- | --------------- |
| **Markup**        | HTML5 Semântico               | -               |
| **Styling**       | CSS3 + Variáveis Customizadas | -               |
| **Framework CSS** | Bootstrap                     | 5.3.2           |
| **Icons**         | Bootstrap Icons               | 1.11.3          |
| **JavaScript**    | Vanilla JS                    | -               |
| **Tipografia**    | Fraunces + DM Sans            | Google Fonts    |
| **Design**        | Mobile-First                  | 100% Responsivo |

**Sem dependências externas complexas** — foco em performance e leveza.

---

## 📁 Estrutura do Projeto

```
DoaFacil/
├── index.html                 # Página de entrada (Feed)
├── README.md                  # Este arquivo
├── assets/
│   ├── components/
│   │   └── navbar.html        # Componente de navegação
│   └── css/
│       ├── feed.css           # Estilos do feed
│       ├── historico.css      # Estilos do histórico
│       ├── item.css           # Estilos de descrição do item
│       ├── login.css          # Estilos de login/cadastro
│       └── perfil.css         # Estilos do perfil
└── pages/
    ├── login.html             # Tela de autenticação
    ├── historico.html         # Tela de histórico
    ├── item.html              # Tela de descrição do item
    └── perfil.html            # Tela de perfil do usuário
```

---

## 🚀 Como Usar

### 1. **Clonar o Repositório**

```bash
git clone https://github.com/seu-usuario/doafacil.git
cd doafacil
```

### 2. **Abrir no Navegador**

- **Opção 1**: Abra `index.html` diretamente no navegador
- **Opção 2**: Use um servidor local (recomendado)

  ```bash
  # Python
  python -m http.server 8000

  # Node.js
  npx http-server

  # Live Server (VS Code)
  # Instale a extensão Live Server e clique "Go Live"
  ```

### 3. **Acessar**

Navegue para `http://localhost:8000` (ou a porta configurada)

---

## 📱 Telas Principais

### 1️⃣ **Login & Cadastro** (`pages/login.html`)

**Seção Esquerda (Hero):**

- Branding com identidade visual verde-escuro
- Proposta de valor da plataforma
- 📊 Estatísticas de impacto animadas

**Seção Direita (Formulário):**

- Abas Login/Cadastro
- Seletor visual de perfis múltiplos
- Validação de formulários

```
┌─────────────────────────────────────┐
│ 🌿 DoaFácil  │  Bem-vindo de volta  │
│ Conectar...  │  📧 Email            │
│ Estatísticas │  🔒 Senha            │
│ 4.2k itens   │  [Entrar]            │
└─────────────────────────────────────┘
```

---

### 2️⃣ **Feed de Doações** (`index.html`)

**Layout:**

```
┌──────────────────────────────────────────┐
│  🌿 DoaFácil │ 🏠 Home  👤 Perfil       │
├──────┬───────────────────────────────────┤
│      │                                    │
│ 📊   │  ┌────┐  ┌────┐  ┌────┐          │
│Impac-│  │Card│  │Card│  │Card│          │
│ to   │  └────┘  └────┘  └────┘          │
│      │                                    │
│ 🔍   │  ┌────┐  ┌────┐  ┌────┐          │
│Categ │  │Card│  │Card│  │Card│          │
│oria  │  └────┘  └────┘  └────┘          │
│      │                                    │
└──────┴───────────────────────────────────┘
```

**Features:**

- Grid responsivo com cards de itens
- Sidebar com Painel de Impacto (📦 4.2k itens, 👨‍👩‍👧 1.8k famílias, etc.)
- Filtros por categoria e disponibilidade
- Em mobile: painel vira offcanvas

---

### 3️⃣ **Perfil de Usuário** (`pages/perfil.html`)

**Hero Card:**

- Avatar com badge de verificação ✅
- Nome, localização e data de ingresso
- 🏷️ Badges de tipo (clicáveis)

**Conteúdo Dinâmico:**

- **Modo Doador**: Doações ativas, estatísticas, badges de recorrência
- **Modo Receptor**: Itens de interesse, histórico resumido
- **Modo Instituição**: Botão de solicitação, estatísticas de impacto

---

### 4️⃣ **Descrição do Item** (`pages/item.html`)

**Layout 2 Colunas:**

_Coluna 1 (Esquerda):_

- 📷 Galeria com navegação por pontos
- 📋 Especificações técnicas
- 🗺️ Mapa de localização
- 🔗 Itens relacionados

_Coluna 2 (Direita - Fixa):_

- ⭐ Status do item
- 📍 Localização
- 🔘 Botão "Reservar"
- 💬 Botão WhatsApp

**Modal de Confirmação:**

- Mensagem pré-preenchida ao doador
- Status muda em tempo real após confirmação

---

### 5️⃣ **Histórico** (`pages/historico.html`)

**Abas:**

- 📤 Doações Feitas
- 📥 Itens Recebidos

**Funcionalidades:**

- 📊 Métricas no topo (totais, status, etc.)
- 🎨 Tabela com pills coloridas por status
- ✅ Linhas verdes para itens concluídos
- 🔍 Busca, filtro por status e ordenação

---

## 🗺️ Guia de Navegação

```
┌─ LOGIN/CADASTRO (pages/login.html)
│  ├─ Múltiplos perfis
│  ├─ Validação
│  └─ [Entrar] ────────────┐
│                           ▼
└──────────────────► FEED (index.html) ◄─────────┐
                    ├─ Grid de cards              │
                    ├─ Painel de Impacto         │
                    ├─ Filtros                   │
                    ├─ Clica em card ────┐       │
                    │                    │       │
                    │                    ▼       │
                    │            ITEM (pages/item.html)
                    │            ├─ Galeria      │
                    │            ├─ Detalhes     │
                    │            ├─ Reservar ──┐ │
                    │            │   Modal ◄───┘ │
                    │            └─────────────────┘
                    │
                    ├─ Nav Links
                    ├─► PERFIL (pages/perfil.html)
                    │   ├─ Hero card
                    │   ├─ Badges (clicáveis)
                    │   └─ Histórico resumido
                    │
                    └─► HISTÓRICO (pages/historico.html)
                        ├─ Abas (Doações/Recebimentos)
                        ├─ Métricas
                        └─ Tabela com filtros
```

---

## 📊 Dados de Impacto (Mock)

| Métrica                   | Valor |
| ------------------------- | ----- |
| 📦 Itens redistribuídos   | 4.231 |
| 👨‍👩‍👧 Famílias beneficiadas  | 1.847 |
| 🤝 Doadores ativos        | 892   |
| 🏛️ Instituições parceiras | 67    |

---

## 🎨 Design System

### Paleta de Cores

- **Verde Escuro** (Principal): #1a5f3f — Confiança, natureza, crescimento
- **Verde Médio** (Secundário): #2d9966 — Destaque, CTAs
- **Branco** (Background): #fafbf9
- **Cinza Escuro** (Texto): #2d3436

### Tipografia

- **Display**: Fraunces (Headlines, branding)
- **Corpo**: DM Sans (Texto, UI)
- **Pesos**: 300, 400, 500, 600, 700

### Responsividade

- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

---

## 🚦 Roadmap

### ✅ Fase 1 (MVP - Atual)

- [x] Telas estáticas responsivas
- [x] Filtros e busca com dados mock
- [x] Sistema de múltiplos perfis
- [x] Modals de reserva
- [x] Integração WhatsApp

### 📋 Fase 2 (Backend)

- [ ] API REST com Node.js/Express
- [ ] Banco de dados (MongoDB/PostgreSQL)
- [ ] Autenticação real (JWT)
- [ ] Upload de imagens
- [ ] Sistema de notificações

### 🔮 Fase 3 (Expansão)

- [ ] App mobile (React Native)
- [ ] Sistema de avaliações
- [ ] Inteligência artificial de recomendações
- [ ] Integração de pagamento
- [ ] Mapa interativo

---

## 👥 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Diretrizes

- Mantenha o código limpo e bem comentado
- Siga o design system estabelecido
- Teste em mobile e desktop
- Use nomes descritivos para variáveis e classes

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

Tem dúvidas ou sugestões?

- 📧 Email: suporte@doafacil.com
- 💬 Issues: [GitHub Issues](https://github.com/seu-usuario/doafacil/issues)
- 📱 WhatsApp: [Link WhatsApp](https://wa.me/5521999999999)

---

## 👨‍💻 Desenvolvedor

**Projeto desenvolvido para**: IBMR - Usabilidade, Desenvolvimento Web e Mobile (2026.1)

**Tecnologias**: HTML5 · CSS3 · Bootstrap 5.3 · JavaScript Vanilla

---

<div align="center">

**Conectar quem doa com quem mais precisa** 🌿

Made with ❤️ for impact

</div>
