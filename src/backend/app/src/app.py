from flask import Flask
from flask_cors import CORS

from src.adapters.entrypoint.web.controller.listarasteroides.listar_asteroides_controller import (
    listar_asteroides_controller_blueprint,
)
from src.adapters.entrypoint.web.controller.listarimagens.listar_imagens_diarias_controller import (
    listar_imagens_diarias_controller_blueprint,
)

app = Flask(__name__)
CORS(app)


app.register_blueprint(listar_asteroides_controller_blueprint)
app.register_blueprint(listar_imagens_diarias_controller_blueprint)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
