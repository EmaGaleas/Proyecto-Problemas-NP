import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoMexico from '../assets/mexico/fondo1.png';

// Importación de componentes particionados
import { FASES_CONFIG, btnDoradoBase } from './Grafo/constants';
import FasesPanel from './Grafo/FasesPanel';
import CanvasGrafo from './Grafo/CanvasGrafo';
import ArbitrosPanel from './Grafo/ArbitrosPanel';
import Modales from './Grafo/Modales';

export default function ColoracionGrafos() {
  const navigate = useNavigate();
  
  // Estados Globales API y Configuración
  const [faseSeleccionada, setFaseSeleccionada] = useState(FASES_CONFIG[0]);
  const [limiteArbitros, setLimiteArbitros] = useState(11);
  const [nodos, setNodos] = useState([]);
  const [aristas, setAristas] = useState([]);
  const [tiempoEjecucion, setTiempoEjecucion] = useState(0);
  const [numeroCromatico, setNumeroCromatico] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  // Estados de Modales y Utilidades
  const [arbitroSeleccionadoModal, setArbitroSeleccionadoModal] = useState(null);
  const [modalEstadisticas, setModalEstadisticas] = useState(false);
  const [datosLogs, setDatosLogs] = useState(null);

  const ejecutarAlgoritmoColoracion = async () => {
    setCargando(true);
    setErrorApi(null);
    try {
      const response = await fetch(`http://localhost:8000/coloracion/${faseSeleccionada.endpoint}`);
      if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);
      const data = await response.json();
      
      setNodos(data.nodos_coloreados || []);
      setAristas(data.aristas_conexiones || []);
      setTiempoEjecucion(data.tiempo_ejecucion_ms || 0);
      setNumeroCromatico(data.numero_cromatico_chi || 0);
    } catch (err) {
      setErrorApi("Error de comunicación con el motor de asignación.");
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticasLog = async () => {
    try {
      const response = await fetch(`http://localhost:8000/coloracion/estadisticas`);
      if (response.ok) {
        const data = await response.json();
        setDatosLogs(data);
        setModalEstadisticas(true);
      }
    } catch (err) {
      console.error("Error cargando logs", err);
    }
  };

  useEffect(() => {
    ejecutarAlgoritmoColoracion();
  }, [faseSeleccionada, limiteArbitros]);

  // Cálculos Derivados
  const conteoCargaAsignada = nodos.reduce((acc, nodo) => {
    const idColor = nodo.color?.id;
    if (idColor) acc[idColor] = (acc[idColor] || 0) + 1;
    return acc;
  }, {});
  const esInsuficiente = numeroCromatico > limiteArbitros;

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative select-none bg-[#011206] flex flex-col text-[#FCF6BA] font-sans tracking-wide"
      style={{ backgroundImage: `linear-gradient(rgba(2, 26, 11, 0.95), rgba(1, 16, 6, 0.98)), url(${fondoMexico})`, backgroundSize: 'cover' }}
    >
      {/* CABECERA */}
      <header className="w-full h-24 flex items-center justify-between px-8 bg-[#021f0b]/80 border-b border-[#BF953F]/20 flex-shrink-0 z-10 shadow-lg">
        <button onClick={() => navigate(-1)} className={btnDoradoBase}>
          <span className="text-lg pb-0.5">&#10094;</span> Volver
        </button>
        <div className="flex items-center gap-6">
          <button onClick={cargarEstadisticasLog} className={btnDoradoBase}>
            ESTADÍSTICAS
          </button>
          <div className="text-right">
            <h1 className="text-lg font-bold tracking-widest uppercase text-[#FCF6BA]">Cobertura Arbitral</h1>
            <p className="text-[11px] text-[#BF953F] tracking-widest uppercase font-semibold">Fair Play Sync</p>
          </div>
        </div>
      </header>

      {/* PARAMETRIZACIÓN Y MÉTRICAS */}
      <section className="w-full px-8 py-4 flex items-center justify-between z-10 gap-6">
        <div className="flex bg-[#042f14] p-2 rounded-2xl border border-[#BF953F]/30 shadow-inner flex-1 justify-around items-center">
          <div className="flex items-center gap-3">
            <span className="text-[#BF953F] font-semibold uppercase text-xs">Pool de Árbitros:</span>
            <select 
              value={limiteArbitros} 
              onChange={(e) => setLimiteArbitros(parseInt(e.target.value))}
              className="bg-[#021f0b] border border-[#BF953F]/50 text-[#FCF6BA] font-bold rounded-xl px-3 py-1 outline-none cursor-pointer"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => (
                <option key={n} value={n}>{n} Árbitros</option>
              ))}
            </select>
          </div>
          <div className="h-6 w-px bg-[#BF953F]/30"></div>
          <div className="flex items-center gap-2">
            <span className="text-[#BF953F] uppercase text-xs font-semibold">Complejidad:</span>
            <span className="text-[#FCF6BA] font-bold text-sm bg-[#021f0b] px-3 py-1 rounded-xl border border-[#BF953F]/30">{tiempoEjecucion.toFixed(3)} ms</span>
          </div>
          <div className="h-6 w-px bg-[#BF953F]/30"></div>
          <div className="flex items-center gap-2">
            <span className="text-[#BF953F] uppercase text-xs font-semibold">Número Cromático:</span>
            <span className="text-[#FCF6BA] font-bold text-sm bg-[#021f0b] px-3 py-1 rounded-xl border border-[#BF953F]/30">&chi; = {numeroCromatico}</span>
          </div>
        </div>
        <button onClick={ejecutarAlgoritmoColoracion} className={btnDoradoBase}>
          Recalcular
        </button>
      </section>

      {/* PANEL PRINCIPAL */}
      <main className="flex-1 grid grid-cols-12 gap-6 px-8 pb-6 overflow-hidden z-10">
        <FasesPanel 
          faseSeleccionada={faseSeleccionada} 
          setFaseSeleccionada={setFaseSeleccionada} 
        />
        <CanvasGrafo 
          nodos={nodos} 
          aristas={aristas} 
          cargando={cargando} 
          errorApi={errorApi} 
          esInsuficiente={esInsuficiente} 
          numeroCromatico={numeroCromatico} 
        />
        <ArbitrosPanel 
          limiteArbitros={limiteArbitros} 
          conteoCargaAsignada={conteoCargaAsignada} 
          setArbitroSeleccionadoModal={setArbitroSeleccionadoModal} 
        />
      </main>

      <Modales 
        arbitroSeleccionadoModal={arbitroSeleccionadoModal}
        setArbitroSeleccionadoModal={setArbitroSeleccionadoModal}
        modalEstadisticas={modalEstadisticas}
        setModalEstadisticas={setModalEstadisticas}
        datosLogs={datosLogs}
      />
    </div>
  );
}