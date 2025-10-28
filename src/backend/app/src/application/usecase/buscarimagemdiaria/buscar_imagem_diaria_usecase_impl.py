from datetime import datetime
from typing import Optional, Dict

from src.adapters.external.nasa.images.api_apod import ApiApod
from src.application.services.translation_service import translate_text
from src.application.usecase.buscarimagemdiaria.buscar_imagem_diaria_usecase import (
    BuscarImagemDiariaUseCase,
)


class BuscarImagemDiariaUseCaseImpl(BuscarImagemDiariaUseCase):
    def __init__(self, api_apod: Optional[ApiApod] = None):
        self.api_apod = api_apod or ApiApod()

    def execute(self, date: str) -> Optional[Dict[str, str]]:
        self._validate_date(date)

        image_payload = self.api_apod.get_image_by_date(date)

        if not image_payload:
            return None

        return {
            "title": translate_text(image_payload.get("title", "")),
            "description": translate_text(image_payload.get("description", "")),
            "href": image_payload.get("href"),
            "date": image_payload.get("date"),
            "credits": image_payload.get("credits"),
        }

    @staticmethod
    def _validate_date(date: str) -> None:
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError("Formato de data inválido. Utilize YYYY-MM-DD.") from exc
