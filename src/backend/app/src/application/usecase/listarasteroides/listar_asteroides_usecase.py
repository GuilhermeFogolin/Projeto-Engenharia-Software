from abc import ABC, abstractmethod
from src.domain.entities.resposta_asteroides import RespostaAsteroides


class ListarAsteroidesUseCase(ABC):

    @abstractmethod
    def execute(self, data: str) -> RespostaAsteroides:
        pass
