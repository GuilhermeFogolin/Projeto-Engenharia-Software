from application.usecase.listar_asteroides_usecase import ListarAsteroidesUseCase
from domain.entities.asteroide import Asteroide

class ListarAsteroidesUseCaseImpl(ListarAsteroidesUseCase):
    
    def execute(self) -> list[Asteroide]:
        # Aqui futuramente será a chamada para a API da NASA
        asteroide1 = Asteroide(nome="asteroide 1", data_aproximacao="2025-09-08")
        asteroide2 = Asteroide(nome="asteroide 2", data_aproximacao="2025-09-09")
        return [asteroide1, asteroide2]
