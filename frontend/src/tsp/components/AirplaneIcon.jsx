const PLANE_SCALE = 2.0;

export default function AirplaneIcon({ x, y, angle, visible }) {
  if (!visible) return null;

  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle})`}
      style={{
        filter: "drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px #818CF8)",
      }}
    >
      {/* Airplane body — pointing right (0°) by default */}
      <g transform={`scale(${PLANE_SCALE})`}>
        {/* Fuselage */}
        <ellipse cx="0" cy="0" rx="10" ry="3.5" fill="#F1F5F9" />

        {/* Nose */}
        <polygon points="10,0 7,-1.5 7,1.5" fill="#CBD5E1" />

        {/* Left wing */}
        <polygon points="-2,-3.5 4,0 -2,0" fill="#94A3B8" />

        {/* Right wing */}
        <polygon points="-2,3.5 4,0 -2,0" fill="#94A3B8" />

        {/* Tail fin top */}
        <polygon points="-10,-1 -6,0 -10,0" fill="#94A3B8" />

        {/* Tail fin bottom */}
        <polygon points="-10,1 -6,0 -10,0" fill="#94A3B8" />

        {/* Window row */}
        <circle cx="-1" cy="0" r="1" fill="#7DD3FC" opacity="0.8" />
        <circle cx="2" cy="0" r="1" fill="#7DD3FC" opacity="0.8" />
        <circle cx="5" cy="0" r="1" fill="#7DD3FC" opacity="0.8" />
      </g>
    </g>
  );
}
