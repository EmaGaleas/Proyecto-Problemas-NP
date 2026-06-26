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
            
    lista_ids = list(vertices.keys())
    for i in range(len(lista_ids)):          # O(V²) — genera aristas entre partidos del mismo día
        for j in range(i + 1, len(lista_ids)):
            id_u = lista_ids[i]
            id_v = lista_ids[j]
            if vertices[id_u]["fecha"] == vertices[id_v]["fecha"]:
                aristas.append((id_u, id_v))
                
    return vertices, aristas

POOL_COLORES = [
    { "id_color": 1, "etiqueta": "Szymon Marciniak", "pais": "POL", "capacidad_reuso": 4 }, 
    { "id_color": 2, "etiqueta": "Ivan Barton", "pais": "SLV", "capacidad_reuso": 4 },     
    { "id_color": 3, "etiqueta": "Saíd Martínez", "pais": "HON", "capacidad_reuso": 4 },   
    { "id_color": 4, "etiqueta": "Jesús Valenzuela", "pais": "VEN", "capacidad_reuso": 4 },
    { "id_color": 5, "etiqueta": "Istvan Kovacs", "pais": "ROU", "capacidad_reuso": 3 },    
    { "id_color": 6, "etiqueta": "Slavko Vincic", "pais": "SVN", "capacidad_reuso": 3 },    
    { "id_color": 7, "etiqueta": "Cristian Garay", "pais": "CHI", "capacidad_reuso": 3 },   
    { "id_color": 8, "etiqueta": "Dahane Beida", "pais": "MTN", "capacidad_reuso": 3 },    
    { "id_color": 9, "etiqueta": "Abdulrahman Al-Jassim", "pais": "QAT", "capacidad_reuso": 2 }, 
    { "id_color": 10, "etiqueta": "Adham Makhadmeh", "pais": "JOR", "capacidad_reuso": 2 },      
    { "id_color": 11, "etiqueta": "Ma Ning", "pais": "CHN", "capacidad_reuso": 2 }              
]