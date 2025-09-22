from dataclasses import dataclass

@dataclass
class Asteroide:
    nome: str
    data_aproximacao: str

    def to_dict(self):
        return {
            "nome": self.nome,
            "data_aproximacao": self.data_aproximacao
        }
