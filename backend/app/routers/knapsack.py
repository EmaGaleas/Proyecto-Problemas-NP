from fastapi import APIRouter, HTTPException
import json
import os
from app.schemas.knapsack import KnapsackRequest, KnapsackResponse
from app.algorithms.knapsack import knapsack_once_ideal

router = APIRouter()

# Ajusta esta ruta relativa según la ubicación real de tu JSON respecto a este archivo
DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/datosJugadores_Países.json"))

@router.post("/optimize", response_model=KnapsackResponse)
def optimize_team(request: KnapsackRequest):
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Base de datos de jugadores no encontrada.")

    jugadores_pais = data.get(request.pais)
    if not jugadores_pais:
        raise HTTPException(status_code=404, detail=f"No se encontraron jugadores para {request.pais}")

    # Ejecutar el algoritmo
    resultado = knapsack_once_ideal(jugadores_pais, request.limite_fatiga)

    if "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])

    return resultado