import pytest
from server import app, db, User  

@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:" 

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

