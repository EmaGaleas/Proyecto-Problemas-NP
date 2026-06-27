import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _auditar_conflictos(nodos_coloreados: list, aristas_conexiones: list):
    """Verifica que ninguna arista tenga el mismo color en ambos extremos utilizando los datos del backend."""
    mapa = {n["id_nodo"]: n["color"]["id"] for n in nodos_coloreados}
    for arista in aristas_conexiones:
        u = arista["desde"]
        v = arista["hasta"]
        if u in mapa and v in mapa:
            assert mapa[u] != mapa[v], (
                f"Conflicto detectado: partidos {u} y {v} comparten color {mapa[u]}"
            )


# Test 1 — Universo completo de partidos de la fase final
def test_32_nodos_totales():
    # ARRANGE
    url = "/coloracion/pura"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 32
    assert "tiempo_ejecucion_ms" in data
    assert data["tiempo_ejecucion_ms"] > 0
    assert "numero_cromatico_chi" in data
    assert "aristas_conexiones" in data
    _auditar_conflictos(data["nodos_coloreados"], data["aristas_conexiones"])


# Test 2 — Dieciseisavos (16 partidos)
def test_dieciseisavos_sin_conflicto():
    # ARRANGE
    url = "/coloracion/fase/dieciseisavos"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 16
    _auditar_conflictos(data["nodos_coloreados"], data["aristas_conexiones"])


# Test 3 — Octavos (8 partidos)
def test_octavos_sin_conflicto():
    # ARRANGE
    url = "/coloracion/fase/octavos"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 8
    _auditar_conflictos(data["nodos_coloreados"], data["aristas_conexiones"])


# Test 4 — Cuartos (4 partidos)
def test_cuartos_sin_conflicto():
    # ARRANGE
    url = "/coloracion/fase/cuartos"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 4
    _auditar_conflictos(data["nodos_coloreados"], data["aristas_conexiones"])


# Test 5 — Semifinales (2 partidos)
def test_semifinales_sin_conflicto():
    # ARRANGE
    url = "/coloracion/fase/semifinales"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 2
    _auditar_conflictos(data["nodos_coloreados"], data["aristas_conexiones"])


# Test 6 — Final + tercer puesto (2 partidos)
def test_final_y_tercer_puesto_sin_conflicto():
    # ARRANGE
    url = "/coloracion/fase/final"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 2
    _auditar_conflictos(data["nodos_coloreados"], data["aristas_conexiones"])


# Test 7 — Fase inexistente
def test_fase_inexistente():
    # ARRANGE
    url = "/coloracion/fase/grupos"

    # ACT
    response = client.get(url)

    # ASSERT
    assert response.status_code == 404


# Test 8 — Endpoint de estadísticas del logger responde correctamente
def test_endpoint_estadisticas():
    # ARRANGE
    url = "/coloracion/estadisticas"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert "total_ejecuciones" in data
    assert "logs" in data or isinstance(data.get("logs"), list)