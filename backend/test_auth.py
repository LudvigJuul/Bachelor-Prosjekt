def text_index(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json()["name"] == "Flask Backend"

def test_signup(client):
    response = client.post("/api/signup", data={
        "name": "Test User",
        "email": "test@example.com",
        "password": "secret",
        "company": "TestCorp",
        "title": "Engineer",
        "phone": "12345678"
    })
    assert response.status_code == 201
    assert "User registered successfully" in response.get_json()["message"]
