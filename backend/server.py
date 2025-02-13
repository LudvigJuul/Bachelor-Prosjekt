from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

# Opprett Flask-app
app = Flask(__name__)
CORS(app)

# SQLite database konfigurasjon
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Opprett database objekt
db = SQLAlchemy(app)

# Definer en database-tabell (modell)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}

# API-endepunkt for å hente alle brukere
@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# API-endepunkt for å legge til en ny bruker
@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.get_json()
    new_user = User(name=data["name"], email=data["email"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route("/api/data")
def get_data():
    data = {"name": "Flask Backend", "version": "1.0"}
    return jsonify(data)

# Kjør applikasjonen
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Oppretter database-tabellen hvis den ikke finnes
    app.run(debug=True, host="127.0.0.1",port=5000)
