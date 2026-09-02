from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_create_account_invalid_email():
    response = client.post(
        "/create-account",
        json={
            "name": "Test User",
            "email": "invalid-email",
            "password": "Test@123"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"]["error"]["code"] == "INCORRECT_FORMAT"


def test_create_account_invalid_password():
    response = client.post(
        "/create-account",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "weak"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"]["error"]["code"] == "INCORRECT_FORMAT"


def test_login_invalid_credentials():
    response = client.post(
        "/login",
        data={
            "username": "nonexistent@example.com",
            "password": "WrongPassword@123"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"]["error"]["code"] == "INVALID_CREDENTIALS"