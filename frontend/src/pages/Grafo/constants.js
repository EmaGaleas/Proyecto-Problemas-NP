// Importación de imágenes estáticas
import imgMarciniak from '../../assets/coloracion/arbitros/Szymon_Marciniak.png';
import imgBarton from '../../assets/coloracion/arbitros/Ivan_Barton.png';
import imgMartinez from '../../assets/coloracion/arbitros/Said_Martínez.png';
import imgValenzuela from '../../assets/coloracion/arbitros/Jesus_Valenzuela.png';
import imgKovacs from '../../assets/coloracion/arbitros/Istvan_Kovacs.png';
import imgVincic from '../../assets/coloracion/arbitros/Slavko_Vincic.png';
import imgGaray from '../../assets/coloracion/arbitros/Cristian_Garay.png';
import imgBeida from '../../assets/coloracion/arbitros/Dahane_Beida.png';
import imgAlJassim from '../../assets/coloracion/arbitros/Abdulrahman_Al_Jassim.png';
import imgMakhadmeh from '../../assets/coloracion/arbitros/Adham_Makhadmeh.png';
import imgMaNing from '../../assets/coloracion/arbitros/Ma_Ning.png';

export const ARBITROS_RECURSOS = {
  1: { name: "Szymon Marciniak", country: "POL", maxMatches: 4, color: "#22c55e", img: imgMarciniak },
  2: { name: "Ivan Barton", country: "SLV", maxMatches: 4, color: "#ef4444", img: imgBarton },
  3: { name: "Saíd Martínez", country: "HON", maxMatches: 4, color: "#3b82f6", img: imgMartinez },
  4: { name: "Jesús Valenzuela", country: "VEN", maxMatches: 4, color: "#a855f7", img: imgValenzuela },
  5: { name: "Istvan Kovacs", country: "ROU", maxMatches: 3, color: "#eab308", img: imgKovacs },
  6: { name: "Slavko Vincic", country: "SVN", maxMatches: 3, color: "#14b8a6", img: imgVincic },
  7: { name: "Cristian Garay", country: "CHI", maxMatches: 3, color: "#f97316", img: imgGaray },
  8: { name: "Dahane Beida", country: "MTN", maxMatches: 3, color: "#84cc16", img: imgBeida },
  9: { name: "Abdulrahman Al-Jassim", country: "QAT", maxMatches: 3, color: "#cbd5e1", img: imgAlJassim }, // Plateado
  10: { name: "Adham Makhadmeh", country: "JOR", maxMatches: 3, color: "#06b6d4", img: imgMakhadmeh }, // Cambiado a Cian brillante
  11: { name: "Ma Ning", country: "CHN", maxMatches: 3, color: "#f43f5e", img: imgMaNing }
};

export const FASES_CONFIG = [
  { id: "Todo", endpoint: "pura", label: "Todas las Fases", matchesCount: 32 },
  { id: "Dieciseisavos", endpoint: "fase/dieciseisavos", label: "Dieciseisavos", matchesCount: 16 },
  { id: "Octavos", endpoint: "fase/octavos", label: "Octavos", matchesCount: 8 },
  { id: "Cuartos", endpoint: "fase/cuartos", label: "Cuartos", matchesCount: 4 },
  { id: "Semifinales", endpoint: "fase/semifinales", label: "Semifinales", matchesCount: 2 },
  { id: "Final", endpoint: "fase/final", label: "Final + 3er Puesto", matchesCount: 2 }
];

export const btnDoradoBase = "px-5 py-2.5 rounded-full border border-[#BF953F]/60 bg-[#021a08]/60 backdrop-blur-md text-[#FCF6BA] font-medium tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#BF953F] hover:via-[#FCF6BA] hover:to-[#B38728] hover:text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(252,246,186,0.4)] cursor-pointer text-xs uppercase select-none";