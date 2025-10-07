from collections import OrderedDict

class RespostaAsteroides:
    def __init__(self, asteroides):
        self.asteroides = asteroides
        self.estatisticas = self._calcular_estatisticas()
    
    def _calcular_estatisticas(self):
        total = len(self.asteroides)
        if total == 0:
            return {
                "total_asteroides": 0,
                "asteroides_potencialmente_perigosos": 0,
                "objetos_sentinela": 0,
                "porcentagem_perigosos": 0.0,
                "diametro_medio_metros": 0.0,
                "maior_diametro_metros": 0.0,
                "menor_diametro_metros": 0.0,
                "velocidade_media_kmh": 0.0,
                "velocidade_maxima_kmh": 0.0
            }
        
        potencialmente_perigosos = sum(1 for a in self.asteroides if a.e_potencialmente_perigoso)
        objetos_sentinela = sum(1 for a in self.asteroides if a.e_objeto_sentinela)
        
        # Calcular diâmetro médio (usando diâmetro máximo em metros)
        diametros = []
        for a in self.asteroides:
            diametro_data = a.diametro_estimado.get("meters", {})
            if diametro_data and "estimated_diameter_max" in diametro_data:
                try:
                    diametros.append(float(diametro_data["estimated_diameter_max"]))
                except (ValueError, TypeError):
                    continue
        
        diametro_medio = sum(diametros) / len(diametros) if diametros else 0
        diametro_maior = max(diametros) if diametros else 0
        diametro_menor = min(diametros) if diametros else 0
        
        # Calcular velocidade média (usando km/h dos dados de aproximação PROCESSADOS)
        velocidades = []
        for a in self.asteroides:
            for aproximacao in a.dados_aproximacao:
                # Agora usando os dados já processados pelo to_dict do asteroide
                vel_data = aproximacao.get("relative_velocity", {})
                if vel_data and "kilometers_per_hour" in vel_data:
                    try:
                        velocidades.append(float(vel_data["kilometers_per_hour"]))
                    except (ValueError, TypeError):
                        continue
        
        velocidade_media = sum(velocidades) / len(velocidades) if velocidades else 0
        velocidade_maxima = max(velocidades) if velocidades else 0
        
        return {
            "total_asteroides": total,
            "asteroides_potencialmente_perigosos": potencialmente_perigosos,
            "objetos_sentinela": objetos_sentinela,
            "porcentagem_perigosos": round((potencialmente_perigosos / total * 100), 2) if total > 0 else 0,
            "diametro_medio_metros": round(diametro_medio, 2),
            "maior_diametro_metros": round(diametro_maior, 2),
            "menor_diametro_metros": round(diametro_menor, 2),
            "velocidade_media_kmh": round(velocidade_media, 2),
            "velocidade_maxima_kmh": round(velocidade_maxima, 2)
        }
    
    def to_dict(self):
        # Organizar asteroides por nome para facilitar busca
        asteroides_organizados = {}
        for asteroide in self.asteroides:
            # Limpar o nome para usar como chave
            nome_limpo = asteroide.nome
            if nome_limpo:
                nome_limpo = nome_limpo.replace(" ", "_").replace("(", "").replace(")", "").replace("-", "_")
                # Remove caracteres especiais que podem causar problemas
                nome_limpo = ''.join(c for c in nome_limpo if c.isalnum() or c == '_')
                asteroides_organizados[nome_limpo] = asteroide.to_dict()
        
        # Usar OrderedDict para garantir a ordem: resumo primeiro
        resultado = OrderedDict()
        resultado["resumo"] = self.estatisticas
        resultado["asteroides"] = asteroides_organizados
        
        return resultado