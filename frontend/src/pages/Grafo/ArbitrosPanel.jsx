import React from 'react';
import { ARBITROS_RECURSOS } from './constants';

export default function ArbitrosPanel({ limiteArbitros, conteoCargaAsignada, setArbitroSeleccionadoModal }) {
  return (
    <section className="col-span-3 bg-[#042f14] border border-[#BF953F]/30 rounded-3xl flex flex-col overflow-hidden h-full shadow-xl">
      <div className="px-5 py-4 bg-[#021f0b]/50 border-b border-[#BF953F]/20">
        <h2 className="text-xs font-bold tracking-widest text-[#FCF6BA] uppercase">Árbitros Disponibles</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 cursor-pointer">
        {Object.entries(ARBITROS_RECURSOS).map(([idStr, info]) => {
          const id = parseInt(idStr);
          if (id > limiteArbitros) return null;

          const partidosUsados = conteoCargaAsignada[id] || 0;
          const sobrepasado = partidosUsados > info.maxMatches;

          return (
            <div 
              key={id} 
              onClick={() => setArbitroSeleccionadoModal(info)}
              className="bg-[#021f0b]/70 border-2 rounded-2xl p-3 flex items-center justify-between transition-colors hover:bg-[#03290e]"
              style={{ borderColor: info.color }}
            >
              <div>
                <div className="font-bold text-[#FCF6BA] text-xs mb-1">{info.name}</div>
                <div className="text-[10px] text-emerald-200/60 uppercase">{info.country} · Max: {info.maxMatches}</div>
              </div>
              <div className={`text-center font-bold px-3 py-1 rounded-xl text-xs ${sobrepasado ? 'bg-red-900/50 text-red-300 border border-red-500/50' : 'bg-[#043316] text-[#BF953F] border border-[#BF953F]/30'}`}>
                {partidosUsados} / {info.maxMatches}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}