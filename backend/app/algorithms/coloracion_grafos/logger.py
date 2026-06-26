import json
import os
from datetime import datetime

# Guardar en la carpeta designada para resultados de tu backend
ARCHIVO_LOG = "data/results/coloracion_logs.json"

def registrar_metrica_ejecucion(tiempo_ejecucion_ms: float, cant_nodos: int, cant_aristas: int, solicitud: str):
    log_entry = {
        "fecha_hora": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "solicitud": solicitud,
        "tiempo_ejecucion_ms": round(tiempo_ejecucion_ms, 4),
        "datos_procesados": {
            "nodos": cant_nodos,
            "aristas": cant_aristas
        }
    }
    
    # Asegurar que la carpeta exista
    os.makedirs(os.path.dirname(ARCHIVO_LOG), exist_ok=True)
    
    logs = []
    if os.path.exists(ARCHIVO_LOG):
        with open(ARCHIVO_LOG, "r", encoding="utf-8") as file:
            try:
                logs = json.load(file)
            except json.JSONDecodeError:
                logs = []
                
    logs.append(log_entry)
    
    with open(ARCHIVO_LOG, "w", encoding="utf-8") as file:
        json.dump(logs, file, indent=4)