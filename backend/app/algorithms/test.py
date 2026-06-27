import time
from tsp import held_karp,nearest_neighbor_tsp


class Test:

    # -----------------------------
    # DATASETS DE PRUEBA
    # -----------------------------
    def get_datasets(self):

        return [
            
            {
                "name": "Dataset 7 - 7 ciudades (stress)",
                "start": 1,
                "cities": [
                    {"id": 1, "x": 0, "y": 0},
                    {"id": 2, "x": 2, "y": 8},
                    {"id": 3, "x": 3, "y": 1},
                    {"id": 4, "x": 5, "y": 6},
                    {"id": 5, "x": 6, "y": 2},
                    {"id": 6, "x": 7, "y": 9},
                    {"id": 7, "x": 8, "y": 3},
                    {"id": 8, "x": 9, "y": 7},
                    {"id": 9, "x": 10, "y": 1},
                    {"id": 10, "x": 11, "y": 5},
                    {"id": 11, "x": 12, "y": 8},
                    {"id": 12, "x": 13, "y": 4},
                ],
            },
        ]




    def run(self):

        datasets = self.get_datasets()

        for data in datasets:

            print("\n" + "=" * 60)
            print("TEST:", data["name"])
            print("=" * 60)

            cities = data["cities"]
            start = data["start"]

            # ---------------- HELD-KARP ----------------
            start_time = time.perf_counter()
            hk_route = held_karp(cities, start)
            hk_time = time.perf_counter() - start_time

            # ---------------- NEAREST NEIGHBOR ----------------
            start_time = time.perf_counter()
            nn_route = nearest_neighbor_tsp(cities, start)
            nn_time = time.perf_counter() - start_time

            # ---------------- OUTPUT ----------------
            print("\n📌 Held-Karp")
            print("Ruta:", hk_route)
           
            print("Tiempo (s):", round(hk_time, 6))

            print("\n📌 Nearest Neighbor")
            print("Ruta:", nn_route)
            
            print("Tiempo (s):", round(nn_time, 6))

            

if __name__ == "__main__":
    Test().run()