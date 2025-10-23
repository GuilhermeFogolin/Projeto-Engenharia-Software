from flask import Flask
from src.adapters.entrypoint.web.controller.listarasteroides.listar_asteroides_controller import (
    listar_asteroides_controller_blueprint,
)

app = Flask(__name__)

app.register_blueprint(listar_asteroides_controller_blueprint)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
