import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../hooks/useAudio';
// Importación de Assets
import logoIntroduccion from '../assets/logo_introduccion.gif';
import fondoLogo from '../assets/main/fondo_logo.png';
import fondoTarjetas from '../assets/main/fondo_tarjetas.png';

import tarjeta0 from '../assets/main/tarjeta_0.png';
import tarjeta1 from '../assets/main/Tarjeta_1.png';
import tarjeta2 from '../assets/main/tarjeta_2.png';

export default function Landing() {
  const { fase, setFase } = useAudio();
  const [tarjetaActual, setTarjetaActual] = useState(0);
  const navigate = useNavigate();

  // Temporizador del GIF coordinado con la fase global
  useEffect(() => {
    if (fase !== 'intro') return;
    const timer = setTimeout(() => {
      setFase('start');
    }, 5000);
    return () => clearTimeout(timer);
  }, [fase, setFase]);

  // Mapeo exacto de tarjetas a sus respectivas rutas configuradas
  const infoTarjetas = [
    { id: 0, img: tarjeta0, ruta: '/knapsack' },
    { id: 1, img: tarjeta1, ruta: '/coloracion-de-grafos' },
    { id: 2, img: tarjeta2, ruta: '/tsp' },
  ];

  const anteriorTarjeta = () => {
    setTarjetaActual((prev) => (prev === 0 ? infoTarjetas.length - 1 : prev - 1));
  };

  const siguienteTarjeta = () => {
    setTarjetaActual((prev) => (prev === infoTarjetas.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative select-none bg-black flex items-center justify-center text-white">
      
      {/* gif inicial */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black z-50 transition-opacity duration-1500 ease-in-out ${
          fase === 'intro' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img 
          src={logoIntroduccion} 
          alt="FIFA Intro" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* pantalla estatica de logo y btn start */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
          fase === 'start' ? 'opacity-100 scale-100 z-30' : 'opacity-0 scale-95 pointer-events-none z-10'
        }`}
        style={{ backgroundImage: `url(${fondoLogo})` }}
      >
        <button
          onClick={() => setFase('tarjetas')} 
          className="
            text-4xl md:text-6xl font-black tracking-widest text-white
            bg-transparent border-none outline-none cursor-pointer
            transition-all duration-300 ease-in-out
            hover:text-transparent hover:bg-clip-text 
            hover:bg-gradient-to-r hover:from-[#BF953F] hover:via-[#FCF6BA] hover:to-[#B38728]
            hover:drop-shadow-[0_0_15px_rgba(252,246,186,0.7)]
          "
        >
          START
        </button>
      </div>

      {/* seccion tarjetas */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center bg-[length:100%_auto] bg-top bg-black bg-no-repeat transition-all duration-1000 ease-in-out ${
          fase === 'tarjetas' ? 'opacity-100 scale-100 z-40' : 'opacity-0 scale-105 pointer-events-none z-10'
        }`}
        style={{ backgroundImage: `url(${fondoTarjetas})` }}
      >
        
        {/* Contenedor del Carrusel */}
        <div className="relative w-full max-w-6xl xl:max-w-7xl h-[80vh] flex items-center justify-center px-4 md:px-20">
          
          {/* Botón Izquierdo */}
          <button 
            onClick={anteriorTarjeta}
            className="absolute left-2 md:left-4 w-14 h-14 rounded-full border border-white/50 bg-black/50 backdrop-blur-md flex items-center justify-center text-2xl text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer z-50 select-none shadow-lg"
          >
            &#10094;
          </button>

          {/* Área del visor de tarjetas */}
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {infoTarjetas.map((tarjeta, index) => (
              <div
                key={tarjeta.id}
                className={`absolute w-full h-full flex items-center justify-center transition-all duration-700 ease-out ${
                  index === tarjetaActual 
                    ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' 
                    : 'opacity-0 translate-x-24 scale-95 pointer-events-none'
                }`}
              >
                {/* Contenedor de la tarjeta modificado */}
                <div className="relative w-full max-w-md md:max-w-2xl xl:max-w-4xl h-[70vh] rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center bg-black">
                  <img 
                    src={tarjeta.img} 
                    alt={`Algoritmo ${index}`} 
                    className="w-full h-full object-contain pointer-events-none " 
                  />
                  
                  {/* Botón GO Dorado */}
                  <button
                    onClick={() => navigate(tarjeta.ruta)}
                    className="
                      absolute bottom-[5%] left-[3%] md:left-[2.5%]
                      w-14 h-14 md:w-16 md:h-16 rounded-full
                      border-2 border-[#BF953F]/70 bg-black/50 backdrop-blur-sm
                      flex items-center justify-center text-[#FCF6BA] text-xl md:text-2xl font-black tracking-wider
                      transition-all duration-300 ease-in-out
                      hover:bg-gradient-to-r hover:from-[#BF953F] hover:via-[#FCF6BA] hover:to-[#B38728]
                      hover:text-black hover:scale-110 hover:border-white
                      hover:shadow-[0_0_25px_rgba(252,246,186,0.7)]
                      cursor-pointer group
                      animate-pulse hover:animate-none z-50"
                    title="Ingresar a la magia del futbol"
                  >
                    <span className="transform transition-transform duration-300 group-hover:scale-105 inline-block font-sans">
                      Go
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Derecho */}
          <button 
            onClick={siguienteTarjeta}
            className="absolute right-2 md:right-4 w-14 h-14 rounded-full border border-white/50 bg-black/50 backdrop-blur-md flex items-center justify-center text-2xl text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer z-50 select-none shadow-lg"
          >
            &#10095;
          </button>

        </div>
      </div>
          
    </div>
  );
}