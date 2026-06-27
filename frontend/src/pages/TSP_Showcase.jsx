import { useMemo, useState } from "react";
import TSPCanvas from "../tsp/components/TSPCanvas.jsx";
import AnimationControls from "../tsp/components/AnimationControls.jsx";
import { useTSPViewModel } from "../tsp/viewmodels/useTSPViewModel.js";
import mapImage from "../assets/map.png";
import fondo2 from "../assets/usa/fondo2.png";
import { useNavigate } from "react-router-dom";

export default function TSP_Showcase() {
  const navigate = useNavigate();
  const vm = useTSPViewModel();
  const [heldMethod, setHeldMethod] = useState(true);

  const currentEdge = useMemo(() => {
    const route = vm.route;
    if (vm.currentStep >= route.length - 1) return null;
    return { from: route[vm.currentStep], to: route[vm.currentStep + 1] };
  }, [vm.route, vm.currentStep]);

  const handleCitySelect = async (cityId) => {
    console.log(cityId);
    await buildRoute(cityId);
  };

  const buildRoute = async (cityId) => {
    try {
      const url = heldMethod
        ? "http://localhost:8000/benchmark/tsp/shortest-route"
        : "http://localhost:8000/benchmark/tsp/nearest-neighbor";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cities: vm.cities, cityId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail ?? `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      vm.initializeRoute(data.route);
    } catch (err) {
      alert("Error al construir la ruta: " + err.message);
    }
  };

  return (
    <div id="tsp-page" style={pageStyles.root}>
      <div style={pageStyles.mapImageBox}></div>
      <img src={mapImage} alt="North America map" style={pageStyles.mapImage} />

      <div id="tsp-canvas-container" style={pageStyles.canvasContainer}>
        <TSPCanvas
          cities={vm.cities}
          completedEdges={vm.completedEdges}
          currentEdge={currentEdge}
          nodeStates={vm.nodeStates}
          airplane={vm.airplane}
          width="80%"
          height="80%"
          onCitySelect={handleCitySelect}
        />

        <AnimationControls
          isPlaying={vm.isPlaying}
          currentStep={vm.currentStep}
          totalSteps={vm.totalSteps}
          currentCityName={vm.currentCityName}
          speed={vm.speed}
          onPlay={vm.play}
          onPause={vm.pause}
          onReset={vm.reset}
          onSpeedChange={vm.setSpeed}
        />

        <div style={pageStyles.algoButtonGroup}>
          <button
            id="btn-held-karp"
            style={{
              ...pageStyles.algoButton,
              ...(heldMethod ? pageStyles.algoButtonActive : {}),
            }}
            onClick={() => setHeldMethod(true)}
          >
            Held-Karp
          </button>
          <button
            id="btn-nearest-neighbor"
            style={{
              ...pageStyles.algoButton,
              ...(!heldMethod ? pageStyles.algoButtonActive : {}),
            }}
            onClick={() => setHeldMethod(false)}
          >
            Nearest Neighbor
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-full border border-[#BF953F]/60 bg-black/40 backdrop-blur-md text-[#FCF6BA] font-medium tracking-wide flex items-center gap-2 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-[#BF953F] hover:via-[#FCF6BA] hover:to-[#B38728] hover:text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(252,246,186,0.4)] cursor-pointer"
          >
            <span>&#10094;</span> Volver
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyles = {
  root: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${fondo2})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
  },
  mapImage: {
    position: "absolute",
    inset: 30,
    width: "92%",
    height: "92%",
    objectFit: "contain",
    objectPosition: "left",
    userSelect: "none",
    pointerEvents: "none",
    borderRadius: "20px",
  },
  mapImageBox: {
    position: "absolute",
    left: 30,

    inset: 28,
    width: "995px",
    height: "93%",
    objectFit: "contain",
    objectPosition: "left",
    userSelect: "none",
    pointerEvents: "none",
    border: "10px solid #529be7",
    borderRadius: "20px",
    zIndex: 1,
  },
  canvasContainer: {
    position: "absolute",
    inset: 0,
  },
  algoButtonGroup: {
    position: "absolute",
    top: "45%",
    right: "340px",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 10,
  },
  algoButton: {
    padding: "10px 20px",
    borderRadius: "10px",

    background: "#e0e0e0ff",
    color: "#a0b4d0",
    fontSize: "13px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: "600",
    color: "black",
    letterSpacing: "0.03em",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    textAlign: "center",
  },
  algoButtonActive: {
    background: "#4F46E5",

    color: "#e8f4ff",
    boxShadow: "0 0 12px rgba(82,155,231,0.4)",
  },
};
