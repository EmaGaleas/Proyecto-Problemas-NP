import { ImageWithFallback } from "./ImageWithFallback";
import jugadorFoto from '../../assets/knapsack/JugadorFoto.png';

export function PlayerCard({ name, position, tactic, fatigue, style }) {
  return (
    <div
      className="absolute flex flex-col items-center cursor-default select-none group"
      style={{ transform: "translate(-50%, -50%)", ...style }}
    >
      {/* Connection dot */}
      <div
        className="absolute w-2 h-2 rounded-full z-0"
        style={{ background: "#BF953F", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
      />

      {/* Card */}
      <div
        className="relative rounded-lg overflow-hidden transition-transform duration-200 group-hover:scale-110 z-10"
        style={{
          width: 70,
          background: "rgba(57,9,7,1)",
          border: "1.5px solid #BF953F",
        }}
      >
        {/* Position badge */}
        <div
          className="absolute top-1 left-1 z-20 text-[7px] font-black text-black px-1 py-0.5 rounded-sm leading-none"
          style={{ background: "#BF953F" }}
        >
          {position}
        </div>

        {/* Top bar */}
        <div className="h-0.5 w-full" style={{ background: "#BF953F" }} />

        {/* Photo area */}
        <div
          className="mx-auto mt-1 overflow-hidden rounded"
          style={{ width: 54, height: 48, border: "1px solid rgba(191,149,63,0.4)" }}
        >
          <ImageWithFallback
            src={jugadorFoto}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <p
          className="text-center font-bold leading-tight truncate px-1 mt-0.5"
          style={{ fontSize: 8, color: "#FCF6BA", fontFamily: "'League Gothic', sans-serif" }}
        >
          {name}
        </p>

        {/* Divider */}
        <div className="mx-2 my-0.5 h-px" style={{ background: "rgba(191,149,63,0.3)" }} />

        {/* Stats */}
        <div className="flex justify-between items-center px-1.5 pb-1.5">
          <div className="flex flex-col items-center">
            <span style={{ fontSize: 9, color: "#BF953F", fontWeight: 700, fontFamily: "'League Gothic', sans-serif" }}>{tactic}</span>
            <span style={{ fontSize: 6, color: "rgba(252,246,186,0.5)", fontFamily: "'League Gothic', sans-serif" }}>VALOR</span>
          </div>
          <div className="h-4 w-px" style={{ background: "rgba(191,149,63,0.3)" }} />
          <div className="flex flex-col items-center">
            <span style={{ fontSize: 9, color: "#BF953F", fontWeight: 700, fontFamily: "'League Gothic', sans-serif" }}>{fatigue}</span>
            <span style={{ fontSize: 6, color: "rgba(252,246,186,0.5)", fontFamily: "'League Gothic', sans-serif" }}>FATIGA</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-0.5 w-full" style={{ background: "#BF953F" }} />
      </div>
    </div>
  );
}