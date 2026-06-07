# Funcionalidades do DoaFacil

## Descrição do projeto

O DoaFacil e uma plataforma digital de redistribuição de bens materiais. O projeto conecta pessoas que possuem itens em bom estado a outras pessoas que precisam desses itens, facilitando doações, reservas, contato entre usuários e acompanhamento do histórico.

A proposta e tornar o processo de doação mais simples, organizado e acessível, fortalecendo a solidariedade local, o reaproveitamento de recursos e a economia circular.

## Sobre o DoaFacil

O DoaFacil nasceu para simplificar a solidariedade, conectando pessoas que possuem itens em bom estado a quem realmente precisa.

A plataforma fortalece a economia circular, incentiva o reaproveitamento e ajuda doadores e receptores a combinarem doações de forma mais organizada.

Principais valores do projeto:

1. Doação segura.
2. Impacto local.
3. Reuso consciente.
4. Comunidade ativa.

## Cadastro e login

O usuário pode criar uma conta informando seus dados pessoais basicos, como nome, e-mail, telefone, CPF, bairro e senha.

Depois de criada a conta, o usuário pode fazer login com e-mail e senha. Ao entrar, o sistema mantém a sessão ativa por meio de um token de autenticação, permitindo acessar áreas protegidas, como perfil, histórico, criação de doações e reservas.

## Recuperação de senha

O usuário pode solicitar a recuperação de senha pelo link "Esqueceu a senha?", na tela de login.

Nesse fluxo, o sistema recebe o e-mail informado e, se houver uma conta cadastrada, gera um link temporário de redefinição. Esse link possui validade limitada e permite que o usuário defina uma nova senha com segurança.

## Visualização de itens disponíveis

Na página inicial, o usuário pode visualizar os itens cadastrados para doação.

Cada card mostra informações resumidas do item, como nome, categoria, estado de conservação, localização, descrição curta e imagem. A partir da home, o usuário pode acessar a página de detalhes de cada item.

## Filtros e busca

O usuário pode filtrar os itens por categoria, como moveis, eletro, roupas, calcados, utensílios, escolar, brinquedos e outros.

A home também possui campo de busca e ordenação, ajudando o usuário a encontrar itens específicos com mais facilidade.

## Página de detalhes do item

Ao clicar em um item, o usuário acessa uma página com informações mais completas, incluindo descrição, categoria, condição, localização, especificações e dados do doador.

Essa página também centraliza as ações principais relacionadas ao item, como reservar, entrar em contato ou editar, dependendo do usuário logado.

## Criação de doação

Um usuário logado pode cadastrar um novo item para doação.

O cadastro permite informar nome, categoria, fotos, descrição, condição, dimensões, material, cor, forma de retirada e endereço. Depois de cadastrado, o item passa a aparecer no sistema conforme seu status.

## Edição de item

O usuário doador pode editar as informações dos itens que cadastrou.

Essa funcionalidade permite corrigir dados, atualizar descrição, trocar detalhes do item e manter as informações mais precisas para os interessados.

## Cancelamento de item

O usuário doador pode cancelar um item doado quando ele não estiver mais disponível.

O cancelamento funciona como uma exclusão logica: o item deixa de estar disponível para novas reservas, mas seu registro pode continuar existindo para manter o histórico da plataforma.

## Reserva de item

Um usuário logado pode reservar um item disponível.

Ao reservar, o usuário pode enviar uma mensagem ao doador. O status do item passa a refletir a reserva, evitando que outras pessoas reservem o mesmo item ao mesmo tempo.

## Cancelamento de reserva

Quando uma reserva ainda não foi concluída, ela pode ser cancelada.

Ao cancelar uma reserva, o item pode voltar a ficar disponível, permitindo que outra pessoa demonstre interesse nele.

## Confirmação de entrega

O doador pode confirmar que a entrega do item foi concluída.

Essa ação muda o status da reserva e do item para concluído, registrando que a doação foi finalizada com sucesso.

## Histórico

A página de histórico permite acompanhar doações feitas e itens recebidos.

Nela, o usuário consegue visualizar status, datas, categorias, receptores, doadores e ações disponíveis para cada item ou reserva. O histórico ajuda a manter rastreabilidade das interações realizadas na plataforma.

## Perfil do usuário

A página de perfil exibe os dados do usuário, suas doações ativas e os itens recebidos recentemente.

O usuário também pode editar suas informações pessoais, sair da conta ou apagar sua conta.

## Contato com o doador

Na página de detalhes do item, o usuário pode iniciar contato com o doador para combinar a retirada.

O sistema pode gerar um link de contato via WhatsApp sem expor diretamente o telefone do doador nas consultas públicas do item.

## Menu de informações

O menu hamburguer oferece acesso a informações institucionais do projeto, incluindo Sobre, FAQ e Contato.

Essas seções ajudam o usuário a entender melhor a proposta da plataforma, tirar dúvidas frequentes e encontrar canais de contato.
