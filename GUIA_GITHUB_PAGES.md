# 📘 Guia Completo: Deploy no GitHub Pages

## 🎯 Passo a Passo

### 1️⃣ Preparar o Projeto

Já fizemos isso automaticamente com o script! 

✅ Versão demo configurada
✅ API mock no lugar
✅ Backup da API original criado

### 2️⃣ Fazer Commit e Push

```powershell
# Adicionar todos os arquivos
git add .

# Criar commit
git commit -m "🎭 Versão demo client-side para GitHub Pages"

# Enviar para o GitHub
git push
```

### 3️⃣ Configurar GitHub Pages

1. **Acesse seu repositório no GitHub**
   - Vá para `https://github.com/SEU_USUARIO/doaFacil`

2. **Abra as Configurações**
   - Clique na aba **Settings** (Configurações)

3. **Vá para Pages**
   - No menu lateral esquerdo, procure e clique em **Pages**

4. **Configure a Source (Origem)**
   - Em **Source**, selecione:
     - Branch: `main` (ou `master`)
     - Folder: `/ (root)`
   - Clique em **Save**

5. **Aguarde o Deploy**
   - O GitHub vai processar e fazer o deploy
   - Pode levar 1-3 minutos
   - Você verá uma mensagem: "Your site is live at..."

6. **Acesse seu Site**
   - URL: `https://SEU_USUARIO.github.io/doaFacil/`
   - Ou `https://SEU_USUARIO.github.io/NOME_DO_REPO/`

---

## 🧪 Testar Localmente Antes

Antes de fazer push, teste localmente:

### Opção 1: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

### Opção 2: Python HTTP Server
```powershell
# Se você tem Python instalado
python -m http.server 8000

# Acesse: http://localhost:8000
```

### Opção 3: Node.js HTTP Server
```powershell
# Instalar (uma vez)
npm install -g http-server

# Executar
http-server

# Acesse: http://localhost:8080
```

---

## 🎨 Personalizações

### Remover Banner "Modo Demo"

Edite `assets/js/api.js` (antiga api-mock.js) e **comente** estas linhas no final:

```javascript
// ─── Banner de Modo Demo ────────────────────────────────────
/*
(function() {
  if (window.location.pathname.includes('/pages/login.html')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'demo-mode-banner';
  banner.innerHTML = `...`;
  
  window.addEventListener('DOMContentLoaded', () => {
    document.body.insertBefore(banner, document.body.firstChild);
  });
})();
*/
```

### Customizar URL do Repositório

Se seu repositório não está na raiz (ex: `/doaFacil/`), você pode precisar ajustar alguns caminhos:

**No `index.html`** e outros HTMLs, verifique se os caminhos estão corretos:
- ✅ `./assets/css/...` (relativo - funciona)
- ❌ `/assets/css/...` (absoluto - pode não funcionar)

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

```powershell
git add .
git commit -m "Descrição da mudança"
git push
```

O GitHub Pages atualiza automaticamente em 1-3 minutos.

---

## 🐛 Troubleshooting

### Site não aparece
- Verifique se o Pages está ativado nas Settings
- Aguarde alguns minutos após o push
- Teste com modo anônimo/incógnito do navegador

### CSS não carrega
- Verifique se os caminhos são relativos (`./` ou `../`)
- Limpe o cache do navegador (Ctrl+Shift+R)

### JavaScript não funciona
- Abra o Console do navegador (F12)
- Veja se há erros de caminho (404)
- Verifique se todos os scripts estão importados

### Banner "Modo Demo" não aparece
- É normal se você estiver na página de login
- Verifique se o script está no final do `api.js`

---

## 📱 Testar em Diferentes Dispositivos

Depois que estiver no ar:

1. **Desktop**: Acesse normalmente
2. **Mobile**: Acesse pelo celular ou use:
   - Chrome: F12 → Toggle Device Toolbar
   - Firefox: F12 → Responsive Design Mode

---

## 🎓 Como Funciona o Modo Demo

### Dados Mockados
O projeto vem com 12 itens pré-cadastrados (sofá, guarda-roupa, micro-ondas, etc.)

### localStorage
Todos os dados são salvos no navegador:
- `doafacil_mock_users` - Usuários cadastrados
- `doafacil_mock_items` - Itens para doação
- `doafacil_mock_reservations` - Reservas
- `doafacil_user` - Usuário logado
- `doafacil_token` - Token de sessão

### Resetar Dados
Console do navegador (F12):
```javascript
localStorage.clear();
location.reload();
```

---

## ✅ Checklist Final

Antes de considerar finalizado:

- [ ] Testou localmente
- [ ] Fez commit e push
- [ ] Configurou GitHub Pages
- [ ] Site está no ar e funcionando
- [ ] Testou cadastro de novo usuário
- [ ] Testou login
- [ ] Testou filtros de categoria
- [ ] Testou reserva de item
- [ ] Testou perfil do usuário
- [ ] Testou em mobile (responsividade)

---

## 🚀 Próximos Passos

Depois que estiver no ar:

1. **Compartilhe o link!**
   - Adicione no README do GitHub
   - Coloque no seu portfólio
   - Compartilhe com o time

2. **Custom Domain (Opcional)**
   - Você pode configurar um domínio próprio
   - Ex: `doafacil.com.br`
   - Configure nas Settings → Pages → Custom domain

3. **Analytics (Opcional)**
   - Adicione Google Analytics para ver acessos
   - Ou outras ferramentas de tracking

---

**🎉 Pronto! Seu DoaFácil está no ar!** 

Qualquer dúvida, consulte a [documentação oficial do GitHub Pages](https://docs.github.com/en/pages).
