import React from 'react';
import { useNavigate } from 'react-router-dom';
import fondoUsa from '../assets/usa/fondo1.png';

export default function TSP() {
  const navigate = useNavigate();

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative select-none bg-black flex flex-col items-center justify-center text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${fondoUsa})` }}
    >
      {/* Botón Volver Dorado Profesional */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 px-5 py-2.5 rounded-full border border-[#BF953F]/60 bg-black/40 backdrop-blur-md text-[#FCF6BA] font-medium tracking-wide flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#BF953F] hover:via-[#FCF6BA] hover:to-[#B38728] hover:text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(252,246,186,0.4)] cursor-pointer"
      >
        <span>&#10094;</span> Volver
      </button>

      {/* Contenido principal de tu algoritmo */}
      <div className="z-10 text-center">
        <h1 className="text-4xl font-black tracking-wider uppercase mb-4">Traveling Salesman Problem (TSP)</h1>
        <div className="p-6 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl max-w-md">
          <p className="text-gray-300">Espacio de trabajo para la optimización de rutas del torneo.</p>
        </div>
      </div>
    </div>
  );
}