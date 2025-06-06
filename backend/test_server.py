import os
import datetime
from functools import wraps


from flask import send_from_directory

from flask import Flask
from elasticapm.contrib.flask import ElasticAPM

from flask import Flask, jsonify, request


from elasticapm import capture_span

from elasticapm import Client

from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate  # <-- Added Flask-Migrate import
from sqlalchemy.exc import IntegrityError

from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

import jwt

# OPTIONAL: If you're using a .env file to store environment variables,
# uncomment the following lines after installing python-dotenv:
# pip install python-dotenv
# from dotenv import load_dotenv
# load_dotenv()


app = Flask(__name__)

#CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, methods=["GET", "POST", "PUT", "DELETE"])

CORS(app,
     resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)


#Konfigurerer Elastic_Apm:
app.config['ELASTIC_APM'] = {
    'SERVICE_NAME': 'flask-backend',
    'SECRET_TOKEN': 'changeme',  # må matche det som står i apm-server.yml!!
    'SERVER_URL': 'http://127.0.0.1:8200',
    'ENVIRONMENT': 'development',
}




apm = ElasticAPM(app)


app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "fallback-secret")

# Config for SQLite database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


UPLOAD_FOLDER = "./UPLOAD_FOLDER"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)
migrate = Migrate(app, db)  # <-- Initialize Flask-Migrate

