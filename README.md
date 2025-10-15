# Projeto Lucy - Engenharia de Software

Este projeto é uma aplicação web que consome a API da NASA para visualizar dados sobre asteroides próximos à Terra. O frontend é construído com React e o backend com Python e Flask.

## ✨ Funcionalidades

*   Listagem de asteroides com base em um período de datas.
*   Visualização de detalhes de cada asteroide.
*   Gráficos interativos para análise dos dados (utilizando Recharts).
*   Interface amigável e responsiva.

## 🚀 Tecnologias Utilizadas

### Frontend
*   [React](https://reactjs.org/)
*   [Vite](https://vitejs.dev/)
*   [Recharts](https://recharts.org/) para visualização de dados
*   [ESLint](https://eslint.org/) para linting de código

### Backend
*   [Python](https://www.python.org/)
*   [Flask](https://flask.palletsprojects.com/)
*   [Pandas](https://pandas.pydata.org/) para manipulação de dados
*   [Pytest](https://pytest.org/) para testes unitários
*   [Flask-CORS](https://flask-cors.readthedocs.io/) para lidar com Cross-Origin Resource Sharing

## 📂 Estrutura do Projeto

O projeto é organizado em duas partes principais: `frontend` e `backend`.

```
/
├── src/
│   ├── frontend/      # Contém todos os arquivos do React
│   └── backend/       # Contém a aplicação Flask em Python
│       ├── app/         # Código fonte da aplicação
│       └── tests/       # Testes unitários
├── public/            # Arquivos estáticos para o frontend
├── package.json       # Dependências e scripts do frontend
└── README.md          # Este arquivo
```

## 🏁 Como Começar

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [Python](https://www.python.org/downloads/) (versão 3.9 ou superior)
*   `pip` (gerenciador de pacotes do Python)

### 🔑 Chave da API da NASA

1.  Acesse o site [NASA Open APIs](https://api.nasa.gov/).
2.  Gere sua chave de API (API Key).
3.  No diretório `src/backend`, crie um arquivo chamado `.env`.
4.  Adicione sua chave de API ao arquivo `.env` da seguinte forma:

    ```
    NASA_API_KEY=SUA_CHAVE_API_AQUI
    ```

### Instalação e Execução

Clone o repositório e siga os passos abaixo:

1.  **Configurar o Backend (Python)**

    ```bash
    # Navegue até a pasta do backend
    cd src/backend

    # Crie um ambiente virtual (recomendado)
    python -m venv venv
    source venv/bin/activate  # No Windows, use `venv\Scripts\activate`

    # Instale as dependências
    pip install -r requirements.txt

    # Inicie o servidor Flask
    flask run
    ```
    O servidor backend estará rodando em `http://127.0.0.1:5000`.

2.  **Configurar o Frontend (React)**

    Em um **novo terminal**, navegue até a raiz do projeto e execute:

    ```bash
    # Instale as dependências do Node.js
    npm install

    # Inicie o servidor de desenvolvimento do Vite
    npm run dev
    ```
    A aplicação frontend estará acessível em `http://localhost:5173` (ou outra porta, se a 5173 estiver em uso).

## 🧪 Rodando os Testes

Para executar os testes unitários do backend, navegue até a pasta `src/backend` e execute o Pytest:

```bash
cd src/backend
pytest
```

## 👥 Contribuidores

*   **Guilherme Fogolin** - [GitHub](https://github.com/GuilhermeFogolin)
*   **Pedro Lemos** - [GitHub](https://github.com/pedrolemos4)

---
Feito com ❤️ para o projeto de Engenharia de Software.
.