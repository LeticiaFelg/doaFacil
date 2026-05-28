# DoaFácil — Guia de Deploy: S3 (frontend) + Laptop (backend)

---

## Visão geral

```
Browser → S3 (HTML/CSS/JS) → Cloudflare Tunnel → Laptop :3000 → DynamoDB (AWS)
```

- **Frontend:** hospedado no bucket S3 (estático, gratuito)  
- **Backend:** Express rodando no laptop de um integrante  
- **Túnel:** Cloudflare Tunnel — expõe o laptop para a internet com URL fixa e HTTPS gratuito  
- **Banco:** DynamoDB na AWS (free tier permanente)  

---

## Parte 1 — Criar as tabelas DynamoDB

Execute estes comandos uma única vez com a AWS CLI configurada:

```bash
aws dynamodb create-table \
  --table-name doafacil_users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

aws dynamodb create-table \
  --table-name doafacil_items \
  --attribute-definitions AttributeName=itemId,AttributeType=S \
  --key-schema AttributeName=itemId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

aws dynamodb create-table \
  --table-name doafacil_reservations \
  --attribute-definitions AttributeName=reservationId,AttributeType=S \
  --key-schema AttributeName=reservationId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

## Parte 2 — Criar usuário IAM para o laptop

O laptop precisa de credenciais para acessar o DynamoDB.
Crie um usuário com o mínimo de permissões necessárias:

1. Acesse o **AWS Console → IAM → Users → Create user**
2. Nome: `doafacil-local`
3. Em "Permissions", escolha "Attach policies directly"
4. Crie uma **policy inline** com este JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/doafacil_users",
        "arn:aws:dynamodb:us-east-1:*:table/doafacil_items",
        "arn:aws:dynamodb:us-east-1:*:table/doafacil_reservations"
      ]
    }
  ]
}
```

5. Gere as **Access Keys** e coloque no `.env` do backend.

---

## Parte 3 — Configurar o Cloudflare Tunnel (laptop)

O Cloudflare Tunnel cria uma URL pública fixa e gratuita que aponta para o `localhost:3000`.

### 3.1 — Criar conta e instalar o `cloudflared`

1. Crie conta gratuita em https://cloudflare.com  
2. Baixe o `cloudflared` para o sistema operacional do laptop:

```bash
# Linux (Ubuntu/Debian)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# macOS
brew install cloudflare/cloudflare/cloudflared

# Windows: baixe o .exe em
# https://github.com/cloudflare/cloudflared/releases/latest
```

### 3.2 — Login e criação do tunnel

```bash
# Faz login (abre o browser para autorizar)
cloudflared tunnel login

# Cria o tunnel (guarde o ID que aparecer)
cloudflared tunnel create doafacil-api

# Verifica se foi criado
cloudflared tunnel list
```

### 3.3 — Criar arquivo de configuração do tunnel

Crie o arquivo `~/.cloudflared/config.yml`:

```yaml
tunnel: doafacil-api
credentials-file: /home/SEU_USUARIO/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: doafacil-api.SEU_DOMINIO.workers.dev
    service: http://localhost:3000
  - service: http_status:404
```

> Substitua `SEU_USUARIO`, `TUNNEL_ID` e `SEU_DOMINIO` pelos valores reais.

### 3.4 — Criar rota DNS

```bash
cloudflared tunnel route dns doafacil-api doafacil-api.SEU_DOMINIO.workers.dev
```

### 3.5 — Iniciar o tunnel

```bash
cloudflared tunnel run doafacil-api
```

A URL pública será algo como:  
`https://doafacil-api.meugrupo.workers.dev`

Essa URL **não muda** — é permanente enquanto o tunnel existir.

---

## Parte 4 — Hospedar o frontend no S3

### 4.1 — Criar e configurar o bucket

```bash
# Cria o bucket (escolha um nome único)
aws s3 mb s3://doafacil-site --region us-east-1

# Habilita hospedagem de site estático
aws s3 website s3://doafacil-site \
  --index-document index.html \
  --error-document index.html

# Libera acesso público (necessário para site estático)
aws s3api put-bucket-policy \
  --bucket doafacil-site \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::doafacil-site/*"
    }]
  }'
```

A URL do site será:  
`http://doafacil-site.s3-website-us-east-1.amazonaws.com`

### 4.2 — Atualizar a URL da API no frontend

Edite `assets/js/config.js`:

```js
window.API_BASE_URL = 'https://doafacil-api.SEU_DOMINIO.workers.dev/api';
```

### 4.3 — Fazer upload dos arquivos do frontend

```bash
# A partir da raiz do repositório doaFacil
aws s3 sync . s3://doafacil-site \
  --exclude ".git/*" \
  --exclude "backend/*" \
  --exclude "*.md" \
  --acl public-read
```

---

## Parte 5 — Atualizar o `.env` do backend

```env
CORS_ORIGIN=http://doafacil-site.s3-website-us-east-1.amazonaws.com
AWS_ACCESS_KEY_ID=chave_do_usuario_doafacil-local
AWS_SECRET_ACCESS_KEY=segredo_do_usuario_doafacil-local
JWT_SECRET=gere_com_node_-e_require_crypto_randomBytes64_toString_hex
```

---

## Parte 6 — Rotina de uso (dia da apresentação)

```bash
# 1. No laptop do integrante — inicia o backend
cd doafacil/backend
npm start

# 2. Em outro terminal — inicia o tunnel
cloudflared tunnel run doafacil-api

# 3. Pronto! O site já está acessível em:
#    http://doafacil-site.s3-website-us-east-1.amazonaws.com
```

> O frontend no S3 fica sempre disponível.  
> O backend e o tunnel precisam estar rodando no laptop durante a apresentação.

---

## Ordem dos `<script>` em todos os HTMLs

```html
<!-- 1. jQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<!-- 2. Config — define window.API_BASE_URL -->
<script src="../assets/js/config.js"></script>

<!-- 3. SDK de comunicação com a API -->
<script src="../assets/js/api.js"></script>

<!-- 4. Bootstrap bundle (por último, pois não depende dos anteriores) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>

<!-- 5. Script específico da página (reserva-item.js, gestao-doacoes.js, etc.) -->
<script src="../assets/js/nome-da-pagina.js"></script>
```