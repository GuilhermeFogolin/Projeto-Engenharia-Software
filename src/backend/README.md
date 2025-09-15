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

-----------
Arquitetura e Padrões de Projeto
Este documento descreve os principais padrões de projeto (Design Patterns) utilizados na arquitetura da API, com o objetivo de garantir um código desacoplado, flexível e de fácil manutenção.

1. Padrão Strategy (Estratégia)
O padrão Strategy permite definir uma família de algoritmos, encapsular cada um deles e torná-los intercambiáveis. Essencialmente, ele permite que o algoritmo varie independentemente dos clientes que o utilizam.

Implementação no Projeto:

Interface da Estratégia (Strategy): A classe abstrata ListarAsteroidesUseCase em listar_asteroides_usecase.py define o contrato para a operação, através do método execute(data: str).
Estratégia Concreta (Concrete Strategy): A classe ListarAsteroidesUseCaseImpl em listar_asteroides_usecase_impl.py é a implementação real da lógica de negócio para buscar e processar os dados dos asteroides.
Contexto (Context): O listar_asteroides_controller em listar_asteroides_controller.py atua como o cliente. Ele utiliza uma instância da estratégia (ListarAsteroidesUseCaseImpl) para executar a ação, sem conhecer os detalhes da sua implementação.
Benefício: Essa abordagem desacopla a camada de entrada da aplicação (controller) da lógica de negócio (use case). Se no futuro precisarmos de uma nova forma de listar asteroides, podemos criar outra implementação de ListarAsteroidesUseCase sem precisar alterar o controller.

2. Padrão Singleton
O padrão Singleton garante que uma classe tenha apenas uma única instância e fornece um ponto de acesso global a essa instância.

Implementação no Projeto:

A classe ApiAsteroides em api_asteroides.py foi implementada como um Singleton.
Ela gerencia sua própria instância através da variável de classe _instance e do método __new__. Na primeira vez que ApiAsteroides() é chamada, uma nova instância é criada e armazenada. Em todas as chamadas subsequentes, a instância já existente é retornada.
Benefício: Este padrão é ideal para gerenciar o acesso a recursos compartilhados, como a conexão com a API externa da NASA. Ele evita a criação de múltiplos objetos de conexão, economizando recursos de sistema e garantindo um ponto de acesso único e consistente para as chamadas externas.

3. Padrão Adapter (Adaptador)
O padrão Adapter atua como uma ponte entre duas interfaces incompatíveis. Ele converte a interface de uma classe em outra interface que o cliente espera, permitindo que classes com interfaces diferentes trabalhem juntas.

Implementação no Projeto:

A classe ApiAsteroides também funciona como um Adapter. Ela "traduz" as complexidades de uma chamada HTTP (usando a biblioteca requests) para um método simples e específico do nosso domínio, como buscar_por_data(data_busca: str).
O ListarAsteroidesUseCaseImpl (nosso cliente interno) não precisa saber como fazer uma requisição GET, montar parâmetros de URL ou tratar exceções de HTTP. Ele simplesmente chama o método buscar_por_data do adaptador.
Benefício: O Adapter isola a lógica de negócio das particularidades de uma biblioteca ou serviço externo. Se um dia a API da NASA mudar ou decidirmos usar outra biblioteca em vez de requests, precisaremos modificar apenas o ApiAsteroides (o Adapter), sem impactar o resto da aplicação.

>>>>>>> Stashed changes
