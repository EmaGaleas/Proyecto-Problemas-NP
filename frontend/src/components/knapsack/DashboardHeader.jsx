import { useState } from "react";

export function DashboardHeader({ countries, selected, setSelected }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="flex items-center justify-between px-6 py-3 flex-shrink-0 relative"
      style={{
        background: "rgba(57,9,7,1)",
        borderBottom: "1px solid rgba(191,149,63,0.2)",
      }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <h1
          className="text-4xl leading-none tracking-[0.15em] uppercase"
          style={{ color: "#FCF6BA", fontFamily: "'League Gothic', sans-serif" }}
        >
          KNAPSACK 11 TITULAR
        </h1>
        <p
          className="text-[10px] tracking-[0.5em] uppercase mt-0.5"
          style={{ color: "rgba(191,149,63,0.6)", fontFamily: "'Inter', sans-serif" }}
        >
          PROBLEMA DE OPTIMIZACIÓN
        </p>
      </div>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(33,6,5,1)",
            border: "1px solid rgba(191,149,63,0.35)",
          }}
        >
          <span style={{ color: "#BF953F", fontFamily: "'League Gothic', sans-serif", fontSize: 14, letterSpacing: "0.1em" }}>
            {selected.name}
          </span>
          <span style={{ color: "#BF953F", fontSize: 10 }}>▼</span>
        </button>

        {open && (
          <div
            /* Se cambió overflow-hidden por overflow-y-auto overflow-x-hidden */
            className="absolute right-0 top-full mt-1 rounded-xl overflow-y-auto overflow-x-hidden z-50"
            style={{
              background: "rgba(33,6,5,1)",
              border: "1px solid rgba(191,149,63,0.35)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              minWidth: 160,
              maxHeight: "250px", /* Se agregó una altura máxima para activar el scroll */
            }}
          >
            {countries.map((c) => (
              <button
                key={c.code}
                onClick={() => { setSelected(c); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                style={{
                  background: c.code === selected.code ? "rgba(191,149,63,0.15)" : "transparent",
                  borderBottom: "1px solid rgba(191,149,63,0.08)",
                }}
              >
                <span style={{ color: c.code === selected.code ? "#FCF6BA" : "#BF953F", fontFamily: "'League Gothic', sans-serif", fontSize: 15, letterSpacing: "0.1em" }}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "#BF953F" }}
      />
    </div>
  );
}