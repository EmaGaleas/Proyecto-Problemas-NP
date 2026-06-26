import time
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.algorithms.coloracion_grafos.datos import cargar_grafo_fifa, POOL_COLORES
from app.algorithms.coloracion_grafos.algoritmo import coloracion_arbitros
from app.algorithms.coloracion_grafos.logger import registrar_metrica_ejecucion

router = APIRouter()

_JSON = Path(__file__).parent.parent / "algorithms" / "coloracion_grafos" / "llaves_fifa_2026.json"

# Carga completa en memoria al iniciar
VERTICES, ARISTAS = cargar_grafo_fifa(str(_JSON))

# Mapa de fases disponibles es decir IDs de partido
FASES = {
    "dieciseisavos": set(range(73, 89)),   # 16 partidos
    "octavos":       set(range(89, 97)),   #  8 partidos
    "cuartos":       set(range(97, 101)),  #  4 partidos
    "semifinales":   {101, 102},           #  2 partidos
    "final":         {103, 104},           #  2 partidos (3er puesto + final)
}


def _construir_respuesta(vertices: dict, aristas: list, etiqueta: str) -> dict:
    inicio = time.perf_counter()
    asignacion, num_cromatico, _ = coloracion_arbitros(vertices, aristas, POOL_COLORES)
    tiempo_ms = (time.perf_counter() - inicio) * 1000

    registrar_metrica_ejecucion(
        tiempo_ejecucion_ms=tiempo_ms,
        cant_nodos=len(vertices),
        cant_aristas=len(aristas),
        solicitud=etiqueta,
    )

    nodos_resultado = []
    for v_id, data_vertice in vertices.items():
        c_id = asignacion.get(v_id)
        color_info = next((c for c in POOL_COLORES if c["id_color"] == c_id), None)
        nodos_resultado.append({
            "id_nodo": v_id,
            "fase": data_vertice["fase"],
            "nombre": data_vertice["nombre"],
            "fecha": data_vertice["fecha"],
            "color": {"id": c_id, "etiqueta": color_info["etiqueta"] if color_info else "Conflicto"},
        })

    return {
        "tiempo_ejecucion_ms": round(tiempo_ms, 4),
        "numero_cromatico_chi": num_cromatico,
        "nodos_coloreados": nodos_resultado,
    }


@router.get("/pura")
def ejecutar_completo():
    """Colorea los 32 partidos de la fase final."""
    return _construir_respuesta(VERTICES, ARISTAS, "GET /coloracion/pura (32 Nodos)")


@router.get("/fase/{nombre_fase}")
def ejecutar_por_fase(nombre_fase: str):
    """
    Colorea solo los partidos de una fase específica.
    Valores válidos: dieciseisavos, octavos, cuartos, semifinales, final
    """
    if nombre_fase not in FASES:
        raise HTTPException(
            status_code=404,
            detail=f"Fase '{nombre_fase}' no existe. Válidas: {list(FASES.keys())}"
        )

    ids_fase = FASES[nombre_fase]

    # Filtrar vértices y aristas solo de esta fase
    vertices_fase = {v_id: data for v_id, data in VERTICES.items() if v_id in ids_fase}
    aristas_fase  = [(u, v) for u, v in ARISTAS if u in ids_fase and v in ids_fase]

    etiqueta = f"GET /coloracion/fase/{nombre_fase} ({len(vertices_fase)} Nodos)"
    return _construir_respuesta(vertices_fase, aristas_fase, etiqueta)