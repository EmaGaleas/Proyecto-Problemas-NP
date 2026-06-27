from app.algorithms.tsp import nearest_neighbor_tsp
from fastapi import APIRouter
from pydantic import BaseModel

from app.algorithms.tsp import held_karp

router = APIRouter()


class CityInput(BaseModel):
    id: int
    name: str
    x: float
    y: float


class TSPRequest(BaseModel):
    cities: list[CityInput]
    cityId: int

@router.post("/run")
def run_benchmark():
    # Aquí irá la lógica para ejecutar los 3 algoritmos y medir tiempos
    return {"message": "endpoint listo"}

@router.get("/history")
def get_history():
    # Aquí irá la lectura del CSV histórico
    return {"results": []}


@router.post("/tsp/shortest-route")
def get_shortest_route(payload: TSPRequest):
    cities = [city.model_dump() for city in payload.cities]
    cityId = payload.cityId
    route = held_karp(cities, cityId)
    return {"route": route}


@router.post("/tsp/nearest-neighbor")
def get_shortest_route(payload: TSPRequest):
    cities = [city.model_dump() for city in payload.cities]
    cityId = payload.cityId
    route = nearest_neighbor_tsp(cities, cityId)
    return {"route": route}