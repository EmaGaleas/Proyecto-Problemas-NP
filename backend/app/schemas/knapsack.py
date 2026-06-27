from pydantic import BaseModel
from typing import List, Optional

class KnapsackRequest(BaseModel):
    pais: str
    limite_fatiga: float

class Jugador(BaseModel):
    id_jugador: int
    nombre: str
    posicion: str
    desgaste: float
    valor_tactico: int

class KnapsackResponse(BaseModel):
    valor_tactico_total: int
    desgaste_total_consumido: float
    desgaste_maximo_permitido: float
    plantilla: List[Jugador]