import RouteEdge from "./RouteEdge.jsx";
import CityNode from "./CityNode.jsx";
import AirplaneIcon from "./AirplaneIcon.jsx";

const VIEW_BOX_W = 800;
const VIEW_BOX_H = 600;

const DEFS_SECTION = (
  <defs>
    <filter id="edge-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export default function TSPCanvas({
  cities = [],
  completedEdges = [],
  currentEdge = null,
  nodeStates = new Map(),
  airplane = { x: 0, y: 0, angle: 0, visible: false },
  onCitySelect = () => {},
  width = "100%",
  height = "100%",
}) {
  const getCityById = (id) => cities.find((c) => c.id === id);

  const edgeKey = (e) => `${e.from}-${e.to}`;
  const completedKeys = new Set(completedEdges.map(edgeKey));

  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX_W} ${VIEW_BOX_H}`}
      width={width}
      height={height}
      style={{ background: "transparent", overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {DEFS_SECTION}

      <g className="tsp-layer-edges">
        {completedEdges.map((edge) => {
          const from = getCityById(edge.from);
          const to = getCityById(edge.to);
          if (!from || !to) return null;
          return (
            <RouteEdge
              key={edgeKey(edge)}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              instant={true}
            />
          );
        })}

        {currentEdge &&
          (() => {
            const from = getCityById(currentEdge.from);
            const to = getCityById(currentEdge.to);
            const key = edgeKey(currentEdge);
            if (!from || !to || completedKeys.has(key)) return null;
            return (
              <RouteEdge
                key={`active-${key}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                animate={true}
              />
            );
          })()}
      </g>

      <g className="tsp-layer-nodes">
        {cities.map((city) => (
          <CityNode
            key={city.id}
            city={city}
            state={nodeStates.get(city.id) ?? "default"}
            onClick={() => onCitySelect(city.id)}
          />
        ))}
      </g>

      <AirplaneIcon
        x={airplane.x}
        y={airplane.y}
        angle={airplane.angle}
        visible={airplane.visible}
      />
    </svg>
  );
}
