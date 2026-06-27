export function OutputsPanel({ totalQuality, fatigueUsed, fatigueLimit, isOptimized }) {
  const fatiguePct = fatigueLimit > 0 ? Math.min((fatigueUsed / fatigueLimit) * 100, 100) : 0;

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
            OUTPUTS
          </h2>
          <div className="mt-1 h-px w-12" style={{ background: "#BF953F" }} />
        </div>

        {/* Section title */}
        <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "rgba(252,246,186,0.4)", fontFamily: "'Inter', sans-serif" }}>
          Resultados de Optimización
        </p>

        {/* Total quality */}
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "rgba(33,6,5,1)", border: "1px solid rgba(191,149,63,0.2)" }}
        >
          <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(191,149,63,0.6)", fontFamily: "'Inter', sans-serif" }}>
            Calidad Total del Equipo
          </p>
          <div
            className="leading-none"
            style={{
              color: isOptimized ? "#FCF6BA" : "rgba(252,246,186,0.3)",
              fontFamily: "'League Gothic', sans-serif",
              fontSize: 72,
              transition: "color 0.5s ease",
            }}
          >
            {isOptimized ? totalQuality : "---"}
          </div>
          <p className="text-[9px] mt-1 tracking-widest" style={{ color: "rgba(191,149,63,0.5)", fontFamily: "'Inter', sans-serif" }}>
            PUNTOS DE VALOR TÁCTICO
          </p>
        </div>

        {/* Fatigue bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: "#FCF6BA", fontFamily: "'Inter', sans-serif" }}>
              Fatiga Total Usada
            </p>
            <span style={{ color: "#BF953F", fontFamily: "'League Gothic', sans-serif", fontSize: 15, letterSpacing: "0.05em" }}>
              {isOptimized ? `${fatigueUsed} / ${fatigueLimit}` : `— / ${fatigueLimit}`}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(191,149,63,0.2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: isOptimized ? `${fatiguePct}%` : "0%",
                background: fatiguePct > 90 ? "#8B0000" : "#BF953F",
              }}
            />
          </div>
          <div className="flex justify-between px-1">
            <span className="text-[9px]" style={{ color: "rgba(191,149,63,0.4)", fontFamily: "'Inter', sans-serif" }}>0</span>
            <span className="text-[9px]" style={{ color: "rgba(191,149,63,0.4)", fontFamily: "'Inter', sans-serif" }}>
              {isOptimized ? `${fatiguePct.toFixed(0)}%` : ""}
            </span>
            <span className="text-[9px]" style={{ color: "rgba(191,149,63,0.4)", fontFamily: "'Inter', sans-serif" }}>MAX</span>
          </div>
        </div>

        {/* Formation status */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(33, 6, 5, 1)",
            border: `1px solid ${isOptimized ? "rgba(191,149,63,0.35)" : "rgba(191,149,63,0.12)"}`,
            transition: "border-color 0.5s ease",
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
            style={{
              background: isOptimized ? "#BF953F" : "rgba(0,0,0,0.3)",
              color: isOptimized ? "#1A0A00" : "rgba(191,149,63,0.3)",
              border: "1px solid rgba(191,149,63,0.4)",
            }}
          >
            {isOptimized ? "✓" : "○"}
          </div>
          <div>
            <p style={{ color: isOptimized ? "#FCF6BA" : "rgba(252,246,186,0.3)", fontFamily: "'League Gothic', sans-serif", fontSize: 17, letterSpacing: "0.1em" }}>
              4-3-3 {isOptimized ? "Completado" : "Pendiente"}
            </p>
            <p className="text-[9px]" style={{ color: "rgba(191,149,63,0.5)", fontFamily: "'Inter', sans-serif" }}>
              {isOptimized ? "Formación óptima encontrada" : "Ejecutar optimización"}
            </p>
          </div>
        </div>

        <div className="flex-1" />

      </div>

      {/* Bottom accent bar */}
      <div className="h-0.5 w-full flex-shrink-0" style={{ background: "#BF953F" }} />
    </div>
  );
}