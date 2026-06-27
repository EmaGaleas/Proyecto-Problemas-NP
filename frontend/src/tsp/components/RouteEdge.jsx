import { useEffect, useRef } from "react";

const EDGE_COLOR = "#818CF8";

const STROKE_W = 1.8;
const FILTER_ID = "edge-glow-filter";

export default function RouteEdge({
  x1,
  y1,
  x2,
  y2,
  animate = false,
  instant = false,
}) {
  const lineRef = useRef(null);

  const length = Math.hypot(x2 - x1, y2 - y1);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    if (instant) {
      // Show immediately — no animation
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = "0";
      line.style.transition = "none";
      return;
    }

    if (animate) {
      //animacion
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length}`;
      line.style.transition = "none";

      void line.getBoundingClientRect();

      line.style.transition =
        "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      line.style.strokeDashoffset = "0";
    }
  }, [animate, instant, length]);

  return (
    <g className="tsp-route-edge">
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth={STROKE_W + 3}
        strokeLinecap="round"
        opacity="0.35"
        filter={`url(#${FILTER_ID})`}
        style={{
          strokeDasharray: `${length}`,
          strokeDashoffset: instant ? 0 : animate ? 0 : length,
        }}
      />

      <line
        ref={lineRef}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={EDGE_COLOR}
        strokeWidth={STROKE_W}
        strokeLinecap="round"
        opacity="0.9"
      />
    </g>
  );
}
