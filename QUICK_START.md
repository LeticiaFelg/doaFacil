# ⚡ Quick Start - 3 Minutos

## 🎯 Objetivo

Colocar o DoaFácil no ar no GitHub Pages **em 3 minutos**.

---

## 📍 Você está aqui

```
┌─────────────────────────────────────┐
│  💻 Projeto Local                   │
│  📁 doaFacil/                       │
│  └── Com backend Node.js            │
└─────────────────────────────────────┘
              ↓
         TRANSFORMAR
              ↓
┌─────────────────────────────────────┐
│  🌐 GitHub Pages                    │
│  🎭 Versão Demo                     │
│  └── Sem backend (só navegador)     │
└─────────────────────────────────────┘
```

---

## 🚀 Passo a Passo

### 1️⃣ Ativar Versão Demo (10 segundos)

```powershell
.\switch-to-demo.ps1
```

**O que faz:**
- ✅ Cria backup do `api.js` original
- ✅ Troca para `api-mock.js` (versão sem backend)
- ✅ Pronto para GitHub Pages!

---

### 2️⃣ Testar Localmente (30 segundos)

**Opção A - VS Code:**
- Clique direito em `index.html`
- Selecione **"Open with Live Server"**

**Opção B - Navegador:**
- Abra `test-demo.html` no navegador
- Todos os testes devem estar ✅

**Opção C - Terminal:**
```powershell
python -m http.server 8000
# Acesse: http://localhost:8000
```

✅ **Funcionou?** Vá para o próximo passo!

---

### 3️⃣ Commit e Push (20 segundos)

```powershell
git add .
git commit -m "🎭 Versão demo"
git push
```

---

### 4️⃣ Ativar GitHub Pages (60 segundos)

1. Vá para: `github.com/SEU_USUARIO/doaFacil/settings/pages`
2. Em **"Source"**, selecione:
   - Branch: **main**
   - Folder: **/ (root)**
3. Clique **Save**
4. Aguarde 2 minutos
5. Copie a URL que aparecer

---

### 5️⃣ Acessar e Comemorar! (10 segundos)

Acesse: `https://SEU_USUARIO.github.io/doaFacil/`

🎉 **Funcionou!**

---

## 📱 Teste Rápido

Faça isso no site publicado:

1. ✅ Clique em **"Criar conta"**
2. ✅ Preencha com qualquer dado
3. ✅ Faça login
4. ✅ Veja seu nome aparecer no navbar
5. ✅ Reserve um item do feed

**Tudo funcionando?** 🎉 Projeto no ar!

---

## 🔄 Precisa Voltar ao Backend?

```powershell
.\switch-to-backend.ps1
cd backend
npm run dev
```

---

## ❓ FAQ Rápido

### "O comando switch-to-demo.ps1 não funciona"

**Windows:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\switch-to-demo.ps1
```

**Ou manualmente:**
```powershell
Copy-Item assets\js\api.js assets\js\api-backend.js.bak
Copy-Item assets\js\api-mock.js assets\js\api.js
```

### "GitHub Pages mostra 404"

- ✅ Aguarde 3-5 minutos
- ✅ Limpe cache: Ctrl+Shift+R
- ✅ Tente modo anônimo

### "CSS não aparece"

- ✅ Verifique Console (F12) por erros
- ✅ Caminhos devem ser relativos: `./assets/`
- ✅ Aguarde propagação do GitHub

### "Como resetar tudo?"

```javascript
// No Console do navegador (F12):
localStorage.clear();
location.reload();
```

---

## 📚 Documentação Completa

Precisa de mais detalhes?

- **[GUIA_GITHUB_PAGES.md](GUIA_GITHUB_PAGES.md)** - Tutorial passo a passo
- **[DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)** - Checklist completo
- **[README_GITHUB_PAGES.md](README_GITHUB_PAGES.md)** - Documentação técnica

---

## 🎨 Fluxo Visual

```
   LOCAL                    GITHUB              PAGES
     
 ┌─────────┐           ┌─────────┐        ┌─────────┐
 │ api.js  │  switch   │  push   │  auto  │ online  │
 │(backend)│  ──────→  │   to    │  ───→  │  demo   │
 │         │  to-demo  │ GitHub  │  wait  │  site   │
 └─────────┘           └─────────┘        └─────────┘
     ↓                     ↓                   ↓
  10 seg               20 seg             2-3 min
```

---

## ⏱️ Checklist de 3 Minutos

```
[ ] 00:00 - 00:10  →  .\switch-to-demo.ps1
[ ] 00:10 - 00:40  →  Testar local (test-demo.html)
[ ] 00:40 - 01:00  →  git add . && git commit && git push
[ ] 01:00 - 01:30  →  Settings → Pages → Save
[ ] 01:30 - 03:00  →  Aguardar deploy
[ ] 03:00 - 03:30  →  Acessar e testar! 🎉
```

---

## 💡 Dica Pro

Enquanto aguarda o GitHub Pages (passo 5), você pode:

- 📸 Tirar screenshots do site local
- 📝 Atualizar o README com o link
- 🎬 Preparar um GIF/vídeo demo
- ☕ Pegar um café!

---

## 🎯 Pronto!

Seu DoaFácil está no ar em: **`https://________________.github.io/________/`**

**Próximo passo:** Compartilhe o link! 🚀

---

**Última atualização:** Dezembro 2024  
**Versão:** Quick Start v1.0
