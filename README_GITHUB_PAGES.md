# DoaFácil - Versão GitHub Pages (Demo)

🎭 **Esta é uma versão demo client-side do DoaFácil** que funciona 100% no navegador, sem necessidade de backend.

## 🚀 Como usar

### Opção 1: Trocar o arquivo API (Recomendado para GitHub Pages)

1. **Renomeie os arquivos**:
   ```bash
   mv assets/js/api.js assets/js/api-backend.js.bak
   mv assets/js/api-mock.js assets/js/api.js
   ```

2. **Commit e push para o GitHub**:
   ```bash
   git add .
   git commit -m "Versão demo client-side para GitHub Pages"
   git push
   ```

3. **Configure o GitHub Pages**:
   - Vá em **Settings** → **Pages**
   - Em **Source**, selecione `main` branch
   - Clique em **Save**
   - Seu site estará disponível em: `https://SEU_USUARIO.github.io/doaFacil/`

### Opção 2: Manter ambos os arquivos

Você também pode manter os dois arquivos e apenas trocar a importação nos HTMLs:

**De:**
```html
<script src="../assets/js/config.js"></script>
<script src="../assets/js/api.js"></script>
```

**Para:**
```html
<script src="../assets/js/api-mock.js"></script>
```

## ✨ Funcionalidades

### O que funciona:
- ✅ Cadastro de usuários (salvos no localStorage)
- ✅ Login (qualquer senha funciona no modo demo)
- ✅ Visualização de itens disponíveis
- ✅ Filtros por categoria
- ✅ Busca de itens
- ✅ Reserva de itens
- ✅ Perfil do usuário
- ✅ Histórico de doações
- ✅ Adicionar novos itens (simulado)

### Limitações do modo demo:
- ⚠️ Dados são salvos apenas no localStorage do navegador
- ⚠️ Dados são perdidos ao limpar cache/cookies
- ⚠️ Upload de imagens real não funciona (usa imagens placeholder)
- ⚠️ Não há validação de senha (qualquer senha funciona)
- ⚠️ Não envia emails reais
- ⚠️ Dados não são compartilhados entre usuários/dispositivos

## 📱 Como testar

1. Acesse o site
2. Clique em **"Criar conta"**
3. Preencha os dados (pode usar qualquer informação)
4. Faça login com o email cadastrado
5. Explore o feed, reserve itens, veja seu perfil!

## 🎨 Banner de Modo Demo

A API mock adiciona automaticamente um banner roxo no topo do site indicando que está em modo demo. Para remover:

Edite `assets/js/api-mock.js` e comente/remova a seção:
```javascript
// ─── Banner de Modo Demo ────────────────────────────────────
(function() {
  // ... código do banner
})();
```

## 🔄 Voltar para versão com backend

Para voltar a usar o backend real:

```bash
mv assets/js/api.js assets/js/api-mock.js
mv assets/js/api-backend.js.bak assets/js/api.js
```

## 📂 Estrutura de Dados (localStorage)

A API mock usa três chaves no localStorage:

- `doafacil_mock_users` - Usuários cadastrados
- `doafacil_mock_items` - Itens disponíveis
- `doafacil_mock_reservations` - Reservas feitas
- `doafacil_user` - Usuário logado atualmente
- `doafacil_token` - Token de sessão (mockado)

Para resetar todos os dados:
```javascript
localStorage.clear();
location.reload();
```

## 🎯 Ideal para

- ✅ Portfólio
- ✅ Demonstrações
- ✅ Protótipos
- ✅ Testes de interface
- ✅ Apresentações de projeto

## 🚀 Deploy no GitHub Pages

O projeto já está configurado para funcionar no GitHub Pages. Apenas certifique-se de:

1. Usar `api-mock.js` ao invés de `api.js`
2. Todos os caminhos são relativos (não usam URLs absolutas)
3. Não há dependências de backend

---

**Desenvolvido por DoaFácil Team** 💚
