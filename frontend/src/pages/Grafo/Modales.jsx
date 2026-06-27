import React from 'react';

export default function Modales({ 
  arbitroSeleccionadoModal, 
  setArbitroSeleccionadoModal, 
  modalEstadisticas, 
  setModalEstadisticas, 
  datosLogs 
}) {
  // Cálculos estadísticos
  const latenciaPromedio = datosLogs?.logs?.length 
    ? (datosLogs.logs.reduce((acc, curr) => acc + curr.tiempo_ejecucion_ms, 0) / datosLogs.logs.length).toFixed(3)
    : 0;

  // Extraer los últimos 20 logs para el histograma
  const ultimos20Logs = datosLogs?.logs?.slice(-20) || [];
  
  // Encontrar el valor máximo para calcular los porcentajes de altura de las barras
  const maxLatencia = ultimos20Logs.length > 0 
    ? Math.max(...ultimos20Logs.map(l => l.tiempo_ejecucion_ms)) 
    : 1;

  return (
    <>
      {/* MODAL DE FOTO DEL ÁRBITRO */}
      {arbitroSeleccionadoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <button 
            onClick={() => setArbitroSeleccionadoModal(null)}
            className="absolute top-6 right-8 text-[#FCF6BA] hover:text-[#BF953F] text-4xl font-light cursor-pointer transition-colors z-50 select-none"
          >
            ✕
          </button>
          <img 
            src={arbitroSeleccionadoModal.img} 
            alt={arbitroSeleccionadoModal.name} 
            className="max-w-[85vw] max-h-[85vh] object-contain rounded shadow-2xl select-none"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* MODAL DE ESTADÍSTICAS CON HISTOGRAMA */}
      {modalEstadisticas && datosLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Se amplió un poco el ancho a w-[650px] para que las 20 barras respiren mejor */}
          <div className="bg-[#042f14] border-2 border-[#BF953F] rounded-3xl w-[650px] shadow-2xl flex flex-col overflow-hidden">
            
            <div className="px-6 py-4 bg-[#021f0b] border-b border-[#BF953F]/30 flex justify-between items-center">
              <span className="text-[#FCF6BA] font-bold uppercase text-sm">Historial de Rendimiento</span>
              <button onClick={() => setModalEstadisticas(false)} className="text-[#BF953F] hover:text-[#FCF6BA] transition-colors font-bold text-lg">✕</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Tarjetas de Resumen */}
              <div className="bg-[#021a08] p-4 rounded-2xl border border-[#BF953F]/20 flex justify-between items-center text-center">
                <div className="flex-1">
                  <div className="text-xs text-emerald-200/70 uppercase mb-1">Total Ejecuciones</div>
                  <div className="text-2xl font-bold text-[#FCF6BA]">{datosLogs.total_ejecuciones}</div>
                </div>
                <div className="w-px h-12 bg-[#BF953F]/30"></div>
                <div className="flex-1">
                  <div className="text-xs text-emerald-200/70 uppercase mb-1">Latencia Promedio</div>
                  <div className="text-2xl font-bold text-[#BF953F]">{latenciaPromedio} ms</div>
                </div>
              </div>

              {/* Histograma */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="text-[#FCF6BA] font-semibold text-xs uppercase">
                    Comportamiento (Últimos 20)
                  </h4>
                  <span className="text-[10px] text-emerald-200/50 uppercase border border-[#BF953F]/30 px-2 py-0.5 rounded-full">
                    Pico: {maxLatencia.toFixed(2)} ms
                  </span>
                </div>
                
                {/* Contenedor del Gráfico */}
                <div className="bg-[#021f0b] p-4 rounded-xl border border-emerald-800/50 h-48 flex flex-col justify-end">
                  {ultimos20Logs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-emerald-200/50 text-xs uppercase">
                      Sin datos suficientes
                    </div>
                  ) : (
                    <>
                      {/* Barras */}
                      <div className="flex items-end justify-between h-full gap-1 w-full">
                        {ultimos20Logs.map((log, index) => {
                          // Calcular altura porcentual (con un mínimo de 5% para que barras pequeñas sean visibles)
                          const alturaPorcentaje = Math.max(5, (log.tiempo_ejecucion_ms / maxLatencia) * 100);
                          
                          return (
                            <div 
                              key={index} 
                              className="relative flex-1 bg-gradient-to-t from-[#B38728] to-[#FCF6BA] rounded-t-sm hover:brightness-125 transition-all cursor-crosshair group opacity-90 hover:opacity-100"
                              style={{ height: `${alturaPorcentaje}%` }}
                            >
                              {/* Tooltip Hover */}
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#011206] border border-[#BF953F] text-[#FCF6BA] text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg text-center">
                                <span className="font-bold">{log.tiempo_ejecucion_ms.toFixed(3)} ms</span>
                                <div className="text-emerald-300/70 mt-0.5 text-[8px]">
                                  {log.fecha_hora.split(' ')[1] || log.fecha_hora}
                                </div>
                                {/* Triángulo del tooltip */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#BF953F]"></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Línea Base (Eje X) */}
                      <div className="w-full h-px bg-[#BF953F]/50 mt-1"></div>
                      
                      {/* Etiquetas Eje X */}
                      <div className="flex justify-between text-[9px] text-emerald-200/50 mt-1.5 uppercase font-mono tracking-widest">
                        <span>Más Antiguos</span>
                        <span>Más Recientes</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}