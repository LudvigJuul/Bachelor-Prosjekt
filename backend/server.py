import os
import datetime
from functools import wraps

from flask import Flask, jsonify, request
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
CORS(app)

# Use an environment variable for the secret key, with a fallback if not set
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "fallback-secret")

# Configure SQLite database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "database.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

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
      

    def to_dict(self):
        """Return user data without exposing the password hash."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "hashed_pass": self.password_hash, #Fjern i etterkant! VELDIG SÅRBART!
            "company": self.company,
            "title": self.title,
            "phone": self.phone,
            "profile_pic": self.profile_pic
        }

# -----------------------------------------------------------------------------
# DECORATORS
# -----------------------------------------------------------------------------
def token_required(f):
    """Decorator to protect routes with JWT token authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Typically, the token is sent in the Authorization header as 'Bearer <token>'
        if "Authorization" in request.headers:
            parts = request.headers["Authorization"].split()
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            # Decode the token
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"message": "User not found"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        # Pass the current_user to the protected route
        return f(current_user, *args, **kwargs)

    return decorated

# -----------------------------------------------------------------------------
# ROUTES
# -----------------------------------------------------------------------------

@app.route("/api/debug/users", methods=["GET"])
def debug_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])
#Fjern denne i etterkant (kun for debugging)

@app.route("/")
def index():
    return jsonify({"name": "Flask Backend", "version": "1.0"})

@app.route("/api/users", methods=["GET"])
@token_required
def get_users(current_user):
    """Example protected endpoint to list all users."""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@app.route("/api/signup", methods=["POST"])
def signup():
    """Register a new user. Supports profile picture upload."""
    
    # Håndter filopplasting sikkert
    profile_pic = request.files.get("profilePic")
    filepath = None
    UPLOAD_FOLDER = "./UPLOAD_FOLDER"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    if profile_pic and profile_pic.filename:
        filename = secure_filename(profile_pic.filename)
        filename = f"profile_{datetime.datetime.utcnow().timestamp()}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        profile_pic.save(filepath)

    # Hent skjemadata
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    company = request.form.get("company")
    title = request.form.get("title")
    phone = request.form.get("phone")

    # Valider obligatoriske felt
    if not name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
    new_user = User(name=name, email=email, password_hash=hashed_password, 
                    company=company, title=title, phone=phone, profile_pic=filepath)

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email already in use"}), 400

    return jsonify({"message": "User registered successfully!", "profile_pic": filepath}), 201


@app.route("/api/login", methods=["POST"])
def login():
    """Login user and return JWT if credentials are valid."""
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if user and check_password_hash(user.password_hash, data["password"]):
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
@token_required
def protected_route(current_user):
    """Demonstrates how to use the current_user from token_required."""
    return jsonify({"message": f"Hello, {current_user.name}!"})

# -----------------------------------------------------------------------------
# RUN THE APPLICATION
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    # For production, you might remove this or rely on Flask-Migrate to manage your schema.
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="127.0.0.1", port=5000)
