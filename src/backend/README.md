# 🚀 Projeto Cosmic - Backend 

API RESTful para consulta e análise de dados de asteroides próximos à Terra, utilizando dados da NASA NeoWs API.

## 📋 Sobre o Projeto

O Projeto Cosmic é uma aplicação web que permite visualizar e analisar dados de asteroides próximos à Terra. O backend fornece endpoints para buscar informações detalhadas sobre asteroides, incluindo:

- Dados de aproximação à Terra
- Características físicas (tamanho, velocidade)
- Classificação de risco potencial
- Informações orbitais

## 🏗️ Arquitetura

O projeto segue os princípios da **Arquitetura Limpa + Hexagonal(Screaming Architecture)**, organizando o código em camadas bem definidas:

```
src/
├── adapters/
│   ├── entrypoint/web/controller/    # Controladores HTTP (Flask)
│   └── external/nasa/               # Integração com APIs externas
├── application/
│   └── usecase/                     # Casos de uso da aplicação
└── domain/
    └── entities/                    # Entidades de domínio
```

### Padrões Utilizados

- **Clean Architecture**: Separação clara de responsabilidades
- **Singleton Pattern**: Gerenciamento de instância única da API NASA
- **Dependency Injection**: Facilita testes e manutenibilidade

## 🛠️ Tecnologias

- **Python 3.13**
- **Flask**: Framework web minimalista
- **Flask-CORS**: Suporte a Cross-Origin Resource Sharing
- **Requests**: Cliente HTTP para APIs externas
- **Pandas**: Manipulação e análise de dados
- **Pytest**: Framework de testes
- **Python-dotenv**: Gerenciamento de variáveis de ambiente

## 🚀 Configuração e Instalação

### Pré-requisitos

- Python 3.13+
- pip (gerenciador de pacotes Python)
- Chave de API da NASA ([obtenha aqui](https://api.nasa.gov/))

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd projeto-lucy-eng-software/src/backend
   ```

2. **Crie um ambiente virtual**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do backend:
   ```env
   NASA_API_KEY=sua_chave_da_nasa_aqui
   NASA_BASE_URL=https://api.nasa.gov/neo/rest/v1
   ```

5. **Execute a aplicação**
   ```bash
   cd app/src
   python app.py
   ```

   A API estará disponível em `http://localhost:8080`

## 📡 Endpoints da API

### Listar Asteroides por Data

```http
GET /asteroides/{data}
```

**Parâmetros:**
- `data` (string): Data no formato YYYY-MM-DD

**Exemplo de Requisição:**
```bash
curl http://localhost:8080/asteroides/2024-01-15
```

**Exemplo de Resposta:**
```json
{
  "asteroides": [
    {
      "id": "2024001",
      "nome": "2024 AA",
      "e_potencialmente_perigoso": false,
      "diametro_estimado": {
        "metros": {
          "estimated_diameter_min": 100.5,
          "estimated_diameter_max": 225.8
        }
      },
      "dados_aproximacao": [
        {
          "data_aproximacao": "2024-01-15",
          "velocidade_relativa": {
            "quilometros_por_hora": "45672.3"
          },
          "distancia_perdida": {
            "quilometros": "7480520.8"
          }
        }
      ]
    }
  ]
}
```

## 🧪 Testes

O projeto possui uma cobertura abrangente de testes unitários utilizando **pytest**.

### Executar todos os testes

```bash
cd app
pytest
```

### Executar testes com cobertura

```bash
pytest --cov=src --cov-report=html
```

### Executar testes específicos

```bash
# Testes de uma classe específica
pytest tests/domain/asteroide_test.py

# Testes de um método específico
pytest tests/adapters/external/nasa/asteroides/api_asteroides_test.py::TestApiAsteroides::test_buscar_por_data_com_sucesso
```

### Estrutura de Testes

```
tests/
├── adapters/
│   ├── entrypoint/web/controller/   # Testes dos controladores
│   └── external/nasa/               # Testes de integração externa
├── application/usecase/             # Testes dos casos de uso
└── domain/                          # Testes das entidades
```

## 🔧 Desenvolvimento

### Estrutura de Pastas

```
app/
├── src/                             # Código fonte
│   ├── adapters/                    # Adaptadores (I/O)
│   ├── application/                 # Casos de uso
│   ├── domain/                      # Regras de negócio
│   └── app.py                       # Ponto de entrada
└── tests/                           # Testes unitários
```

### Adicionando Novos Endpoints

1. Crie o caso de uso em `application/usecase/`
2. Implemente o controlador em `adapters/entrypoint/web/controller/`
3. Registre o blueprint em `app.py`
4. Adicione testes correspondentes

### Integração com Novas APIs

1. Crie o adaptador em `adapters/external/`
2. Implemente o padrão Singleton se necessário
3. Adicione testes de integração

## 🌟 Funcionalidades

- ✅ Consulta de asteroides por data
- ✅ Tradução de campos da API NASA para português
- ✅ Tratamento robusto de erros
- ✅ Padrão Singleton para gerenciamento de API
- ✅ Arquitetura limpa e testável
- ✅ Cobertura completa de testes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- Siga as convenções PEP 8
- Mantenha cobertura de testes acima de 80%
- Documente novas funcionalidades
- Use type hints quando possível

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões sobre o backend, entre em contato através dos issues do GitHub.

---

🌌 **Projeto Lucy** - Explorando o cosmos através dos dados