from abc import ABC, abstractmethod
from typing import Optional, Dict


class BuscarImagemDiariaUseCase(ABC):
    @abstractmethod
    def execute(self, date: str) -> Optional[Dict[str, str]]:
        """Busca a imagem astronômica para a data fornecida."""
        raise NotImplementedError
