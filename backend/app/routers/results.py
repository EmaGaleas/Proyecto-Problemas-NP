from fastapi import APIRouter

router = APIRouter()

@router.get("/{algorithm}")
def get_results_by_algorithm(algorithm: str):
    # Filtrará el histórico por algoritmo: tsp | knapsack | graph_coloring
    return {"algorithm": algorithm, "data": []}