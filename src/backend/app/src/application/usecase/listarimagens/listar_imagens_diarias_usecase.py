from abc import ABC, abstractmethod
from typing import List, Dict

class ListarImagensDiariasUseCase(ABC):
    @abstractmethod
    def execute(self) -> List[Dict]:
        pass
