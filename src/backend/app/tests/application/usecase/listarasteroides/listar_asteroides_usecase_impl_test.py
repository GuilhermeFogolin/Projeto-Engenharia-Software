from unittest.mock import Mock, patch

from src.application.usecase.listarasteroides.listar_asteroides_usecase_impl import (
    ListarAsteroidesUseCaseImpl,
)
from src.domain.entities.asteroide import Asteroide


class TestListarAsteroidesUseCaseImpl:

    def setup_method(self):
        self.use_case = ListarAsteroidesUseCaseImpl()

    @patch(
        "src.application.usecase.listarasteroides.listar_asteroides_usecase_impl.ApiAsteroides"
    )
    def test_execute_com_dados_validos_retorna_lista_asteroides(self, mock_api_class):
        # Arrange
        mock_api_instance = Mock()
        mock_api_class.return_value = mock_api_instance

        dados_mock = {
            "near_earth_objects": {
                "2024-01-01": [
                    {
                        "id": "123456",
                        "neo_reference_id": "neo123",
                        "name": "Asteroide Teste",
                        "nasa_jpl_url": "https://test.com",
                        "absolute_magnitude_h": 20.5,
                        "estimated_diameter": {
                            "kilometers": {"estimated_diameter_min": 0.1}
                        },
                        "is_potentially_hazardous_asteroid": False,
                        "close_approach_data": [],
                        "is_sentry_object": False,
                        "links": {},
                    }
                ]
            }
        }

        mock_api_instance.buscar_por_data.return_value = dados_mock

        # Act
        resultado = self.use_case.execute("2024-01-01")

        # Assert
        assert len(resultado.asteroides) == 1
        assert isinstance(resultado.asteroides[0], Asteroide)
        assert resultado.asteroides[0].id == "123456"
        assert resultado.asteroides[0].nome == "Asteroide Teste"
        mock_api_instance.buscar_por_data.assert_called_once_with(
            data_busca="2024-01-01"
        )

    @patch(
        "src.application.usecase.listarasteroides.listar_asteroides_usecase_impl.ApiAsteroides"
    )
    def test_execute_com_api_retornando_none_retorna_lista_vazia(self, mock_api_class):
        # Arrange
        mock_api_instance = Mock()
        mock_api_class.return_value = mock_api_instance
        mock_api_instance.buscar_por_data.return_value = None

        # Act
        resultado = self.use_case.execute("2024-01-01")

        # Assert
        assert resultado.asteroides == []

    @patch(
        "src.application.usecase.listarasteroides.listar_asteroides_usecase_impl.ApiAsteroides"
    )
    def test_execute_com_dados_sem_near_earth_objects_retorna_lista_vazia(
        self, mock_api_class
    ):
        # Arrange
        mock_api_instance = Mock()
        mock_api_class.return_value = mock_api_instance
        mock_api_instance.buscar_por_data.return_value = {"other_key": "value"}

        # Act
        resultado = self.use_case.execute("2024-01-01")

        assert resultado.asteroides == []
