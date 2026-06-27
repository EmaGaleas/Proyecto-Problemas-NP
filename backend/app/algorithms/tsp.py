from functools import lru_cache
from math import hypot


def _distance(city_a, city_b):
    return hypot(city_a["x"] - city_b["x"], city_a["y"] - city_b["y"])


def held_karp(cities, start_city_id):
    

    if not cities:
        return []

    # Buscar la ciudad inicial
    start_index = next(
        (i for i, city in enumerate(cities) if city["id"] == start_city_id),
        None
    )

    if start_index is None:
        raise ValueError("La ciudad inicial no existe.")

    # Mover la ciudad inicial al índice 0
    if start_index != 0:
        cities = (
            [cities[start_index]]
            + cities[:start_index]
            + cities[start_index + 1 :]
        )
    print(f"Ciudad inicial: {cities[0]['id']}")
    print(f"Total de ciudades: {len(cities)}")

        

    n = len(cities)

    if n == 1:
        return [cities[0]["id"], cities[0]["id"]]

    # Matriz de distancias
    dist = [
        [_distance(cities[i], cities[j]) for j in range(n)]
        for i in range(n)
    ]

    @lru_cache(maxsize=None)
    def dp(mask, current):
        print(f"\nEntrando a DP")
        print(f"mask = {mask:b}")
        print(f"current = {cities[current]['id']}")
        """
        mask: ciudades visitadas
        current: ciudad actual
        """

        if mask == (1 << n) - 1:
            print(
                f"Todas visitadas."
            )
            print(
                f"Regresando a {cities[0]['id']}"
            )
            return dist[current][0], [0]


        best_cost = float("inf")
        best_path = []

        for nxt in range(n):
            print(
                f"Desde {cities[current]['id']} "
                f"evaluando ir a {cities[nxt]['id']}"
            )
            if mask & (1 << nxt):
                continue

            cost, path = dp(mask | (1 << nxt), nxt)

            total = dist[current][nxt] + cost

            print(
    f"Costo hacia {cities[nxt]['id']} = "
    f"{dist[current][nxt]:.2f}"
)
            print(
                f"Costo restante = {cost:.2f}"
            )
            print(
                f"Total = {total:.2f}"
            )

            if total < best_cost:
                best_cost = total
                best_path = [nxt] + path
                print(
                    f"Nueva mejor opción desde "
                    f"{cities[current]['id']}"
                )
                print(
                    f"Costo anterior: {best_cost}"
                )
                print(
                    f"Nuevo costo: {total}"
                )
        

        return best_cost, best_path

    _, path = dp(1, 0)


    return [cities[i]["id"] for i in [0] + path]


def nearest_neighbor_tsp(cities, start_city_id):
    
    

    # Buscar la ciudad inicial
    start_index = next(
        (i for i, city in enumerate(cities) if city["id"] == start_city_id),
        None
    )
    if start_index is None:
        raise ValueError("La ciudad inicial no existe.")

    # Mover la ciudad inicial al índice 0
    if start_index != 0:
        cities = (
            [cities[start_index]]
            + cities[:start_index]
            + cities[start_index + 1:]
        )

    print(f"Ciudad inicial: {cities[0]['id']}")
    print(f"Total de ciudades: {len(cities)}")

    n = len(cities)

    if n == 1:
        return [cities[0]["id"], cities[0]["id"]]

    visited = [False] * n
    path    = [0]
    visited[0] = True

    total = 0.0 
    for _ in range(n - 1):
        current = path[-1]
        best_dist = float("inf")
        best_next = -1

        for nxt in range(n):
            if visited[nxt]:
                continue
            d = _distance(cities[current], cities[nxt])
            print(
                f"Desde {cities[current]['id']} evaluando "
                f"{cities[nxt]['id']} (dist={d:.2f})"
            )
            if d < best_dist:
                best_dist = d
                best_next = nxt

        total += best_dist

        print(
            f"Vecino más cercano de {cities[current]['id']}: "
            f"{cities[best_next]['id']} (dist={best_dist:.2f})"
            f"Acumulado: {total:.2f}"
        )
        visited[best_next] = True
        path.append(best_next)

    path.append(0)   # regresar al inicio
    total += _distance(cities[path[-2]], cities[0])
    print(f"\nCosto total de la ruta: {total:.2f}")
    return [cities[i]["id"] for i in path]

    