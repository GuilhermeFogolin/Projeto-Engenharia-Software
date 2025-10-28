from flask import Blueprint, jsonify

from src.application.usecase.buscarimagemdiaria.buscar_imagem_diaria_usecase_impl import (
    BuscarImagemDiariaUseCaseImpl,
)
from src.application.usecase.listarimagens.listar_imagens_diarias_usecase_impl import (
    ListarImagensDiariasUseCaseImpl,
)

listar_imagens_diarias_controller_blueprint = Blueprint("listar_imagens_diarias", __name__)

@listar_imagens_diarias_controller_blueprint.route("/api/v1/daily-images", methods=["GET"])
def listar_imagens_diarias():
    try:
        use_case = ListarImagensDiariasUseCaseImpl()
        images = use_case.execute()
        if images:
            return jsonify(images), 200
        else:
            return jsonify({"message": "No images found"}), 404
    except Exception as e:
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


@listar_imagens_diarias_controller_blueprint.route(
    "/api/v1/daily-images/<date>", methods=["GET"]
)
def buscar_imagem_por_data(date: str):
    try:
        use_case = BuscarImagemDiariaUseCaseImpl()
        image = use_case.execute(date)

        if image:
            return jsonify(image), 200

        return (
            jsonify(
                {
                    "message": "Nenhuma imagem disponível para a data informada.",
                }
            ),
            404,
        )
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"message": "Internal server error", "error": str(exc)}), 500
