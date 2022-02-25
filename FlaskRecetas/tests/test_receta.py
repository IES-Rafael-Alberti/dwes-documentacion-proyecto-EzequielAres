import pytest
from app import create_app
from werkzeug.datastructures import Headers

@pytest.fixture
def client():
    app = create_app('config_tests.py')

    with app.test_client() as client:
        yield client

def test_getReceta(client):
    rv = client.post('/login', json={'nombre': 'Ezequiel', 'password': 'pestillo'})
    rsp = rv.get_json()
    assert 'access_token' in rsp.keys()

    headers = Headers()
    headers.add('Authorization', f"Bearer {rsp['access_token']}")
    rv = client.get('/api/receta', headers=headers, follow_redirects=True)
    rsp = rv.get_json()

    assert len(rsp) == 16
    assert "Stovetop Hamburger Potato Carrot Casserole" in [d.get("nombre") for d in rsp]

def test_getReceta(client):
    rv = client.post('/login', json={'nombre': 'Ezequiel', 'password': 'pestillo'})
    rsp = rv.get_json()
    assert 'access_token' in rsp.keys()

    headers = Headers()
    headers.add('Authorization', f"Bearer {rsp['access_token']}")
    rv = client.get("/api/receta/1", headers=headers, follow_redirects=True)
    rsp = rv.get_json()

    assert "Stovetop Hamburger Potato Carrot Casserole" == rsp.get("nombre")
    assert 1 == rsp.get("id")
    assert "Cooking with K is all things Southern and inspiring the next generation to enjoy cooking from recipes that have been passed down through the years." == rsp.get("descripcion")

def test_postReceta(client):
    rv = client.post('/login', json={'nombre': 'Ezequiel', 'password': 'pestillo'})
    rsp = rv.get_json()
    assert 'access_token' in rsp.keys()

    headers = Headers()
    headers.add('Authorization', f"Bearer {rsp['access_token']}")
    rv = client.post("/api/receta/", headers=headers, follow_redirects=True, json={'nombre': 'Pollo prueba', 'descripcion': 'sdfds', 'imagen': 'sdfsdfs', 'pasos' : 'sdfsdfsdf', 'ingredientes' : [], 'tags' : []})
    rsp = rv.get_json()

    assert "Pollo prueba" == rsp.get("nombre")
    assert 17 == rsp.get("id")
    assert "sdfds" == rsp.get("descripcion")
    assert "sdfsdfs" == rsp.get("imagen")
    assert "sdfsdfsdf" == rsp.get("pasos")
    assert [] == rsp.get("ingredientes")
    assert [] == rsp.get("tags")


def test_putReceta(client):
    rv = client.post('/login', json={'nombre': 'Ezequiel', 'password': 'pestillo'})
    rsp = rv.get_json()
    assert 'access_token' in rsp.keys()

    headers = Headers()
    headers.add('Authorization', f"Bearer {rsp['access_token']}")
    rv = client.put("/api/receta/1", headers=headers, follow_redirects=True, json={'nombre': 'Pollo prueba', 'descripcion': 'sdfds', 'imagen': 'sdfsdfs', 'pasos' : 'sdfsdfsdf', 'ingredientes' : [], 'tags' : []})
    rsp = rv.get_json()

    assert "Pollo prueba" == rsp.get("nombre")
    assert 17 == rsp.get("id")
    assert "sdfds" == rsp.get("descripcion")
    assert "sdfsdfs" == rsp.get("imagen")
    assert "sdfsdfsdf" == rsp.get("pasos")
    assert [] == rsp.get("ingredientes")
    assert [] == rsp.get("tags")

def test_delReceta(client):
    rv = client.post('/login', json={'nombre': 'Ezequiel', 'password': 'pestillo'})
    rsp = rv.get_json()
    assert 'access_token' in rsp.keys()

    headers = Headers()
    headers.add('Authorization', f"Bearer {rsp['access_token']}")
    rv = client.delete("/api/receta/1", headers=headers, follow_redirects=True)
    respuesta = rv.status
    assert '204 NO CONTENT' == respuesta
