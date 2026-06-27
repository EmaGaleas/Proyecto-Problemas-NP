import React from 'react';
import { FASES_CONFIG } from './constants';
import mascotaLeft from '../../assets/mexico/mascota.png';

export default function FasesPanel({ faseSeleccionada, setFaseSeleccionada }) {
  return (
    <section className="col-span-3 bg-[#042f14] border border-[#BF953F]/30 rounded-3xl flex flex-col overflow-hidden h-full shadow-xl relative">
      <img 
        src={mascotaLeft} 
        alt="Mascota" 
        className="absolute pointer-events-none select-none opacity-[0.05] bottom-0 right-0 w-56 object-contain z-0" 
      />
      <div className="px-5 py-4 bg-[#021f0b]/50 border-b border-[#BF953F]/20 z-10 relative">
        <h2 className="text-xs font-bold tracking-widest text-[#FCF6BA] uppercase">Segmentación</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 z-10 relative">
        {FASES_CONFIG.map((fase) => {
          const activo = faseSeleccionada.id === fase.id;
          return (
            <button
              key={fase.id}
              onClick={() => setFaseSeleccionada(fase)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all text-left ${
                activo ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black font-bold shadow-md scale-[1.02]' : 'text-emerald-100/70 hover:bg-[#021f0b] border border-transparent hover:border-[#BF953F]/30'
              }`}
            >
              <span>{fase.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activo ? 'bg-black/20' : 'bg-black/40'}`}>
                {fase.matchesCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}