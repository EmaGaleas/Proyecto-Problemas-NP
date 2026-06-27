import time
import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.algorithms.coloracion_grafos.datos import cargar_grafo_fifa, POOL_COLORES
from app.algorithms.coloracion_grafos.algoritmo import coloracion_arbitros
from app.algorithms.coloracion_grafos.logger import registrar_metrica_ejecucion

router = APIRouter()

_JSON = Path(__file__).parent.parent / "algorithms" / "coloracion_grafos" / "llaves_fifa_2026.json"
ARCHIVO_LOG = Path("data/results/coloracion_logs.json")

VERTICES, ARISTAS = cargar_grafo_fifa(str(_JSON))

FASES = {
    "dieciseisavos": set(range(73, 89)),
    "octavos":       set(range(89, 97)),
    "cuartos":       set(range(97, 101)),
    "semifinales":   {101, 102},
    "final":         {103, 104},
}

def _obtener_totales_logs():
    if not ARCHIVO_LOG.exists():
        return {"total_ejecuciones": 0, "historico_tiempos": []}
    try:
        with open(ARCHIVO_LOG, "r", encoding="utf-8") as f:
            logs = json.load(f)
            return {
                "total_ejecuciones": len(logs),
                "logs": logs[-10:]  # Últimos 10 registros
            }
    except Exception:
        return {"total_ejecuciones": 0, "logs": []}

def _construir_respuesta(vertices_completos: dict, aristas_completas: list, filtro_ids: set = None, etiqueta: str = "") -> dict:
    inicio = time.perf_counter()
    asignacion, num_cromatico, capacidades_restantes = coloracion_arbitros(vertices_completos, aristas_completas, POOL_COLORES)
    tiempo_ms = (time.perf_counter() - inicio) * 1000

    registrar_metrica_ejecucion(
        tiempo_ejecucion_ms=tiempo_ms,
        cant_nodos=len(vertices_completos),
        cant_aristas=len(aristas_completas),
        solicitud=etiqueta,
    )

    nodos_resultado = []
    for v_id, data_vertice in vertices_completos.items():
        if filtro_ids is not None and v_id not in filtro_ids:
            continue
            
        c_id = asignacion.get(v_id)
        color_info = next((c for c in POOL_COLORES if c["id_color"] == c_id), None)
        
        nodos_resultado.append({
            "id_nodo": v_id,
            "fase": data_vertice["fase"],
            "nombre": data_vertice["nombre"],
            "fecha": data_vertice["fecha"],
            "ciudad": data_vertice["ciudad"],
            "color": {
                "id": c_id if c_id else 0, 
                "etiqueta": color_info["etiqueta"] if color_info else "Conflicto",
                "pais": color_info["pais"] if color_info else "N/A"
            },
        })

    # Filtrar las aristas que corresponden a los nodos visualizados
    aristas_resultado = []
    for u, v in aristas_completas:
        if filtro_ids is None or (u in filtro_ids and v in filtro_ids):
            aristas_resultado.append({"desde": u, "hasta": v})

    return {
        "tiempo_ejecucion_ms": round(tiempo_ms, 4),
        "numero_cromatico_chi": num_cromatico,
        "nodos_coloreados": nodos_resultado,
        "aristas_conexiones": aristas_resultado,
        "capacidades_restantes": capacidades_restantes
    }

@router.get("/pura")
def ejecutar_completo():
    return _construir_respuesta(VERTICES, ARISTAS, None, "GET /coloracion/pura (32 Nodos)")

@router.get("/fase/{nombre_fase}")
def ejecutar_por_fase(nombre_fase: str):
    if nombre_fase not in FASES:
        raise HTTPException(
            status_code=404,
            detail=f"Fase '{nombre_fase}' no existe."
        )
    ids_fase = FASES[nombre_fase]
    return _construir_respuesta(VERTICES, ARISTAS, ids_fase, f"GET /coloracion/fase/{nombre_fase}")

@router.get("/estadisticas")
def obtener_estadisticas():
    return _obtener_totales_logs()