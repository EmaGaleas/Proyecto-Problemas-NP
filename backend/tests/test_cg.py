import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.algorithms.coloracion_grafos.datos import cargar_grafo_fifa
from pathlib import Path

client = TestClient(app)

JSON_PATH = Path(__file__).parent.parent / "app" / "algorithms" / "coloracion_grafos" / "llaves_fifa_2026.json"


def _auditar_conflictos(nodos_coloreados: list, aristas: list):
    """Verifica que ninguna arista tenga el mismo color en ambos extremos."""
    mapa = {n["id_nodo"]: n["color"]["id"] for n in nodos_coloreados}
    for u, v in aristas:
        if u in mapa and v in mapa:
            assert mapa[u] != mapa[v], (
                f"Conflicto detectado: partidos {u} y {v} comparten color {mapa[u]}"
            )


@pytest.fixture(scope="module")
def aristas_completas():
    _, aristas = cargar_grafo_fifa(JSON_PATH)
    return aristas

# Test 1 — 32 nodos totales
def test_32_nodos_totales(aristas_completas):
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
    _auditar_conflictos(data["nodos_coloreados"], aristas_completas)

# Test 2 — Dieciseisavos (16 partidos)
def test_dieciseisavos_sin_conflicto(aristas_completas):
    # ARRANGE
    url = "/coloracion/fase/dieciseisavos"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 16, f"Se esperaban 16 nodos, llegaron {len(data['nodos_coloreados'])}"
    _auditar_conflictos(data["nodos_coloreados"], aristas_completas)

# Test 3 — Octavos (8 partidos)
def test_octavos_sin_conflicto(aristas_completas):
    # ARRANGE
    url = "/coloracion/fase/octavos"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 8, f"Se esperaban 8 nodos, llegaron {len(data['nodos_coloreados'])}"
    _auditar_conflictos(data["nodos_coloreados"], aristas_completas)

# Test 4 — Cuartos (4 partidos)
def test_cuartos_sin_conflicto(aristas_completas):
    # ARRANGE
    url = "/coloracion/fase/cuartos"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 4, f"Se esperaban 4 nodos, llegaron {len(data['nodos_coloreados'])}"
    _auditar_conflictos(data["nodos_coloreados"], aristas_completas)

# Test 5 — Semifinales (2 partidos)
def test_semifinales_sin_conflicto(aristas_completas):
    # ARRANGE
    url = "/coloracion/fase/semifinales"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 2, f"Se esperaban 2 nodos, llegaron {len(data['nodos_coloreados'])}"
    _auditar_conflictos(data["nodos_coloreados"], aristas_completas)

# Test 6 — Final + tercer puesto (2 partidos)
def test_final_y_tercer_puesto_sin_conflicto(aristas_completas):
    # ARRANGE
    url = "/coloracion/fase/final"

    # ACT
    response = client.get(url)
    data = response.json()

    # ASSERT
    assert response.status_code == 200
    assert len(data["nodos_coloreados"]) == 2, f"Se esperaban 2 nodos, llegaron {len(data['nodos_coloreados'])}"
    _auditar_conflictos(data["nodos_coloreados"], aristas_completas)

# Test 7 — Fase inexistente
def test_fase_inexistente():
    # ARRANGE
    url = "/coloracion/fase/grupos"

    # ACT
    response = client.get(url)

    # ASSERT
    assert response.status_code == 404

# Test 8 — Ruta inexistente
def test_endpoint_no_existente():
    # ARRANGE
    url = "/coloracion/ruta-inexistente"

    # ACT
    response = client.get(url)

    # ASSERT
    assert response.status_code == 404