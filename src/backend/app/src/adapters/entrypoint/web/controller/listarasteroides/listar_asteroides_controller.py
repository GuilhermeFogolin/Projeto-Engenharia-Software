from flask import Blueprint, jsonify
from src.application.usecase.listarasteroides.listar_asteroides_usecase_impl import ListarAsteroidesUseCaseImpl

listar_asteroides_controller_blueprint = Blueprint("listar_asteroides_controller", __name__)

@listar_asteroides_controller_blueprint.route("/asteroides/<string:data>", methods=["GET"])
def listar_asteroides_controller(data: str):
    use_case = ListarAsteroidesUseCaseImpl()
    lista_de_asteroides = use_case.execute(data=data)

    # Convertendo a lista de entidades para uma lista de dicionários
    resultado_json = [asteroide.to_dict() for asteroide in lista_de_asteroides]
    
    return jsonify({"asteroides": resultado_json})
