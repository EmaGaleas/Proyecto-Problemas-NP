from fastapi import APIRouter

router = APIRouter()

@router.post("/run")
def run_benchmark():
    # Aquí irá la lógica para ejecutar los 3 algoritmos y medir tiempos
    return {"message": "endpoint listo"}

@router.get("/history")
def get_history():
    # Aquí irá la lectura del CSV histórico
    return {"results": []}