from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from elasticapm.contrib.flask import ElasticAPM
import os

app = Flask(__name__)
CORS(app)

# Eksempel på eksisterende konfig
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "fallback-secret")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"  #   -- Trengs dette? 
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# -- Legg til Elastic APM-konfig --
app.config["ELASTIC_APM"] = {
    "SERVICE_NAME": "min-flask-app",      # Gi tjenesten et navn
    "SERVER_URL": "http://localhost:8200",# APM-serverens URL
    "SECRET_TOKEN": "",                   # Hvis du har satt opp et secret token i APM-serveren
   
    # "ENVIRONMENT": "development",       # Du kan evt. legge til et environment-navn
}

apm = ElasticAPM(app)

#Routes 
@app.route("/")
def index():
    return "Hello, APM!"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