# -----------------------------------------------------------------------------
# MODELS
# -----------------------------------------------------------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(100), nullable=False)  
    title = db.Column(db.String(100), nullable=False)  
    phone = db.Column(db.String(20), nullable=False)  
    profile_pic = db.Column(db.String(255), nullable=True)
      

    def test_to_dict(self):
        """Return user data without exposing the password hash."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "hashed_pass": self.password_hash, #Fjern i etterkant! VELDIG SÅRBART!
            "company": self.company,
            "title": self.title,
            "phone": self.phone,
            "profile_pic": f"http://127.0.0.1:5000/uploads/{self.profile_pic.split(os.sep)[-1]}" if self.profile_pic else None
        }

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def test_to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "user_id": self.user_id,
        }

# -----------------------------------------------------------------------------
# DECORATORS
# -----------------------------------------------------------------------------

# def test_token_required(f):
#     """Decorator to protect routes with JWT token authentication."""
#     @wraps(f)
#     def test_decorated(*args, **kwargs):
#         token = None

#         # Typically, the token is sent in the Authorization header as 'Bearer <token>'
#         if "Authorization" in request.headers:
#             parts = request.headers["Authorization"].split()
#             if len(parts) == 2 and parts[0].lower() == "bearer":
#                 token = parts[1]

#         if not token:
#             return jsonify({"message": "Token is missing"}), 401

#         try:
#             # Decode the token
#             data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
#             current_user = User.query.get(data["user_id"])
#             if not current_user:
#                 return jsonify({"message": "User not found"}), 404
#         except jwt.ExpiredSignatureError:
#             return jsonify({"message": "Token has expired"}), 401
#         except jwt.InvalidTokenError:
#             return jsonify({"message": "Invalid token"}), 401

#         # Pass the current_user to the protected route
#         return f(current_user, *args, **kwargs)

#     return decorated


#@capture_span(span_type="auth", span_subtype="login")

def test_log_login_attempt(ip_address, email, success, event):
    print("capture_span TRIGGERED")

    with capture_span(
        name="login_attempt",
        span_type="auth",
        span_subtype="login"
    ):
        apm.client.capture_message(
            f"Login attempt from {ip_address} for {email} | Success: {success} | Event: {event}",
            custom={ 
                "ip": ip_address,
                "email": email,
                "success": success,
                "event": event
            },
            level="info"
        )



def test_log_registration_attempt(ip_address, email, success=True):
    apm.client.capture_message(
        f"Registration attempt from {ip_address} for {email} | Success: {success}",
        custom={
            "event": "registration",
            "ip": ip_address,
            "email": email,
            "success": success
        },
        level="info"
    )



def test_token_required(f):
    @wraps(f)
    def test_decorated(*args, **kwargs):
        # Tillat preflight uten token
        if request.method == "OPTIONS":
            return f(None, *args, **kwargs)

        token = None
        if "Authorization" in request.headers:
            parts = request.headers["Authorization"].split()
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"message": "User not found"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)
    return test_decorated


# -----------------------------------------------------------------------------
# ROUTES
# -----------------------------------------------------------------------------

# @app.route("/api/test-error")
# def test_test_error():
#     raise Exception("Dette er en test for APM")


@app.route("/api/debug/users", methods=["GET"])
def test_debug_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])
#Fjern denne i etterkant (kun for debugging)


@app.route("/")
def test_index():
    return jsonify({"name": "Flask Backend", "version": "1.0"})

@app.route("/api/users", methods=["GET"])
@test_token_required
def test_get_users(current_user):
    """Example protected endpoint to list all users."""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route("/api/profile", methods=["GET"])
@test_token_required
def test_get_profile(current_user):
    """Return profile information of the logged-in user."""
    return jsonify(current_user.to_dict()), 200

@app.route('/uploads/<filename>')
def test_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/api/signup", methods=["POST"])
@app.route("/api/signup", methods=["POST"])
def test_signup():
    profile_pic = request.files.get("profilePic")
    filepath = None
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    if profile_pic and profile_pic.filename:
        filename = secure_filename(profile_pic.filename)
        filename = f"profile_{datetime.datetime.utcnow().timestamp()}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        profile_pic.save(filepath)

    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    company = request.form.get("company")
    title = request.form.get("title")
    phone = request.form.get("phone")

    ip_address = request.remote_addr  # <- Legg til IP-uthenting

    if not name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(name=name, email=email, password_hash=hashed_password,
                    company=company, title=title, phone=phone, profile_pic=filepath)

    try:
        db.session.add(new_user)
        db.session.commit()
        test_log_registration_attempt(ip_address, email, success=True)  # <- SUKSESSLOGGING
    except IntegrityError:
        db.session.rollback()
        test_log_registration_attempt(ip_address, email, success=True)  # <- SUKSESSLOGGING
        test_log_registration_attempt(ip_address, email, success=False)  # <- FEILLOGGING
        return jsonify({"message": "Email already in use"}), 400

    return jsonify({"message": "User registered successfully!", "profile_pic": filepath}), 201


@app.route("/api/login", methods=["POST"])
def test_login():
    """Login user and return JWT if credentials are valid."""
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    
    ######################################################################################################
    password_matches = user and check_password_hash(user.password_hash, data["password"])
    ip_address = request.remote_addr
    #ip_address = request.headers.get("X-Forwarded-For", "192.168.66.77") # <---- Hardkodet for å fabrikere falske innlogginger på lokal server!!!!!
    email = data.get("email")

    # Logg forsøket (suksess eller ikke)
    test_log_login_attempt(ip_address, email, success=bool(password_matches), event="login")
    


    ######################################################################################################
    
    #if user and check_password_hash(user.password_hash, data["password"]):
    if user and password_matches:
        token = jwt.encode(
            {
                "user_id": user.id,
                # Set token to expire in 1 hour
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )
        return jsonify({"token": token, "user": user.to_dict()}), 200

    return jsonify({"message": "Invalid email or password"}), 401

# Example of another protected endpoint
@app.route("/api/protected", methods=["GET"])
@test_token_required
def test_protected_route(current_user):
    """Demonstrates how to use the current_user from token_required."""
    return jsonify({"message": f"Hello, {current_user.name}!"})


@app.route("/api/profile", methods=["PUT"])
@test_token_required
def test_update_profile(current_user):
    """Update profile information of the logged-in user."""
    data = request.form if request.content_type.startswith("multipart/form-data") else request.get_json()

    # Oppdaterbare felter
    name = data.get("name", current_user.name)
    title = data.get("title", current_user.title)
    company = data.get("company", current_user.company)
    phone = data.get("phone", current_user.phone)
    
    # Håndtering av profilbilde (valgfritt)
    if "profilePic" in request.files:
        profile_pic = request.files["profilePic"]
        if profile_pic.filename:
            filename = secure_filename(profile_pic.filename)
            filename = f"profile_{datetime.datetime.utcnow().timestamp()}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            profile_pic.save(filepath)
            current_user.profile_pic = filepath  # Oppdaterer bildebanen

    # Oppdater brukerdata
    current_user.name = name
    current_user.title = title
    current_user.company = company
    current_user.phone = phone

    try:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully!", "user": current_user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating profile.", "error": str(e)}), 500

# ---------------------------------------------------------------------
# DEVICE ROUTES
# ---------------------------------------------------------------------
@app.route("/api/devices", methods=["POST"])
@test_token_required
def test_add_device(current_user):
    data = request.get_json()
    if not data or "name" not in data or "type" not in data:
        return jsonify({"message": "Missing required fields"}), 400
    new_device = Device(name=data["name"], type=data["type"], user_id=current_user.id)
    try:
        db.session.add(new_device)
        db.session.commit()
        return jsonify({"message": "Device added successfully", "device": new_device.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error adding device", "error": str(e)}), 500


@app.route("/api/devices", methods=["GET"])
@test_token_required
def test_get_devices(current_user):
    devices = Device.query.filter_by(user_id=current_user.id).all()
    return jsonify([device.to_dict() for device in devices]), 200

@app.route("/api/devices/<int:device_id>", methods=["OPTIONS", "DELETE"])
@test_token_required
def test_delete_device(current_user, device_id):
    if request.method == "OPTIONS":
        # Returner en suksessrespons for preflight-sjekken
        return jsonify({"message": "Preflight check successful"}), 200

    # DELETE-logikk følger her
    device = Device.query.filter_by(id=device_id, user_id=current_user.id).first()
    if not device:
        return jsonify({"message": "Device not found"}), 404
    try:
        db.session.delete(device)
        db.session.commit()
        return jsonify({"message": "Device deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting device", "error": str(e)}), 500


# -----------------------------------------------------------------------------
# RUN THE APPLICATION
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5000)

