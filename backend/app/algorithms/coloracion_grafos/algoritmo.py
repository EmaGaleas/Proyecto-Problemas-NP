from typing import Dict, List, Tuple
import warnings

def _quicksort(arr: List[int], grados: Dict[int, int]) -> List[int]:
    # tiempo es O(1) - Condición
    if len(arr) <= 1:
        # tiempo es O(1) - Retorno
        return arr

    # tiempo es O(1) - Pivote
    pivote = grados[arr[len(arr) // 2]]

    # tiempo es O(V)
    menores  = [v for v in arr if grados[v] >  pivote]  
    
    # tiempo es O(V) 
    iguales  = [v for v in arr if grados[v] == pivote]
    
    # tiempo es O(V) 
    mayores  = [v for v in arr if grados[v] <  pivote]

    # tiempo es O(V log V) Recursión
    return _quicksort(menores, grados) + iguales + _quicksort(mayores, grados)


def coloracion_arbitros(
    vertices: Dict[int, dict],
    aristas: List[Tuple[int, int]],
    pool_arbitros: List[Dict],
) -> Tuple[Dict[int, int], int, Dict[int, int]]:
    # tiempo es O(V) por inicialización
    lista_adyacencia: Dict[int, set] = {v_id: set() for v_id in vertices}

    # tiempo es O(E) del bucle
    for u, v in aristas:
        # tiempo es O(1) 
        if u in lista_adyacencia and v in lista_adyacencia:
            # tiempo es O(1) 
            lista_adyacencia[u].add(v)
            # tiempo es O(1) 
            lista_adyacencia[v].add(u)

    # tiempo es O(V) hay comprensión
    grados: Dict[int, int] = {v_id: len(lista_adyacencia[v_id]) for v_id in vertices}

    # tiempo es O(V log V)  Ordenamiento de arriba
    vertices_ordenados: List[int] = _quicksort(list(vertices.keys()), grados)

    # tiempo es O(1) 
    asignacion_arbitros: Dict[int, int] = {}
    
    # tiempo es O(P) 
    capacidades_actuales: Dict[int, int] = {a["id_color"]: a["capacidad_reuso"] for a in pool_arbitros}
    
    # tiempo es O(1) 
    arbitros_activos: set = set()

    # tiempo es O(V) Bucle
    for u in vertices_ordenados:
        
        arbitros_ocupados = {
            asignacion_arbitros[vecino]
            for vecino in lista_adyacencia[u]
            if vecino in asignacion_arbitros
        }

        # tiempo es O(P) Bucle
        for arb_obj in pool_arbitros:
            # tiempo es O(1) 
            arb_id = arb_obj["id_color"]

            # tiempo es O(1) 
            if capacidades_actuales[arb_id] > 0 and arb_id not in arbitros_ocupados:
                # tiempo es O(1) 
                asignacion_arbitros[u] = arb_id
                # tiempo es O(1) 
                capacidades_actuales[arb_id] -= 1
                # tiempo es O(1) 
                arbitros_activos.add(arb_id)
                # tiempo es O(1) 
                break
        else:
            # tiempo es O(1) - Advertencia
            warnings.warn(f"Partido {u} no pudo ser asignado: personal agotado.")

    # tiempo es O(1) - Retorno
    return asignacion_arbitros, len(arbitros_activos), capacidades_actuales