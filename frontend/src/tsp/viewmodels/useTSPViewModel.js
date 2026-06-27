import { useCallback, useEffect, useRef, useState } from "react";
import { AnimationEngine } from "../engine/AnimationEngine.js";
import { SAMPLE_CITIES, DEMO_ROUTE } from "../models/cities.js";

export function useTSPViewModel(
  initialCities = SAMPLE_CITIES,
  initialRoute = DEMO_ROUTE,
) {
  // ── Engine ref (never recreated) ──────────────────────────────────────────
  const engineRef = useRef(null);

  // ── Reactive state (pushed from engine callbacks) ─────────────────────────
  const [animState, setAnimState] = useState({
    isPlaying: false,
    currentStep: 0,
    totalSteps: 0,
    airplane: { x: 0, y: 0, angle: 0, visible: false },
    completedEdges: [],
    nodeStates: new Map(),
  });

  const [cities] = useState(initialCities);
  const [route, setRouteState] = useState(initialRoute);
  const [speed, setSpeedState] = useState(1.0);

  const initializeRoute = (nodes) => {
    setRouteState(nodes);
    engineRef.current?.setRoute(nodes);
    engineRef.current?.reset();
    engineRef.current?.play();
  };

  // ── Initialize engine once ────────────────────────────────────────────────
  useEffect(() => {
    const engine = new AnimationEngine(initialCities, {
      onStateChange: (state) => setAnimState({ ...state }),
      onNodeArrived: (nodeId) => {
        // Could trigger sound effects or other side-effects here
        void nodeId;
      },
      onEdgeComplete: (edge) => void edge,
      onDone: () => {
        // Animation finished
      },
    });

    engine.setRoute(initialRoute);
    engineRef.current = engine;

    const tid = setTimeout(() => engine.play(), 400);

    return () => {
      clearTimeout(tid);
      engine.pause();
    };
  }, []);

  const play = useCallback(() => {
    engineRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
  }, []);

  const reset = useCallback(() => {
    engineRef.current?.reset();
  }, []);

  const setRoute = useCallback((nodes) => {
    setRouteState(nodes);
    engineRef.current?.setRoute(nodes);
  }, []);

  const setSpeed = useCallback((s) => {
    setSpeedState(s);
    engineRef.current?.setSpeed(s);
  }, []);

  const currentCityName = (() => {
    if (animState.currentStep < route.length) {
      const cityId = route[animState.currentStep];
      return cities.find((c) => c.id === cityId)?.name ?? "";
    }
    return "";
  })();

  return {
    cities,
    route,

    isPlaying: animState.isPlaying,
    currentStep: animState.currentStep,
    totalSteps: animState.totalSteps,
    airplane: animState.airplane,
    completedEdges: animState.completedEdges,
    nodeStates: animState.nodeStates,
    currentCityName,
    speed,

    // Commands
    play,
    pause,
    reset,
    setRoute,
    setSpeed,
    initializeRoute,
  };
}
