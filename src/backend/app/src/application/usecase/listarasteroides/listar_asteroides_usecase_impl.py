from application.usecase.listarasteroides.listar_asteroides_usecase import (
    ListarAsteroidesUseCase,
)
from domain.entities.asteroide import Asteroide
from domain.entities.resposta_asteroides import RespostaAsteroides
from adapters.external.nasa.asteroides.api_asteroides import ApiAsteroides


class ListarAsteroidesUseCaseImpl(ListarAsteroidesUseCase):

    def execute(self, data: str) -> RespostaAsteroides:
        api_asteroides = ApiAsteroides()
        dados_api = api_asteroides.buscar_por_data(data_busca=data)

        if not dados_api or "near_earth_objects" not in dados_api:
            return RespostaAsteroides([])

        lista_asteroides = []
        # A API retorna os asteroides agrupados por data
        for data_key in dados_api["near_earth_objects"]:
            for asteroide_data in dados_api["near_earth_objects"][data_key]:
                asteroide = Asteroide(
                    id=asteroide_data.get("id"),
                    id_referencia_neo=asteroide_data.get("neo_reference_id"),
                    nome=asteroide_data.get("name"),
                    url_nasa_jpl=asteroide_data.get("nasa_jpl_url"),
                    magnitude_absoluta_h=asteroide_data.get("absolute_magnitude_h"),
                    diametro_estimado=asteroide_data.get("estimated_diameter", {}),
                    e_potencialmente_perigoso=asteroide_data.get(
                        "is_potentially_hazardous_asteroid"
                    ),
                    dados_aproximacao=asteroide_data.get("close_approach_data", []),
                    e_objeto_sentinela=asteroide_data.get("is_sentry_object"),
                    links=asteroide_data.get("links", {}),
                )
                lista_asteroides.append(asteroide)

        return RespostaAsteroides(lista_asteroides)
