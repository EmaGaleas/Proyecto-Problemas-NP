from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import benchmark, results

app = FastAPI(title="NP Algorithms Benchmark", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto de Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(benchmark.router, prefix="/benchmark", tags=["Benchmark"])
app.include_router(results.router,   prefix="/results",   tags=["Results"])