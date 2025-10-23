import unittest

from src.domain.entities.asteroide import Asteroide


class TestAsteroide(unittest.TestCase):

    def test_criar_asteroide_com_todos_os_campos(self):
        # Arrange
        dados_aproximacao = [
            {
                "close_approach_date": "2024-01-01",
                "close_approach_date_full": "2024-Jan-01 12:00",
                "epoch_date_close_approach": 1704110400000,
                "relative_velocity": {
                    "kilometers_per_second": "10.5",
                    "kilometers_per_hour": "37800",
                    "miles_per_hour": "23485",
                },
                "miss_distance": {
                    "astronomical": "0.1",
                    "lunar": "38.9",
                    "kilometers": "14960000",
                    "miles": "9295000",
                },
                "orbiting_body": "Earth",
            }
        ]

        diametro_estimado = {
            "kilometers": {
                "estimated_diameter_min": 0.1,
                "estimated_diameter_max": 0.3,
            },
            "meters": {"estimated_diameter_min": 100, "estimated_diameter_max": 300},
            "miles": {"estimated_diameter_min": 0.06, "estimated_diameter_max": 0.19},
            "feet": {"estimated_diameter_min": 328, "estimated_diameter_max": 984},
        }

        # Act
        asteroide = Asteroide(
            id="123456",
            id_referencia_neo="neo123",
            nome="Asteroide Teste",
            url_nasa_jpl="https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=123456",
            magnitude_absoluta_h=20.5,
            diametro_estimado=diametro_estimado,
            e_potencialmente_perigoso=False,
            dados_aproximacao=dados_aproximacao,
            e_objeto_sentinela=False,
            links={"self": "https://api.nasa.gov/neo/rest/v1/neo/123456"},
        )

        # Assert
        assert asteroide.id == "123456"
        assert asteroide.id_referencia_neo == "neo123"
        assert asteroide.nome == "Asteroide Teste"
        assert asteroide.e_potencialmente_perigoso is False
        assert len(asteroide.dados_aproximacao) == 1

    def test_to_dict_converte_corretamente(self):
        # Arrange
        dados_aproximacao = [
            {
                "close_approach_date": "2024-01-01",
                "relative_velocity": {"kilometers_per_second": "10.5"},
                "miss_distance": {"kilometers": "14960000"},
                "orbiting_body": "Earth",
            }
        ]

        diametro_estimado = {
            "kilometers": {"estimated_diameter_min": 0.1},
            "meters": {"estimated_diameter_min": 100},
        }

        asteroide = Asteroide(
            id="123456",
            id_referencia_neo="neo123",
            nome="Asteroide Teste",
            url_nasa_jpl="https://test.com",
            magnitude_absoluta_h=20.5,
            diametro_estimado=diametro_estimado,
            e_potencialmente_perigoso=True,
            dados_aproximacao=dados_aproximacao,
            e_objeto_sentinela=False,
            links={},
        )

        # Act
        resultado = asteroide.to_dict()

        # Assert
        assert resultado["id"] == "123456"
        assert resultado["nome"] == "Asteroide Teste"
        assert resultado["e_potencialmente_perigoso"] is True
        assert len(resultado["dados_aproximacao"]) == 1
        assert resultado["dados_aproximacao"][0]["data_aproximacao"] == "2024-01-01"
        assert "diametro_estimado" in resultado
        assert "quilometros" in resultado["diametro_estimado"]
