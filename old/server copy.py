from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os

# Opprett Flask-app
app = Flask(__name__)
CORS(app)

# Konfigurer hemmelig nøkkel for JWT
app.config["SECRET_KEY"] = "supersecretkey"

# SQLite database konfigurasjon
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Opprett database objekt
db = SQLAlchemy(app)

# Bruker-modell
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def to_dict(self):
<<<<<<< HEAD
        return {"id": self.id, "name": self.name, "email": self.email}
=======
        return {"id": self.id, "name": name, "email": self.email}
>>>>>>> f42929243589eb8c15aee358bb31fb590b61cfd0

# API-endepunkt for å hente alle brukere (kun for testing)
@app.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# API-endepunkt for registrering av brukere
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    
    new_user = User(name=data["name"], email=data["email"], password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully!"}), 201

# API-endepunkt for innlogging
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    
    if user and check_password_hash(user.password_hash, data["password"]):
        token = jwt.encode({"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, 
                           app.config["SECRET_KEY"], algorithm="HS256")
        return jsonify({"token": token, "user": user.to_dict()})
    
    return jsonify({"message": "Invalid email or password"}), 401

@app.route("/")
def get_data():
    return jsonify({"name": "Flask Backend", "version": "1.0"})

# Kjør applikasjonen
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5000)
