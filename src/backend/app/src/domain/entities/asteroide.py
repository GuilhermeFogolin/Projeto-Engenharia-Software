class Asteroide:
    def __init__(
        self,
        id,
        id_referencia_neo,
        nome,
        url_nasa_jpl,
        magnitude_absoluta_h,
        diametro_estimado,
        e_potencialmente_perigoso,
        dados_aproximacao,
        e_objeto_sentinela,
        links,
    ):
        self.id = id
        self.id_referencia_neo = id_referencia_neo
        self.nome = nome
        self.url_nasa_jpl = url_nasa_jpl
        self.magnitude_absoluta_h = magnitude_absoluta_h
        self.diametro_estimado = diametro_estimado
        self.e_potencialmente_perigoso = e_potencialmente_perigoso
        self.dados_aproximacao = dados_aproximacao
        self.e_objeto_sentinela = e_objeto_sentinela
        self.links = links

    def to_dict(self):
        dados_aproximacao_traduzido = []
        if self.dados_aproximacao:
            for aproximacao in self.dados_aproximacao:
                dados_aproximacao_traduzido.append(
                    {
                        "data_aproximacao": aproximacao.get("close_approach_date"),
                        "data_aproximacao_completa": aproximacao.get(
                            "close_approach_date_full"
                        ),
                        "epoch_data_aproximacao": aproximacao.get(
                            "epoch_date_close_approach"
                        ),
                        "velocidade_relativa": {
                            "quilometros_por_segundo": aproximacao.get(
                                "relative_velocity", {}
                            ).get("kilometers_per_second"),
                            "quilometros_por_hora": aproximacao.get(
                                "relative_velocity", {}
                            ).get("kilometers_per_hour"),
                            "milhas_por_hora": aproximacao.get(
                                "relative_velocity", {}
                            ).get("miles_per_hour"),
                        },
                        "distancia_perdida": {
                            "astronomica": aproximacao.get("miss_distance", {}).get(
                                "astronomical"
                            ),
                            "lunar": aproximacao.get("miss_distance", {}).get("lunar"),
                            "quilometros": aproximacao.get("miss_distance", {}).get(
                                "kilometers"
                            ),
                            "milhas": aproximacao.get("miss_distance", {}).get("miles"),
                        },
                        "corpo_orbitante": aproximacao.get("orbiting_body"),
                    }
                )

        return {
            "id": self.id,
            "id_referencia_neo": self.id_referencia_neo,
            "nome": self.nome,
            "url_nasa_jpl": self.url_nasa_jpl,
            "magnitude_absoluta_h": self.magnitude_absoluta_h,
            "diametro_estimado": {
                "quilometros": self.diametro_estimado.get("kilometers", {}),
                "metros": self.diametro_estimado.get("meters", {}),
                "milhas": self.diametro_estimado.get("miles", {}),
                "pes": self.diametro_estimado.get("feet", {}),
            },
            "e_potencialmente_perigoso": self.e_potencialmente_perigoso,
            "dados_aproximacao": dados_aproximacao_traduzido,
            "e_objeto_sentinela": self.e_objeto_sentinela,
            "links": self.links,
        }
