import requests
import time

API_URL = "http://localhost:5000/api/login"
TEST_IPS = [
    "192.168.0.4",
    "10.0.0.4",
    "8.8.8.7",
    "66.77.88.97",
    "123.123.123.121"
]

EMAIL = "ludvigjuul@gmail.com"
PASSWORD = "123"

for ip in TEST_IPS:
    print(f"\nSimulerer login fra {ip}...")
    try:
        response = requests.post(
            API_URL,
            headers={"X-Forwarded-For": ip},
            json={"email": EMAIL, "password": PASSWORD}  
        )   

        print(f"Status: {response.status_code}")
        print(f"Respons: {response.json()}")
    except Exception as e:
        print(f"Feil: {e}")

    time.sleep(2) 
