import React, { createContext, useRef, useEffect, useState } from 'react';
import cancionIntroduccion from '../assets/New York New Jersey Theme x FIFA World Cup 26 by Take A Daytrip.mp3';
import himnoFifa from '../assets/The Official FIFA World Cup 26 Theme.mp3';

export const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const nyRef = useRef(null);
  const fifaRef = useRef(null);
  const [fase, setFaseState] = useState('intro'); // 'intro' | 'start' | 'tarjetas'

  // Inicializar audios una sola vez al arrancar la aplicación
  useEffect(() => {
    // 1. Configuración de New York
    const ny = new Audio(cancionIntroduccion);
    ny.loop = true;
    ny.volume = 0.50;
    nyRef.current = ny;

    // 2. Configuración del Himno de la FIFA
    const fifa = new Audio(himnoFifa);
    fifa.loop = true;
    fifa.volume = 0;
    fifaRef.current = fifa;

    const iniciarNewYork = () => {
      if (nyRef.current && nyRef.current.paused) {
        ny.play().catch(() => {});
      }
    };
    
    iniciarNewYork();
    window.addEventListener('click', iniciarNewYork);

    const nyTimer = setTimeout(() => {
      if (nyRef.current) {
        nyRef.current.volume = 0.07;
      }
    }, 8900);

    return () => {
      clearTimeout(nyTimer);
      window.removeEventListener('click', iniciarNewYork);
      ny.pause();
      fifa.pause();
    };
  }, []);

  const setFase = (nuevaFase) => {
    setFaseState(nuevaFase);

    if (nuevaFase === 'tarjetas') {
      // 1. APAGADO ABSOLUTO DE NEW YORK
      if (nyRef.current) {
        nyRef.current.pause();
        nyRef.current.currentTime = 0;
        nyRef.current.src = "";
        nyRef.current = null;
      }

      // 2. REPRODUCCIÓN DEL HIMNO OFICIAL DE LA FIFA
      if (fifaRef.current && fifaRef.current.paused) {
        fifaRef.current.volume = 0.50;
        fifaRef.current.play().catch((err) => console.log("Error al reproducir FIFA:", err));

        setTimeout(() => {
          if (fifaRef.current) {
            fifaRef.current.volume = 0.07;
          }
        }, 2000);
      }
    }
  };

  return (
    <AudioCtx.Provider value={{ fase, setFase }}>
      {children}
    </AudioCtx.Provider>
  );
}