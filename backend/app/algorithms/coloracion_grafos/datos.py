import json
from typing import Dict, List, Tuple

def cargar_grafo_fifa(ruta_json: str) -> Tuple[Dict, List[Tuple[int, int]]]:
    vertices = {}
    aristas = []
    
    with open(ruta_json, "r", encoding="utf-8") as file:
        datos = json.load(file)
        
    fases = datos["fases_eliminatorias"]
    
    for nombre_fase, partidos in fases.items():
        for p in partidos:
            vertices[p["id_partido"]] = {
                "nombre": f"{p['local']} v {p['visitante']}",
                "fecha": p["fecha"],
                "hora": p["hora"],
                "ciudad": p["estadio"],
                "fase": nombre_fase.replace("_", " ").title()
            }
            
    # Tiempo: O(V²) conflictos por fecha
    lista_ids = list(vertices.keys())
    for i in range(len(lista_ids)):
        for j in range(i + 1, len(lista_ids)):
            id_u = lista_ids[i]
            id_v = lista_ids[j]
            if vertices[id_u]["fecha"] == vertices[id_v]["fecha"]:
                aristas.append((id_u, id_v))
                
    return vertices, aristas

POOL_COLORES = [
    { "id_color": 1, "etiqueta": "Color 1 (Marciniak)", "capacidad_reuso": 4 },
    { "id_color": 2, "etiqueta": "Color 2 (Oliver)", "capacidad_reuso": 4 },
    { "id_color": 3, "etiqueta": "Color 3 (Turpin)", "capacidad_reuso": 4 },
    { "id_color": 4, "etiqueta": "Color 4 (Ramos)", "capacidad_reuso": 4 },
    { "id_color": 5, "etiqueta": "Color 5 (Tello)", "capacidad_reuso": 3 },
    { "id_color": 6, "etiqueta": "Color 6 (Claus)", "capacidad_reuso": 3 },
    { "id_color": 7, "etiqueta": "Color 7 (Makkelie)", "capacidad_reuso": 3 },
    { "id_color": 8, "etiqueta": "Color 8 (Elfath)", "capacidad_reuso": 3 },
    { "id_color": 9, "etiqueta": "Color 9 (Ghorbal)", "capacidad_reuso": 2 },
    { "id_color": 10, "etiqueta": "Color 10 (Zwayer)", "capacidad_reuso": 2 },
    { "id_color": 11, "etiqueta": "Color 11 (Barton)", "capacidad_reuso": 2 }
]