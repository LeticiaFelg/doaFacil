# Arquitetura DoaFacil

Este documento registra as decisoes tecnicas e arquiteturais do projeto. O README deve ficar mais direto, com instalacao, comandos e uso. Este arquivo guarda o "por que" das escolhas.

## Visao Geral

O DoaFacil e dividido em duas partes:

- Frontend estatico: HTML, CSS e JavaScript servidos localmente por `python -m http.server 8000` e, futuramente, publicados em S3.
- Backend separado: API Node.js/Express em `node/src`, servida em `http://localhost:5000`.

O frontend consome a API por `window.API_BASE_URL`, definido em `assets/js/config.js`.

## Banco De Dados Atual

O banco atual e SQLite, salvo em:

```text
node/doafacil.db
```

A escolha por SQLite simplifica o desenvolvimento local e evita configurar um servidor de banco neste momento. O arquivo `.db` nao deve ir para o repositorio.

No futuro, para system tests mais fieis, planejamos rodar o ambiente em container.

## Health E Ready

Conceitualmente:

- `health` responde se a API esta viva.
- `ready` responderia se a API esta pronta para atender usuarios, incluindo banco e dependencias.

Decisao atual: `GET /api/health` verifica tambem a conexao com o banco via Sequelize. Isso foi escolhido porque, neste projeto, a home usa essa chamada para decidir se deve usar dados reais ou fallback. Se o banco nao estiver acessivel, a API nao consegue cumprir os fluxos principais.

Alternativa futura: criar `GET /api/ready` para checar banco e dependencias, mantendo `GET /api/health` apenas para o processo Express.

## Seed Inicial

O seed inicial cria:

- Maria Clara Souza como usuaria demonstrativa.
- 12 itens iniciais da home associados a Maria.
- Receptores demonstrativos para historico.
- Reservas e historicos demonstrativos para itens concluidos/cancelados.

O seed evita duplicacao procurando registros existentes antes de criar novos.

## Papel Das Tabelas

### users

Guarda os usuarios da plataforma, incluindo doadores e receptores. Um usuario pode ter mais de um papel.

### items

Guarda o catalogo de itens e o status atual do item. Exemplos de status:

- `disponivel`
- `reservado`
- `concluido`
- `cancelado`

### reservations

Guarda as reservas feitas por receptores em itens de doadores. Uma reserva aponta para:

- item reservado;
- receptor;
- doador;
- mensagem opcional;
- status da reserva.

### histories

Guarda fatos consolidados do sistema, como doacoes concluidas e cancelamentos relevantes. O historico preserva `item_id`, `donor_id` e `receiver_id` para reconstruir a tela de historico com doador, receptor, data e status.

## Fluxo De Doacao E Reserva

1. Doador cria item.
2. Item nasce como `disponivel`.
3. Receptor reserva item.
4. Reserva nasce como `pendente`.
5. Item passa para `reservado`.
6. Doador pode cancelar a reserva, voltando o item para `disponivel`.
7. Doador pode confirmar entrega, tornando reserva `concluida`.
8. Item passa para `concluido`.
9. Um registro e criado em `histories`.

Cancelamento de item pelo doador e soft delete: o item muda para `cancelado`.

## Fallback Do Frontend

A home tenta consultar a API.

- API/banco disponivel: usa dados reais e preserva sessao real do usuario logado.
- API/banco indisponivel e sem sessao real: ativa fallback visual com Maria Clara.

O fallback da Maria nao deve ser tratado como login real. Paginas protegidas, como perfil, devem redirecionar para login se nao houver sessao real.

## Imagens De Itens

### Implementacao Local Atual

O upload local fica no backend:

```text
node/uploads/items
```

As imagens enviadas pelo modal de nova doacao sao recebidas pela API com `multipart/form-data`, salvas localmente e servidas por:

```text
http://localhost:5000/uploads/items/NOME_DO_ARQUIVO
```

O banco salva a URL relativa, por exemplo:

```text
/uploads/items/arquivo.jpg
```

O frontend transforma essa URL relativa em URL absoluta da API.

Nao usamos `assets/img` para upload em runtime porque essa pasta pertence ao frontend estatico. Quando o front estiver publicado em S3, o navegador nao podera gravar arquivos nessa pasta.

### Preparacao Para S3

O caminho correto para producao e usar S3 com presigned URLs:

1. Frontend seleciona o arquivo.
2. Frontend pede ao backend uma URL assinada.
3. Backend gera a URL assinada no S3.
4. Browser envia o arquivo direto para o bucket.
5. Backend salva no banco a `key` ou URL publica do arquivo.

O codigo futuro para gerar presigned URL esta comentado em `node/src/routes/items.js`. Ele nao esta ativo agora porque depende de AWS SDK, bucket, CORS e credenciais.

## Proximos Pontos Planejados

- Criar container para system tests.
- Implementar testes unitarios.
- Implementar testes de integracao.
- Implementar testes de sistema automatizados.
- Separar `GET /api/health` de `GET /api/ready`, se o projeto exigir uma distincao mais formal.
