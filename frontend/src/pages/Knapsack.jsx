import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import fondoCanada from '../assets/canada/fondo1.png';

import { DashboardHeader } from "../components/knapsack/DashboardHeader";
import { InputsPanel } from "../components/knapsack/InputsPanel";
import { TacticalField } from "../components/knapsack/TacticalField";
import { OutputsPanel } from "../components/knapsack/OutputsPanel";

const COUNTRIES = [
  { code: "DE", name: "Alemania" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Bélgica" },
  { code: "BA", name: "Bosnia y Herzegovina" },
  { code: "BR", name: "Brasil" },
  { code: "CV", name: "Cabo Verde" },
  { code: "CA", name: "Canadá" },
  { code: "CO", name: "Colombia" },
  { code: "CI", name: "Costa de Marfil" },
  { code: "HR", name: "Croacia" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egipto" },
  { code: "ES", name: "España" },
  { code: "US", name: "Estados Unidos" },
  { code: "FR", name: "Francia" },
  { code: "GH", name: "Ghana" },
  { code: "GB", name: "Inglaterra" },
  { code: "IR", name: "Irán" },
  { code: "JP", name: "Japón" },
  { code: "MA", name: "Marruecos" },
  { code: "MX", name: "México" },
  { code: "NO", name: "Noruega" },
  { code: "NL", name: "Países Bajos" },
  { code: "PY", name: "Paraguay" },
  { code: "PT", name: "Portugal" },
  { code: "CD", name: "República Democrática del Congo" },
  { code: "ZA", name: "Sudáfrica" },
  { code: "SE", name: "Suecia" },
  { code: "CH", name: "Suiza" },
  { code: "UY", name: "Uruguay" },
];

export default function Knapsack() {
  const navigate = useNavigate();

  // Estados
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [fatigueLimit, setFatigueLimit] = useState(450);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [totalQuality, setTotalQuality] = useState(0);
  const [fatigueUsed, setFatigueUsed] = useState(0);
  const [plantilla, setPlantilla] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setIsOptimized(false);
    setErrorMsg("");

    try {
      // Petición al backend con Axios 
      const response = await axios.post("http://localhost:8000/knapsack/optimize", {
        pais: selectedCountry.name,
        limite_fatiga: fatigueLimit
      });

      const data = response.data;
      setTotalQuality(data.valor_tactico_total);
      setFatigueUsed(data.desgaste_total_consumido);
      setPlantilla(data.plantilla);
      setIsOptimized(true);

    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.detail || "Error al optimizar el equipo.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative select-none bg-black flex flex-col text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${fondoCanada})` }}
    >
      <div className="relative z-10 flex flex-col h-full">
        
        <div className="relative w-full">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 px-5 py-2.5 rounded-full border border-[#BF953F]/60 bg-black/40 backdrop-blur-md text-[#FCF6BA] font-medium tracking-wide flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#BF953F] hover:via-[#FCF6BA] hover:to-[#B38728] hover:text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(252,246,186,0.4)] cursor-pointer"
          >
            <span>&#10094;</span> Volver
          </button>

          {/* Pasamos estados por Props */}
          <DashboardHeader 
            countries={COUNTRIES} 
            selected={selectedCountry} 
            setSelected={setSelectedCountry} 
          />
        </div>

        {errorMsg && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-900/80 text-red-200 px-6 py-2 rounded border border-red-500 z-50">
              {errorMsg}
            </div>
        )}

        <div className="flex flex-1 gap-3 p-3 min-h-0 mt-2">
          <div className="w-64 flex-shrink-0">
            <InputsPanel
              fatigueLimit={fatigueLimit}
              onFatigueChange={setFatigueLimit}
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Pasamos los jugadores que llegaron del backend */}
            <TacticalField players={plantilla} isOptimized={isOptimized} />
          </div>

          <div className="w-64 flex-shrink-0">
            <OutputsPanel
              totalQuality={totalQuality}
              fatigueUsed={fatigueUsed}
              fatigueLimit={fatigueLimit}
              isOptimized={isOptimized}
            />
          </div>
        </div>
      </div>
    </div>
  );
}