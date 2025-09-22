from abc import ABC, abstractmethod

class ListarAsteroidesUseCase(ABC):
    
    @abstractmethod
    def execute(self, data: str):
        pass
