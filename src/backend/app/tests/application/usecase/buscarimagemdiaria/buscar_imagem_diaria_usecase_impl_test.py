from unittest import TestCase
from unittest.mock import Mock, patch

from src.application.usecase.buscarimagemdiaria.buscar_imagem_diaria_usecase_impl import (
    BuscarImagemDiariaUseCaseImpl,
)


class BuscarImagemDiariaUseCaseImplTest(TestCase):
    def test_execute_returns_translated_payload_when_image_exists(self):
        with patch(
            "src.application.usecase.buscarimagemdiaria.buscar_imagem_diaria_usecase_impl.ApiApod"
        ) as MockApiApod, patch(
            "src.application.usecase.buscarimagemdiaria.buscar_imagem_diaria_usecase_impl.translate_text",
            side_effect=lambda text, target_language="pt": text,
        ) as mock_translate:
            mock_api_instance = Mock()
            MockApiApod.return_value = mock_api_instance
            mock_api_instance.get_image_by_date.return_value = {
                "title": "Sample Title",
                "description": "Sample Description",
                "href": "https://example.com/image.jpg",
                "date": "2024-01-01",
                "credits": "NASA",
            }

            use_case = BuscarImagemDiariaUseCaseImpl()
            result = use_case.execute("2024-01-01")

            self.assertIsNotNone(result)
            self.assertEqual(result["title"], "Sample Title")
            self.assertEqual(result["href"], "https://example.com/image.jpg")
            mock_translate.assert_any_call("Sample Title")
            mock_translate.assert_any_call("Sample Description")

    def test_execute_returns_none_when_image_not_found(self):
        with patch(
            "src.application.usecase.buscarimagemdiaria.buscar_imagem_diaria_usecase_impl.ApiApod"
        ) as MockApiApod:
            mock_api_instance = Mock()
            MockApiApod.return_value = mock_api_instance
            mock_api_instance.get_image_by_date.return_value = None

            use_case = BuscarImagemDiariaUseCaseImpl()
            result = use_case.execute("2024-01-01")

            self.assertIsNone(result)

    def test_execute_raises_value_error_for_invalid_date(self):
        use_case = BuscarImagemDiariaUseCaseImpl(api_apod=Mock())

        with self.assertRaises(ValueError):
            use_case.execute("2024/01/01")
