from flask import Blueprint, jsonify, Response
import json
from application.usecase.listarasteroides.listar_asteroides_usecase_impl import ListarAsteroidesUseCaseImpl

class ListarAsteroidesController:
    def __init__(self):
        self.blueprint = Blueprint("listar_asteroides_controller", __name__)
        self._register_routes()
    
    def _register_routes(self):
        """Registra as rotas do controller"""
        self.blueprint.add_url_rule(
            "/asteroides/<string:data>", 
            "listar_asteroides", 
            self.listar_asteroides, 
            methods=["GET"]
        )
    
    def listar_asteroides(self, data: str):
        """Endpoint para listar asteroides"""
        use_case = ListarAsteroidesUseCaseImpl()
        resposta_asteroides = use_case.execute(data=data)
        
        # Usar json.dumps para preservar a ordem do OrderedDict
        resultado_json = json.dumps(resposta_asteroides.to_dict(), ensure_ascii=False, indent=2)
        
        return Response(
            resultado_json,
            mimetype='application/json; charset=utf-8'
        )

# Instância do controller para ser importada por outros módulos
listar_asteroides_controller = ListarAsteroidesController()
listar_asteroides_controller_blueprint = listar_asteroides_controller.blueprint