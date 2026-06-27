const SPEED_OPTIONS = [
  { label: "0.5×", value: 0.5 },
  { label: "1×", value: 1.0 },
  { label: "2×", value: 2.0 },
  { label: "4×", value: 4.0 },
];

// ── SVG Icon components ────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AnimationControls({
  isPlaying,
  currentStep,
  totalSteps,
  currentCityName,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
}) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const isDone = currentStep >= totalSteps && totalSteps > 0;
  const showSpeed = false;

  return (
    <div style={styles.panel}>
      {/* Title */}
      <div style={styles.header}>
        <span style={styles.title}>Selecciona un punto de partida</span>
      </div>

      {/* Status line */}

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      {/* Playback controls */}
      <div style={styles.controls}>
        {/* Reset */}
        <button
          id="tsp-btn-reset"
          onClick={onReset}
          style={{ ...styles.btn, ...styles.btnSecondary }}
          title="Reset"
        >
          <IconReset />
        </button>

        {/* Play / Pause */}
        {isPlaying ? (
          <button
            id="tsp-btn-pause"
            onClick={onPause}
            style={{ ...styles.btn, ...styles.btnPrimary }}
            title="Pausar"
          >
            <IconPause />
            <span>Pausar</span>
          </button>
        ) : (
          <button
            id="tsp-btn-play"
            onClick={onPlay}
            style={{ ...styles.btn, ...styles.btnPrimary }}
            title="Play"
          >
            <IconPlay />
            <span>{currentStep === 0 ? "Iniciar" : "Reanudar"}</span>
          </button>
        )}
      </div>

      {
        /* Speed selector */
        showSpeed && (
          <div style={styles.speedRow}>
            <span style={styles.speedLabel}>Speed</span>
            <div style={styles.speedBtns}>
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  id={`tsp-speed-${opt.value}`}
                  onClick={() => onSpeedChange(opt.value)}
                  style={{
                    ...styles.speedBtn,
                    ...(speed === opt.value ? styles.speedBtnActive : {}),
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )
      }

      {/* Legend */}
      <div style={styles.legend}>
        {[
          { color: "#EF4444", label: "Inicio" },
          { color: "#FBBF24", label: "Actual" },
          { color: "#22C55E", label: "Visitado" },
          { color: "#6B7280", label: "No Visitado" },
        ].map(({ color, label }) => (
          <div key={label} style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: color }} />
            <span style={styles.legendLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inline styles ──────────────────────────────────────────────────────────

const styles = {
  panel: {
    position: "absolute",
    top: "36px",
    right: "270px",
    width: "230px",
    background: "#e0e0e0ff",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
    zIndex: 100,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  title: {
    fontSize: "12px",
    fontWeight: "700",
    color: "black",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: "11px",
    color: "#94A3B8",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  stepCount: {
    fontSize: "11px",
    color: "#6366F1",
    fontWeight: "600",
    marginLeft: "8px",
    flexShrink: 0,
  },
  progressTrack: {
    height: "4px",
    background: "rgba(99,102,241,0.15)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6366F1, #818CF8)",
    borderRadius: "99px",
    transition: "width 0.3s ease",
    boxShadow: "0 0 8px #6366F1",
  },
  controls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    padding: "8px 12px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  btnPrimary: {
    background: " #4F46E5",
    color: "#fff",
    flex: 1,
    justifyContent: "center",
    boxShadow: "0 0 12px rgba(99,102,241,0.4)",
  },
  btnSecondary: {
    background: "rgba(99,102,241,0.12)",
    color: "#94A3B8",
    border: "1px solid rgba(99,102,241,0.2)",
  },
  speedRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  speedLabel: {
    fontSize: "11px",
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    flexShrink: 0,
  },
  speedBtns: {
    display: "flex",
    gap: "4px",
    flex: 1,
  },
  speedBtn: {
    flex: 1,
    padding: "4px 0",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "6px",
    background: "transparent",
    color: "#64748B",
    fontSize: "11px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  speedBtnActive: {
    background: "rgba(99,102,241,0.2)",
    color: "#818CF8",
    borderColor: "#6366F1",
    boxShadow: "0 0 8px rgba(99,102,241,0.3)",
  },
  legend: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "6px",
    paddingTop: "4px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: "10px",
    color: "#64748B",
    fontWeight: "500",
  },
};
