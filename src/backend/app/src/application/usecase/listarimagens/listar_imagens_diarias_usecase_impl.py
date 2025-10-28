from src.application.usecase.listarimagens.listar_imagens_diarias_usecase import ListarImagensDiariasUseCase
from src.adapters.external.nasa.images.api_apod import ApiApod
from src.application.services.translation_service import translate_text
from typing import List, Dict

class ListarImagensDiariasUseCaseImpl(ListarImagensDiariasUseCase):
    def __init__(self):
        self.api_apod = ApiApod()

    def execute(self) -> List[Dict]:
        images = self.api_apod.get_random_images(count=6)
        
        if not images:
            return []

        # Translate the content of the images
        translated_images = []
        for image in images:
            translated_images.append({
                "title": translate_text(image.get("title", "")),
                "description": translate_text(image.get("description", "")),
                "href": image.get("href"),
            })

        return translated_images
