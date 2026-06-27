import React, { useState, useEffect, useRef } from 'react';
import { ARBITROS_RECURSOS } from './constants';

export default function CanvasGrafo({ nodos, aristas, cargando, errorApi, esInsuficiente, numeroCromatico }) {
  const canvasRef = useRef(null);
  const [nodoInteractivo, setNodoInteractivo] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedDistance, setDraggedDistance] = useState(0);

  // Reiniciar vista al cambiar de nodos
  useEffect(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
    setNodoInteractivo(null);
  }, [nodos]);

  // Dibujado
  useEffect(() => {
    if (cargando || errorApi || nodos.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    const centroX = width / 2;
    const centroY = height / 2;
    const radioGrafo = Math.min(width, height) * 0.38;

    const posicionesNodos = {};
    nodos.forEach((nodo, i) => {
      const angulo = (i * 2 * Math.PI) / nodos.length;
      posicionesNodos[nodo.id_nodo] = {
        x: centroX + radioGrafo * Math.cos(angulo),
        y: centroY + radioGrafo * Math.sin(angulo)
      };
    });

    aristas.forEach((arista) => {
      const posDesde = posicionesNodos[arista.desde];
      const posHasta = posicionesNodos[arista.hasta];
      if (posDesde && posHasta) {
        ctx.beginPath();
        ctx.moveTo(posDesde.x, posDesde.y);
        ctx.lineTo(posHasta.x, posHasta.y);
        if (nodoInteractivo && (nodoInteractivo.id_nodo === arista.desde || nodoInteractivo.id_nodo === arista.hasta)) {
          ctx.strokeStyle = '#BF953F';
          ctx.lineWidth = 2.5 / transform.scale; 
        } else {
          ctx.strokeStyle = 'rgba(191, 149, 63, 0.2)';
          ctx.lineWidth = 1 / transform.scale;
        }
        ctx.stroke();
      }
    });

    nodos.forEach((nodo) => {
      const pos = posicionesNodos[nodo.id_nodo];
      if (!pos) return;
      const arbitroMeta = ARBITROS_RECURSOS[nodo.color?.id];
      const colorBase = arbitroMeta ? arbitroMeta.color : '#4b5563';
      const esActivo = nodoInteractivo && nodoInteractivo.id_nodo === nodo.id_nodo;

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, esActivo ? 16 / transform.scale : 12 / transform.scale, 0, 2 * Math.PI);
      ctx.fillStyle = colorBase;
      ctx.fill();
      ctx.strokeStyle = esActivo ? '#FCF6BA' : '#011206';
      ctx.lineWidth = 2.5 / transform.scale;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${10 / transform.scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nodo.id_nodo.toString(), pos.x, pos.y);
    });
    ctx.restore();
  }, [nodos, aristas, nodoInteractivo, transform, cargando, errorApi]);

  // Función para obtener coordenadas exactas del mouse considerando el escalado del CSS
  const getMouseCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleWheel = (e) => {
    if (!canvasRef.current) return;
    const { x: mouseX, y: mouseY } = getMouseCoords(e);
    const zoomSensitivity = 0.002;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.5, transform.scale + delta), 4);
    const scaleRatio = newScale / transform.scale;
    const newX = mouseX - (mouseX - transform.x) * scaleRatio;
    const newY = mouseY - (mouseY - transform.y) * scaleRatio;
    setTransform({ x: newX, y: newY, scale: newScale });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDraggedDistance(0);
    const { x: mouseX, y: mouseY } = getMouseCoords(e);
    setDragStart({ x: mouseX - transform.x, y: mouseY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current || nodos.length === 0) return;
    const { x: mouseX, y: mouseY } = getMouseCoords(e);

    if (isDragging) {
      setDraggedDistance(prev => prev + 1);
      setTransform({ ...transform, x: mouseX - dragStart.x, y: mouseY - dragStart.y });
    } else {
      const logicX = (mouseX - transform.x) / transform.scale;
      const logicY = (mouseY - transform.y) / transform.scale;
      const centroX = canvasRef.current.width / 2;
      const centroY = canvasRef.current.height / 2;
      const radioGrafo = Math.min(canvasRef.current.width, canvasRef.current.height) * 0.38;

      let encontrado = null;
      nodos.forEach((nodo, i) => {
        const angulo = (i * 2 * Math.PI) / nodos.length;
        const nx = centroX + radioGrafo * Math.cos(angulo);
        const ny = centroY + radioGrafo * Math.sin(angulo);
        const distancia = Math.sqrt((logicX - nx) ** 2 + (logicY - ny) ** 2);
        if (distancia < (18 / transform.scale)) {
          encontrado = nodo;
        }
      });
      if (encontrado?.id_nodo !== nodoInteractivo?.id_nodo) {
        setNodoInteractivo(encontrado);
      }
    }
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    if (draggedDistance < 5 && canvasRef.current) {
      const { x: mouseX, y: mouseY } = getMouseCoords(e);
      const logicX = (mouseX - transform.x) / transform.scale;
      const logicY = (mouseY - transform.y) / transform.scale;
      const centroX = canvasRef.current.width / 2;
      const centroY = canvasRef.current.height / 2;
      const radioGrafo = Math.min(canvasRef.current.width, canvasRef.current.height) * 0.38;

      let encontrado = null;
      nodos.forEach((nodo, i) => {
        const angulo = (i * 2 * Math.PI) / nodos.length;
        const nx = centroX + radioGrafo * Math.cos(angulo);
        const ny = centroY + radioGrafo * Math.sin(angulo);
        const distancia = Math.sqrt((logicX - nx) ** 2 + (logicY - ny) ** 2);
        if (distancia < (18 / transform.scale)) {
          encontrado = nodo;
        }
      });
      setNodoInteractivo(encontrado);
    }
  };

  return (
    <section className="col-span-6 bg-[#042f14] border border-[#BF953F]/30 rounded-3xl flex flex-col overflow-hidden h-full shadow-xl relative">
      <div className="px-5 py-4 bg-[#021f0b]/50 border-b border-[#BF953F]/20 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xs font-bold tracking-widest text-[#FCF6BA] uppercase">Lista de Adyacencia</h2>
          
        </div>
        <p className="text-[10px] text-emerald-200/60 uppercase font-mono tracking-wide">
          * Cada línea (arista) representa un conflicto físico: Partidos jugados el mismo día o con menos de 72 horas de descanso para viajar.
        </p>
      </div>

      <div className="flex-1 relative flex flex-col p-4">
        {cargando ? (
          <div className="h-full flex items-center justify-center text-[#BF953F] animate-pulse">Calculando transformaciones afines...</div>
        ) : errorApi ? (
          <div className="h-full flex items-center justify-center text-red-400">{errorApi}</div>
        ) : esInsuficiente ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <span className="text-3xl mb-2 text-red-500">⚠️</span>
            <h4 className="text-[#FCF6BA] font-bold uppercase tracking-widest">Capacidad Insuficiente</h4>
            <p className="text-sm text-emerald-200/70 max-w-sm mt-2">
              El grafo requiere un mínimo estricto de &chi; = {numeroCromatico} árbitros disponibles.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col relative bg-[#021a08]/30 rounded-2xl border border-emerald-900/30 overflow-hidden cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={600}
              height={350}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { setIsDragging(false); setNodoInteractivo(null); }}
              className="w-full h-full block"
            />

            <div className={`absolute bottom-4 left-4 right-4 bg-[#053d1a]/95 backdrop-blur-md border border-[#BF953F]/50 rounded-2xl p-4 shadow-lg transition-all duration-300 ${nodoInteractivo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              {nodoInteractivo && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[#FCF6BA] font-bold text-sm uppercase mb-1">{nodoInteractivo.nombre}</div>
                    <div className="text-xs text-emerald-100/80">
                      Vértice {nodoInteractivo.id_nodo} — {nodoInteractivo.ciudad} <span className="text-[#BF953F]">({nodoInteractivo.fecha})</span>
                    </div>
                  </div>
                  <div className="text-right bg-[#021f0b] px-4 py-2 rounded-xl border border-[#BF953F]/20">
                    <span className="text-[10px] text-emerald-300/60 block uppercase mb-1 font-semibold">Árbitro Designado</span>
                    <span className="font-bold text-sm drop-shadow-md" style={{ color: ARBITROS_RECURSOS[nodoInteractivo.color?.id]?.color }}>
                      {ARBITROS_RECURSOS[nodoInteractivo.color?.id]?.name || "Conflicto"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="absolute top-4 left-4 bg-[#021f0b]/80 border border-[#BF953F]/30 px-2 py-1 rounded text-[9px] text-[#BF953F] font-mono pointer-events-none">
              ZOOM: {Math.round(transform.scale * 100)}%
            </div>
          </div>
        )}
      </div>
    </section>
  );
}