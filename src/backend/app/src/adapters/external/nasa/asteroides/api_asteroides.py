import requests
from datetime import date
import os
from dotenv import load_dotenv

load_dotenv()


class ApiAsteroides:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            print("Criando a instância singleton da Api")
            cls._instance = super(ApiAsteroides, cls).__new__(cls)
            # Inicialização pode ser feita aqui
            cls._instance.api_key = os.getenv("NASA_API_KEY")
            cls._instance.base_url = os.getenv("NASA_BASE_URL")
        return cls._instance

    def buscar_por_data(self, data_busca: str):
        """
        Busca asteroides por data usando o endpoint /feed.
        """
        url = f"{self.base_url}/feed"
        params = {
            "start_date": data_busca,
            "end_date": data_busca,
            "api_key": self.api_key,
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()  # Lança uma exceção para respostas de erro (4xx ou 5xx)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao chamar a API da NASA: {e}")
            return None
