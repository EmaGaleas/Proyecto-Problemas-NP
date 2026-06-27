const STATE_COLORS = {
  default: {
    fill: "#374151",
    stroke: "#6B7280",
    glow: "none",
    label: "#9CA3AF",
  },
  current: {
    fill: "#78350F",
    stroke: "#FBBF24",
    glow: "#FBBF24",
    label: "#FDE68A",
  },
  visited: {
    fill: "#052E16",
    stroke: "#22C55E",
    glow: "#22C55E",
    label: "#86EFAC",
  },
  start: {
    fill: "#450A0A",
    stroke: "#EF4444",
    glow: "#EF4444",
    label: "#FCA5A5",
  },
};

const NODE_RADIUS = 8;
const LABEL_OFFSET_X = 12;
const LABEL_OFFSET_Y = 4;

export default function CityNode({ city, state = "default", onClick }) {
  const colors = STATE_COLORS[state] ?? STATE_COLORS.default;
  const hasGlow = colors.glow !== "none";
  const filterId = `glow-${city.id}-${state}`;

  const handleClick = () => {
    if (onClick) {
      onClick(city.id);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <g
      className="tsp-city-node"
      style={{
        transition: "all 0.35s ease",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? `Select ${city.name}` : undefined}
    >
      {/* Glow filter definition */}
      {hasGlow && (
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feFlood
              floodColor={colors.glow}
              floodOpacity="0.8"
              result="color"
            />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}

      {/* Outer pulse ring for active states */}
      {(state === "current" || state === "start") && (
        <circle
          cx={city.x}
          cy={city.y}
          r={NODE_RADIUS + 5}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.4"
          style={{
            animation: "tsp-pulse 1.8s ease-in-out infinite",
          }}
        />
      )}

      {/* Main node circle */}
      <circle
        cx={city.x}
        cy={city.y}
        r={NODE_RADIUS}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth="2"
        filter={hasGlow ? `url(#${filterId})` : undefined}
        style={{ transition: "fill 0.35s ease, stroke 0.35s ease" }}
      />

      {/* City name label */}
      <text
        x={city.x + LABEL_OFFSET_X}
        y={city.y + LABEL_OFFSET_Y}
        fill={colors.label}
        fontSize="10"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="500"
        style={{
          transition: "fill 0.35s ease",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {}
      </text>
    </g>
  );
}
