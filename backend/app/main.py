from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import benchmark, results, coloracion # Agregamos tu import

app = FastAPI(title="NP Algorithms Benchmark", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Tu puerto de Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mantienes lo de tus compañeros
app.include_router(benchmark.router, prefix="/benchmark", tags=["Benchmark"])
app.include_router(results.router,   prefix="/results",   tags=["Results"])

# Agregas tu módulo
app.include_router(coloracion.router, prefix="/coloracion", tags=["Coloración de Grafos"])