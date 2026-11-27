# ✅ Checklist de Deploy - GitHub Pages

Use esta lista para garantir que tudo está configurado corretamente.

---

## 📋 Pré-Deploy

### Configuração Local

- [ ] Executou `.\switch-to-demo.ps1` com sucesso
- [ ] Arquivo `assets/js/api.js` é a versão mock (não a backend)
- [ ] Arquivo `assets/js/api-backend.js.bak` existe (backup)
- [ ] Abriu `test-demo.html` no navegador e todos os testes passaram ✅

### Teste Manual Rápido

- [ ] Abriu `index.html` no navegador (pode usar Live Server)
- [ ] Banner roxo "Modo Demo" aparece no topo
- [ ] Feed mostra 12 itens pré-cadastrados
- [ ] Filtros de categoria funcionam
- [ ] Foi para `pages/login.html` e criou uma conta
- [ ] Fez login com a conta criada
- [ ] Nome do usuário aparece no navbar
- [ ] Consegue reservar um item
- [ ] Perfil mostra dados do usuário

---

## 🚀 Deploy no GitHub

### Preparação

- [ ] Projeto está em um repositório GitHub
- [ ] Branch principal é `main` (ou `master`)

### Commit e Push

```bash
# Execute estes comandos:
git add .
git commit -m "🎭 Versão demo client-side para GitHub Pages"
git push origin main
```

- [ ] Commit feito sem erros
- [ ] Push concluído com sucesso
- [ ] Código visível no GitHub (acesse o repositório no navegador)

### Configurar GitHub Pages

1. [ ] Acessou `https://github.com/SEU_USUARIO/REPO/settings/pages`
2. [ ] Em **Source**, selecionou:
   - Branch: `main`
   - Folder: `/ (root)`
3. [ ] Clicou em **Save**
4. [ ] Aguardou 2-3 minutos
5. [ ] Apareceu mensagem: "Your site is published at..."
6. [ ] Copiou a URL: `https://SEU_USUARIO.github.io/REPO/`

---

## 🧪 Pós-Deploy

### Verificação Inicial

- [ ] Acessou a URL do GitHub Pages
- [ ] Página carregou sem erros 404
- [ ] CSS está funcionando (design aparece corretamente)
- [ ] Banner "Modo Demo" aparece
- [ ] Imagens dos itens carregaram

### Teste de Funcionalidades

- [ ] **Home (index.html)**
  - [ ] Feed de itens aparece
  - [ ] Contadores animados funcionam
  - [ ] Carrossel de destaques funciona
  - [ ] Filtros de categoria funcionam
  - [ ] Busca funciona
  
- [ ] **Login (pages/login.html)**
  - [ ] Consegue criar nova conta
  - [ ] Validações funcionam (email, senha, etc.)
  - [ ] Consegue fazer login
  - [ ] Redirecionado para perfil após login
  
- [ ] **Perfil (pages/perfil.html)**
  - [ ] Nome aparece corretamente
  - [ ] Pode editar informações
  - [ ] Pode adicionar novo item (simulado)
  - [ ] Pode fazer logout
  
- [ ] **Item (pages/item.html?id=1)**
  - [ ] Detalhes do item aparecem
  - [ ] Botão de reservar funciona
  - [ ] Informações do doador aparecem

### Teste em Dispositivos

- [ ] **Desktop** - Chrome/Edge
- [ ] **Desktop** - Firefox
- [ ] **Mobile** - Testado no celular OU modo responsivo (F12)
- [ ] Layout responsivo funciona bem

### Console do Navegador

- [ ] Abriu Console (F12 → Console)
- [ ] Sem erros vermelhos críticos
- [ ] API DoaFacilAPI está disponível
- [ ] localStorage tem dados mockados

---

## 📱 Compartilhamento

### Documentação

- [ ] Adicionou link do GitHub Pages no README.md
- [ ] README menciona que é versão demo
- [ ] Documentação está clara para outros desenvolvedores

### Exemplo de seção no README:

```markdown
## 🌐 Demo Online

Versão demo disponível em: **[DoaFácil Demo](https://SEU_USUARIO.github.io/doaFacil/)**

> Esta é uma versão demo client-side. Dados são salvos apenas no navegador.
```

### Portfólio

- [ ] Link adicionado no portfólio pessoal
- [ ] Screenshots/GIFs criados
- [ ] Descrição do projeto atualizada

---

## 🐛 Troubleshooting Comum

### ❌ Página mostra 404

**Solução:**
- Aguarde 5 minutos e tente novamente
- Limpe cache (Ctrl+Shift+R)
- Verifique se Pages está ativado em Settings
- Tente modo anônimo do navegador

### ❌ CSS não carrega (página sem estilo)

**Solução:**
- Verifique se os caminhos são relativos (`./assets/...`)
- Veja Console (F12) se há erro 404 nos arquivos CSS
- Se o repo não está na raiz, ajuste caminhos

### ❌ JavaScript não funciona

**Solução:**
- Abra Console (F12) e veja erros
- Verifique se `api.js` é a versão mock
- Execute `.\switch-to-demo.ps1` novamente

### ❌ "API não está carregada"

**Solução:**
```powershell
# Execute novamente:
.\switch-to-demo.ps1

# Verifique:
Get-Content assets\js\api.js -Head 10
# Deve mostrar "Versão Client-Side Mock"
```

### ❌ Dados não aparecem

**Solução:**
- Abra Console (F12)
- Digite: `localStorage.clear(); location.reload()`
- Recarregue a página

---

## 🎯 Checklist Final

Antes de considerar 100% pronto:

- [ ] ✅ Todos os testes acima passaram
- [ ] 📱 Testado em desktop e mobile
- [ ] 🔗 Link funcionando e compartilhado
- [ ] 📄 Documentação atualizada
- [ ] 🎨 Screenshots/GIFs criados (opcional)
- [ ] 💚 Satisfeito com o resultado!

---

## 📞 Precisa de Ajuda?

### Resetar Tudo

```powershell
# Voltar ao backend
.\switch-to-backend.ps1

# Limpar git
git reset --hard HEAD
git clean -fd

# Começar de novo
.\switch-to-demo.ps1
```

### Verificar Versão Atual

```powershell
# Ver primeiras linhas do api.js
Get-Content assets\js\api.js -Head 5

# Se mostrar "Client-Side Mock" = Demo ✅
# Se mostrar "Camada de comunicação" = Backend ❌
```

### Testar Localmente

```powershell
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx http-server

# Opção 3: VS Code Live Server
# Clique direito em index.html → Open with Live Server
```

---

## 🎉 Pronto!

Se todos os checkboxes acima estão marcados, seu DoaFácil está no ar! 🚀

**URL do seu projeto:** `https://_____________________.github.io/_______________/`

---

**Data do deploy:** ___/___/______

**Responsável:** _______________________

**Versão:** Demo Client-Side v1.0
