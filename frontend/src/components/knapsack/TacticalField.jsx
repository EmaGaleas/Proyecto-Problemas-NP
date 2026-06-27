import canchaFoto from "../../assets/knapsack/CanchaFoto.png";
import { PlayerCard } from "./PlayerCard";

export function TacticalField({ players = [], isOptimized }) {
  
  // Función para acomodar a los jugadores en su posición visual 4-3-3
  const getPlayersWithCoordinates = () => {
    let counters = { PO: 0, DF: 0, MC: 0, DC: 0 };
    
    // Coordenadas X basadas en la cantidad de jugadores por línea
    const dfX = [10, 34, 66, 90]; 
    const mcX = [18, 50, 82];
    const dcX = [18, 50, 82];

    return players.map(p => {
      let x = 50, y = 50;

      if (p.posicion === 'PO') {
        x = 50; y = 87; 
        counters.PO++;
      } else if (p.posicion === 'DF') {
        x = dfX[counters.DF]; y = 63; 
        counters.DF++;
      } else if (p.posicion === 'MC') {
        x = mcX[counters.MC]; y = 38; 
        counters.MC++;
      } else if (p.posicion === 'DC') {
        x = dcX[counters.DC]; y = 14; 
        counters.DC++;
      }

      return { ...p, x, y };
    });
  };

  const playersOnField = getPlayersWithCoordinates();

  return (
    <div className="flex flex-col h-full">
      <div className="text-center py-2 flex-shrink-0">
        <p
          className="text-xs font-semibold tracking-[0.25em] uppercase"
          style={{ color: "rgba(252,246,186,0.5)", fontFamily: "'Inter', sans-serif" }}
        >
          CAMPO TÁCTICO
        </p>
        <h2
          className="text-3xl tracking-[0.3em] uppercase"
          style={{ color: "#BF953F", fontFamily: "'League Gothic', sans-serif" }}
        >
          4 — 3 — 3
        </h2>
      </div>

      <div className="relative flex-1 mx-3 mb-3 rounded-xl overflow-hidden" style={{ minHeight: 0 }}>
        <div className="absolute inset-0" style={{ background: "#080008" }} />
        
        <img
          src={canchaFoto}
          alt="Campo de fútbol"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.18, mixBlendMode: "screen" }}
        />

        {/* Mensaje de espera si aún no se optimiza */}
        {!isOptimized && playersOnField.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <p className="text-[#BF953F]/60 tracking-widest text-sm uppercase">Presiona optimizar para generar el equipo</p>
          </div>
        )}

        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {playersOnField.map((p) => (
            <PlayerCard
              key={p.id_jugador || p.nombre}
              name={p.nombre}
              position={p.posicion}
              tactic={p.valor_tactico}
              fatigue={p.desgaste}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}