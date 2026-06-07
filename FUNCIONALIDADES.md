# Funcionalidades do DoaFacil

Este documento descreve o que o DoaFacil oferece para o usuario final. Ele nao substitui a documentacao tecnica; a ideia aqui e explicar a experiencia, os fluxos e os recursos da plataforma.

## Descricao Do Projeto

O DoaFacil e uma plataforma digital de redistribuicao de bens materiais. O projeto conecta pessoas que possuem itens em bom estado a outras pessoas que precisam desses itens, facilitando doacoes, reservas, contato entre usuarios e acompanhamento de historico.

A proposta e tornar o processo de doacao mais simples, organizado e acessivel, fortalecendo a solidariedade local, o reaproveitamento de recursos e a economia circular.

## Sobre O DoaFacil

O DoaFacil nasceu para simplificar a solidariedade, conectando pessoas que possuem itens em bom estado a quem realmente precisa.

A plataforma fortalece a economia circular, incentiva o reaproveitamento e ajuda doadores e receptores a combinarem doacoes de forma mais organizada.

Principais valores:

1. Doacao segura.
2. Impacto local.
3. Reuso consciente.
4. Comunidade ativa.

## Cadastro E Login

O usuario pode criar uma conta informando dados basicos:

- nome;
- e-mail;
- telefone;
- CPF;
- bairro;
- senha.

Depois do cadastro, o usuario pode fazer login com e-mail e senha. A sessao e mantida por token JWT, permitindo acessar areas protegidas, como perfil, historico, criacao de doacoes, edicao de itens, reservas e contato com doadores.

Ao criar uma conta, o sistema exibe uma mensagem de sucesso e direciona o usuario para o login.

## Recuperacao De Senha

O usuario pode solicitar recuperacao pelo link "Esqueceu a senha?", na tela de login.

O fluxo funciona assim:

1. O usuario informa o e-mail.
2. A tela mostra uma mensagem neutra dizendo que, se o e-mail estiver cadastrado, as instrucoes serao enviadas.
3. O sistema gera um link temporario de redefinicao.
4. O usuario abre o link e acessa a pagina "Redefina sua senha".
5. O usuario informa e confirma a nova senha.
6. A senha e atualizada e o usuario volta para a tela de login.

A mensagem neutra protege a privacidade, pois nao revela se o e-mail informado existe ou nao no sistema.

## Home E Feed De Itens

Na home, o usuario visualiza os itens cadastrados para doacao.

Cada card mostra:

- imagem;
- nome do item;
- categoria;
- estado de conservacao;
- descricao curta;
- localizacao;
- destaque de doador recorrente, quando aplicavel.

Ao clicar em um card, o usuario acessa a pagina de detalhes daquele item.

## Categorias, Busca E Ordenacao

A home permite filtrar itens por categoria:

- moveis;
- eletro;
- roupas;
- calcados;
- utensilios;
- escolar;
- brinquedos;
- outros.

Tambem existe busca por texto e ordenacao visual para ajudar o usuario a encontrar itens com mais facilidade.

## Destaques Da Semana

A home exibe uma area de destaques, usando itens carregados da API. Essa area ajuda a dar visibilidade para itens recentes ou relevantes.

## Pagina Do Item

A pagina do item mostra informacoes completas:

- titulo;
- imagens;
- categoria;
- condicao;
- status;
- localizacao;
- descricao;
- dimensoes;
- material;
- cor;
- forma de retirada;
- dados basicos do doador.

Se o usuario logado nao for o doador, ele pode reservar o item quando estiver disponivel.

Se o usuario logado for o doador, o botao principal muda para edicao do item, evitando que alguem reserve o proprio item.

## Criacao De Doacao

Um usuario logado pode cadastrar um novo item para doacao pelo botao "Doar" da navbar ou pela area de doacoes ativas no perfil.

O formulario permite informar:

- nome do item;
- categoria;
- fotos;
- descricao;
- condicao;
- dimensoes;
- material;
- cor;
- forma de retirada;
- endereco/localizacao.

O item nasce com status `disponivel`.

## Upload De Fotos

O modal de criacao e edicao aceita imagens do computador do usuario.

No ambiente local, as imagens sao salvas pelo backend na pasta:

```text
node/uploads/items
```

O sistema permite ate 3 imagens por item, com limite de tamanho por arquivo.

## Edicao De Item

O doador pode editar itens que ele mesmo cadastrou.

A edicao usa um modal semelhante ao de criacao e permite atualizar informacoes como nome, categoria, fotos, descricao, condicao, dimensoes, material, cor, retirada e endereco.

## Cancelamento De Item

O doador pode cancelar um item quando ele nao estiver mais disponivel.

Esse cancelamento funciona como exclusao logica: o item muda para status `cancelado`, preservando rastreabilidade para historico e consulta interna.

## Reserva De Item

Um usuario logado pode reservar um item disponivel.

Ao reservar, o usuario pode enviar uma mensagem opcional ao doador. Depois da reserva:

- a reserva fica como `pendente`;
- o item passa para `reservado`;
- outras pessoas nao conseguem reservar o mesmo item ao mesmo tempo.

## Contato Com O Doador

Na pagina do item, o usuario pode iniciar contato via WhatsApp.

O telefone do doador nao aparece nas consultas publicas. A API gera o link de contato quando o usuario logado solicita essa acao.

## Cancelamento De Reserva

Uma reserva ainda nao concluida pode ser cancelada.

Quando uma reserva e cancelada, o item pode voltar ao status `disponivel`, permitindo que outra pessoa manifeste interesse.

## Confirmacao De Entrega

O doador pode confirmar que a entrega foi concluida.

Quando isso acontece:

- a reserva passa para `concluida`;
- o item passa para `concluido`;
- um registro pode ser criado no historico.

## Perfil Do Usuario

A pagina de perfil mostra:

- dados do usuario;
- estatisticas de doacoes e recebimentos;
- doacoes ativas;
- itens recebidos recentemente;
- botao para editar perfil;
- botao para sair;
- opcao de apagar conta.

## Historico

A pagina de historico permite acompanhar:

- doacoes feitas;
- itens recebidos;
- receptor ou doador relacionado;
- categoria;
- data;
- status;
- acoes disponiveis, como cancelar ou concluir.

A tela possui busca, filtro por status e ordenacao.

## Menu De Informacoes

O menu hamburguer abre modais informativos:

- Sobre;
- FAQ;
- Contato.

Essas secoes explicam a proposta do projeto, respondem duvidas frequentes e exibem canais de contato.

## Recurso Demonstrativo

Ao iniciar o backend, o seed cria dados demonstrativos, incluindo Maria Clara Souza, itens iniciais, reservas e historicos. Isso permite testar a plataforma com conteudo realista sem precisar cadastrar tudo manualmente.

## Recursos Planejados

Pontos planejados para evolucao:

- container para testes de sistema;
- testes unitarios, de integracao e de sistema automatizados;
- deploy estatico do frontend em S3;
- upload de imagens em S3 por presigned URL;
- separacao formal entre health check e readiness check;
- melhoria do conteudo final do FAQ.
