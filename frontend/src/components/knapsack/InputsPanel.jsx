export function InputsPanel({ fatigueLimit, onFatigueChange, onOptimize, isOptimizing }) {
  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(57, 9, 7, 1)",
        border: "1px solid rgba(191,149,63,0.25)",
      }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full flex-shrink-0" style={{ background: "#BF953F" }} />

      <div className="flex flex-col flex-1 px-5 py-4 gap-5 overflow-auto">
        {/* Title */}
        <div>
          <p className="text-[10px] tracking-[0.3em]" style={{ color: "rgba(252,246,186,0.4)", fontFamily: "'Inter', sans-serif" }}>
            PANEL DE
          </p>
          <h2
            className="text-4xl tracking-[0.15em] uppercase leading-tight"
            style={{ color: "#BF953F", fontFamily: "'League Gothic', sans-serif" }}
          >
            INPUTS
          </h2>
          <div className="mt-1 h-px w-12" style={{ background: "#BF953F" }} />
        </div>

        {/* Fatigue control */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: "#FCF6BA", fontFamily: "'Inter', sans-serif" }}
          >
            Límite de Fatiga Máxima
          </p>

          {/* Large value display */}
          <div
            className="text-center py-3 rounded-xl"
            style={{ background: "rgba(33,6,5,1)", border: "1px solid rgba(33,6,5,1)" }}
          >
            <span
              className="leading-none"
              style={{ color: "#FCF6BA", fontFamily: "'League Gothic', sans-serif", fontSize: 64 }}
            >
              {fatigueLimit}
            </span>
            <p className="text-[10px] mt-1 tracking-[0.2em]" style={{ color: "rgba(191,149,63,0.6)", fontFamily: "'Inter', sans-serif" }}>
              UNIDADES DE FATIGA
            </p>
          </div>

          {/* Slider track */}
          <div className="relative px-1">
            <div
              className="relative h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(191,149,63,0.2)" }}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                style={{ width: `${(fatigueLimit / 700) * 100}%`, background: "#BF953F" }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={700}
              step={5}
              value={fatigueLimit}
              onChange={(e) => onFatigueChange(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-2 top-0"
              style={{ zIndex: 10 }}
            />
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-[#FCF6BA] pointer-events-none transition-all duration-150"
              style={{
                left: `calc(${(fatigueLimit / 700) * 100}% - 8px)`,
                background: "#BF953F",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          {/* Min / Max labels */}
          <div className="flex justify-between px-1">
            <span className="text-[10px]" style={{ color: "rgba(191,149,63,0.5)", fontFamily: "'Inter', sans-serif" }}>0</span>
            <span className="text-[10px]" style={{ color: "rgba(191,149,63,0.5)", fontFamily: "'Inter', sans-serif" }}>700</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: "rgba(191,149,63,0.3)" }} />

        <div className="flex-1" />

        {/* Optimize button */}
        <button
          onClick={onOptimize}
          disabled={isOptimizing}
          className="w-full py-3.5 rounded-xl tracking-[0.2em] uppercase transition-all duration-300"
          style={{
            background: isOptimizing ? "rgba(191,149,63,0.3)" : "#BF953F",
            color: isOptimizing ? "#BF953F" : "#1A0A00",
            fontFamily: "'League Gothic', sans-serif",
            fontSize: 20,
            letterSpacing: "0.2em",
            border: "1px solid rgba(252,246,186,0.4)",
          }}
        >
          {isOptimizing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-[#BF953F] border-t-transparent animate-spin" />
              Optimizando...
            </span>
          ) : (
            "Optimizar Equipo"
          )}
        </button>
      </div>

      {/* Bottom accent bar */}
      <div className="h-0.5 w-full flex-shrink-0" style={{ background: "#BF953F" }} />
    </div>
  );
}