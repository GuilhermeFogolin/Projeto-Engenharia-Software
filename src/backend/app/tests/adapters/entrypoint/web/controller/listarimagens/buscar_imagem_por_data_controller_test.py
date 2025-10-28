from unittest import TestCase
from unittest.mock import patch

from flask import Flask

from src.adapters.entrypoint.web.controller.listarimagens.listar_imagens_diarias_controller import (
    listar_imagens_diarias_controller_blueprint,
)


class BuscarImagemPorDataControllerTest(TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(listar_imagens_diarias_controller_blueprint)
        self.client = self.app.test_client()

    @patch(
        "src.adapters.entrypoint.web.controller.listarimagens.listar_imagens_diarias_controller.BuscarImagemDiariaUseCaseImpl"
    )
    def test_buscar_imagem_por_data_success(self, MockUseCase):
        mock_use_case_instance = MockUseCase.return_value
        mock_use_case_instance.execute.return_value = {
            "title": "Imagem",
            "description": "Descrição",
            "href": "https://example.com/img.jpg",
            "date": "2024-01-01",
        }

        response = self.client.get("/api/v1/daily-images/2024-01-01")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["title"], "Imagem")
        mock_use_case_instance.execute.assert_called_once_with("2024-01-01")

    @patch(
        "src.adapters.entrypoint.web.controller.listarimagens.listar_imagens_diarias_controller.BuscarImagemDiariaUseCaseImpl"
    )
    def test_buscar_imagem_por_data_not_found(self, MockUseCase):
        mock_use_case_instance = MockUseCase.return_value
        mock_use_case_instance.execute.return_value = None

        response = self.client.get("/api/v1/daily-images/2024-01-02")

        self.assertEqual(response.status_code, 404)

    def test_buscar_imagem_por_data_invalid_date(self):
        response = self.client.get("/api/v1/daily-images/2024-13-40")

        self.assertEqual(response.status_code, 400)
        self.assertIn("Formato de data inválido", response.json["message"])
