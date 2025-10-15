from unittest.mock import patch, Mock

from src.app import app
from src.domain.entities.asteroide import Asteroide


class TestListarAsteroidesController:

    def setup_method(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch(
        "src.adapters.entrypoint.web.controller.listarasteroides.listar_asteroides_controller.ListarAsteroidesUseCaseImpl"
    )
    def test_listar_asteroides_com_sucesso(self, mock_usecase_class):
        # Arrange
        mock_usecase_instance = Mock()
        mock_usecase_class.return_value = mock_usecase_instance

        asteroide_mock = Asteroide(
            id="123456",
            id_referencia_neo="neo123",
            nome="Asteroide Teste",
            url_nasa_jpl="https://test.com",
            magnitude_absoluta_h=20.5,
            diametro_estimado={"kilometers": {"estimated_diameter_min": 0.1}},
            e_potencialmente_perigoso=False,
            dados_aproximacao=[],
            e_objeto_sentinela=False,
            links={},
        )

        mock_usecase_instance.execute.return_value = [asteroide_mock]

        # Act
        response = self.app.get("/asteroides/2024-01-01")

        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert "asteroides" in data
        assert len(data["asteroides"]) == 1
        assert data["asteroides"][0]["id"] == "123456"
        assert data["asteroides"][0]["nome"] == "Asteroide Teste"
        mock_usecase_instance.execute.assert_called_once_with(data="2024-01-01")

    @patch(
        "src.adapters.entrypoint.web.controller.listarasteroides.listar_asteroides_controller.ListarAsteroidesUseCaseImpl"
    )
    def test_listar_asteroides_lista_vazia(self, mock_usecase_class):
        # Arrange
        mock_usecase_instance = Mock()
        mock_usecase_class.return_value = mock_usecase_instance
        mock_usecase_instance.execute.return_value = []

        # Act
        response = self.app.get("/asteroides/2024-01-01")

        # Assert
        assert response.status_code == 200
        data = response.get_json()
        assert "asteroides" in data
        assert len(data["asteroides"]) == 0
