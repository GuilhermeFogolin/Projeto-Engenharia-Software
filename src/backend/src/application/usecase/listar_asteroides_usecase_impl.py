from application.usecase.listar_asteroides_usecase import ListarAsteroidesUseCase
from domain.entities.asteroide import Asteroide
from adapters.external.nasa.asteroides.api_asteroides import ApiAsteroides

class ListarAsteroidesUseCaseImpl(ListarAsteroidesUseCase):

    def execute(self, data: str) -> list[Asteroide]:
        api_asteroides = ApiAsteroides()
        dados_api = api_asteroides.buscar_por_data(data_busca=data)

        if not dados_api or "near_earth_objects" not in dados_api:
            return []

        lista_asteroides = []
        # A API retorna os asteroides agrupados por data
        for data in dados_api["near_earth_objects"]:
            for asteroide_data in dados_api["near_earth_objects"][data]:
                asteroide = Asteroide(
                    nome=asteroide_data["name"],
                    data_aproximacao=asteroide_data["close_approach_data"][0]["close_approach_date"]
                )
                lista_asteroides.append(asteroide)
        
        return lista_asteroides