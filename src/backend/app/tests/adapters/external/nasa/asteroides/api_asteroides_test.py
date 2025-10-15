import unittest
from unittest.mock import patch, Mock, MagicMock
import requests

from src.adapters.external.nasa.asteroides.api_asteroides import ApiAsteroides


class TestApiAsteroides(unittest.TestCase):

    def setUp(self):
        # Reset do singleton para cada teste
        ApiAsteroides._instance = None

    def tearDown(self):
        # Cleanup após cada teste
        ApiAsteroides._instance = None

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    def test_singleton_pattern_retorna_mesma_instancia(self):
        # Act
        instancia1 = ApiAsteroides()
        instancia2 = ApiAsteroides()

        # Assert
        assert instancia1 is instancia2
        assert id(instancia1) == id(instancia2)

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    @patch("builtins.print")
    def test_singleton_print_criacao_instancia_apenas_uma_vez(self, mock_print):
        # Act
        ApiAsteroides()
        ApiAsteroides()

        # Assert
        mock_print.assert_called_once_with("Criando a instância singleton da Api")

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_key_123", "NASA_BASE_URL": "https://test.nasa.gov"},
    )
    def test_inicializacao_carrega_variaveis_ambiente(self):
        # Act
        api = ApiAsteroides()

        # Assert
        assert api.api_key == "test_key_123"
        assert api.base_url == "https://test.nasa.gov"

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    @patch("requests.get")
    def test_buscar_por_data_com_sucesso(self, mock_get):
        # Arrange
        mock_response = Mock()
        mock_response.json.return_value = {
            "near_earth_objects": {
                "2024-01-01": [{"id": "123456", "name": "Asteroide Teste"}]
            }
        }
        mock_get.return_value = mock_response

        api = ApiAsteroides()

        # Act
        resultado = api.buscar_por_data("2024-01-01")

        # Assert
        mock_get.assert_called_once_with(
            "https://api.nasa.gov/feed",
            params={
                "start_date": "2024-01-01",
                "end_date": "2024-01-01",
                "api_key": "test_api_key",
            },
        )
        mock_response.raise_for_status.assert_called_once()
        assert resultado == {
            "near_earth_objects": {
                "2024-01-01": [{"id": "123456", "name": "Asteroide Teste"}]
            }
        }

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    @patch("requests.get")
    def test_buscar_por_data_com_erro_http_retorna_none(self, mock_get):
        # Arrange
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(
            "404 Client Error"
        )
        mock_get.return_value = mock_response

        api = ApiAsteroides()

        # Act
        with patch("builtins.print") as mock_print:
            resultado = api.buscar_por_data("2024-01-01")

        # Assert
        assert resultado is None
        mock_print.assert_called_once_with(
            "Erro ao chamar a API da NASA: 404 Client Error"
        )

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    @patch("requests.get")
    def test_buscar_por_data_com_erro_conexao_retorna_none(self, mock_get):
        # Arrange
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection failed")

        api = ApiAsteroides()

        # Act
        with patch("builtins.print") as mock_print:
            resultado = api.buscar_por_data("2024-01-01")

        # Assert
        assert resultado is None
        mock_print.assert_called_once_with(
            "Erro ao chamar a API da NASA: Connection failed"
        )

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    @patch("requests.get")
    def test_buscar_por_data_com_timeout_retorna_none(self, mock_get):
        # Arrange
        mock_get.side_effect = requests.exceptions.Timeout("Request timeout")

        api = ApiAsteroides()

        # Act
        with patch("builtins.print") as mock_print:
            resultado = api.buscar_por_data("2024-01-01")

        # Assert
        assert resultado is None
        mock_print.assert_called_once_with(
            "Erro ao chamar a API da NASA: Request timeout"
        )

    @patch.dict(
        "os.environ",
        {"NASA_API_KEY": "test_api_key", "NASA_BASE_URL": "https://api.nasa.gov"},
    )
    @patch("requests.get")
    def test_buscar_por_data_parametros_corretos(self, mock_get):
        # Arrange
        mock_response = Mock()
        mock_response.json.return_value = {"data": "test"}
        mock_get.return_value = mock_response

        api = ApiAsteroides()

        # Act
        api.buscar_por_data("2024-12-25")

        # Assert
        esperado_params = {
            "start_date": "2024-12-25",
            "end_date": "2024-12-25",
            "api_key": "test_api_key",
        }
        mock_get.assert_called_once_with(
            "https://api.nasa.gov/feed", params=esperado_params
        )

    @patch("os.getenv")
    def test_inicializacao_sem_variaveis_ambiente(self, mock_getenv):
        # Arrange
        mock_getenv.return_value = None

        # Act
        api = ApiAsteroides()

        # Assert
        assert api.api_key is None
        assert api.base_url is None
        mock_getenv.assert_any_call("NASA_API_KEY")
        mock_getenv.assert_any_call("NASA_BASE_URL")
