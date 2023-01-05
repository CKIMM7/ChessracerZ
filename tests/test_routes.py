import pytest
from flask import Flask

@pytest.fixture
def app():
    app = Flask(__name__)
    yield app

def test_example(app):
    # Send a request to the server and verify the response
    client = app.test_client()
    response = client.get('/')
    print(response)
    assert response.status_code == 404
