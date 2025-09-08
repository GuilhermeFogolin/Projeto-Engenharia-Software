Nós estamos utilizando o SOLID para o nosso projeto, decidimos utilizar primeiramente o princípio de responsabilidade única, a primeira letra de SOLID o ’S’.

Nós dividimos dessa forma:

Controller (listar_asteroides_controller.py): A única responsabilidade dele é lidar com a requisição HTTP. Ele recebe a chamada na rota /asteroides, delega a tarefa para o caso de uso e transforma a resposta em JSON. Ele não sabe como os asteroides são obtidos.

Use Case (listar_asteroides_usecase_impl.py): A única responsabilidade dele é orquestrar a lógica de negócio para buscar os asteroides. Atualmente, ele retorna dados fixos, mas no futuro, ele irá conter a lógica para chamar a API da NASA. Ele não se preocupa com HTTP, rotas ou JSON.

No domain (asteroide.py): É feito o mapeamento da entidade Asteroide, que é o que é retornado contendo todas as informações processadas necessárias.

Aplicação (app.py): A única responsabilidade dele é configurar e iniciar o servidor Flask, registrando as rotas (Blueprints) que a aplicação conhece.

Essa separação é a essência do SRP: cada classe ou módulo tem um, e apenas um, motivo para mudar.

Se você precisar mudar a rota de /asteroides para /nasa/asteroides, você só mexe no Controller.
Se a NASA mudar a forma de fornecer os dados e você precisar alterar a lógica de busca, você só mexe no Use Case.
Se você quiser adicionar uma nova rota para "listar planetas", você criaria um novo controller e um novo use case, e apenas registraria o novo Blueprint no app.py.
