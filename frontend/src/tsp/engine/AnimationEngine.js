import { distanceBetween, angleBetween } from "../models/City.js";
import { lerpPoint, clamp } from "./interpolation.js";

// How long (ms) the airplane pauses at each node before moving on.
const NODE_DWELL_MS = 600;

const BASE_PX_PER_SEC = 120;

export class AnimationEngine {
  /** @param {import('../models/City.js').City[]} cities */
  /** @param {object} callbacks */
  constructor(cities, callbacks = {}) {
    this._cities = cities;
    this._cb = callbacks;

    this._route = [];
    this._speed = 1.0;

    // Animation state
    this._stepIndex = 0;
    this._progress = 0;
    this._dwelling = false;
    this._dwellElapsed = 0;
    this._playing = false;
    this._rafId = null;
    this._lastTimestamp = null;

    // Visited state
    this._visitedNodes = new Set();
    this._completedEdges = [];

    this._airplane = { x: 0, y: 0, angle: 0, visible: false };
  }

  setRoute(nodes) {
    this._route = [...nodes];
    this.reset();
  }

  setSpeed(speed) {
    this._speed = clamp(speed, 0.1, 8);
  }

  play() {
    if (this._playing) return;
    if (this._route.length < 2) return;

    this._playing = true;
    this._lastTimestamp = null;

    if (this._stepIndex === 0 && this._progress === 0 && !this._dwelling) {
      const firstCity = this._cities[this._route[0]];
      this._airplane = {
        x: firstCity.x,
        y: firstCity.y,
        angle: 0,
        visible: true,
      };
      this._markNodeState(this._route[0], "start");
    }

    this._rafId = requestAnimationFrame(this._tick.bind(this));
    this._emitStateChange();
  }

  pause() {
    this._playing = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._emitStateChange();
  }

  reset() {
    this.pause();

    this._stepIndex = 0;
    this._progress = 0;
    this._dwelling = false;
    this._dwellElapsed = 0;
    this._visitedNodes = new Set();
    this._completedEdges = [];

    if (this._route.length > 0) {
      const first = this._cities[this._route[0]];
      this._airplane = { x: first.x, y: first.y, angle: 0, visible: true };
    } else {
      this._airplane = { x: 0, y: 0, angle: 0, visible: false };
    }

    this._emitStateChange();
  }

  get isPlaying() {
    return this._playing;
  }
  get currentStep() {
    return this._stepIndex;
  }
  get totalSteps() {
    return Math.max(0, this._route.length - 1);
  }
  get airplaneState() {
    return { ...this._airplane };
  }

  _tick(timestamp) {
    if (!this._playing) return;

    if (this._lastTimestamp === null) {
      this._lastTimestamp = timestamp;
    }

    const deltaMs = timestamp - this._lastTimestamp;
    this._lastTimestamp = timestamp;

    if (this._stepIndex >= this._route.length - 1) {
      this._playing = false;
      this._airplane = { ...this._airplane, visible: true };
      this._cb.onDone?.();
      this._emitStateChange();
      return;
    }

    const fromIdx = this._route[this._stepIndex];
    const toIdx = this._route[this._stepIndex + 1];
    const fromCity = this._cities[fromIdx];
    const toCity = this._cities[toIdx];

    if (this._dwelling) {
      this._dwellElapsed += deltaMs;
      if (this._dwellElapsed >= NODE_DWELL_MS) {
        this._dwelling = false;
        this._dwellElapsed = 0;
        this._stepIndex++;
        this._progress = 0;
        this._emitStateChange();
      }
    } else {
      // Moving along the edge
      const distance = distanceBetween(fromCity, toCity);
      const pxPerMs = (BASE_PX_PER_SEC * this._speed) / 1000;
      const delta = (pxPerMs * deltaMs) / Math.max(1, distance);

      this._progress = clamp(this._progress + delta, 0, 1);

      const pos = lerpPoint(
        fromCity.x,
        fromCity.y,
        toCity.x,
        toCity.y,
        this._progress,
      );
      const angle = angleBetween(fromCity, toCity);

      this._airplane = { x: pos.x, y: pos.y, angle, visible: true };

      this._markNodeState(toIdx, "current");

      if (this._progress >= 1) {
        this._completedEdges.push({ from: fromIdx, to: toIdx });
        this._markNodeState(fromIdx, "visited");
        this._dwelling = true;
        this._dwellElapsed = 0;
        this._cb.onNodeArrived?.(toIdx);
        this._cb.onEdgeComplete?.({ from: fromIdx, to: toIdx });
      }
    }

    this._emitStateChange();
    this._rafId = requestAnimationFrame(this._tick.bind(this));
  }

  _markNodeState(cityId, state) {
    if (state === "visited") {
      this._visitedNodes.add(cityId);
    }
  }

  _buildNodeStates() {
    const states = new Map();
    const startId = this._route[0];
    const currentToIdx =
      this._route[Math.min(this._stepIndex + 1, this._route.length - 1)];

    // Defaults
    this._cities.forEach((c) => states.set(c.id, "default"));

    // Visited
    this._visitedNodes.forEach((id) => states.set(id, "visited"));

    // Start node
    if (startId !== undefined) states.set(startId, "start");

    // Current destination (overwrites visited)
    if (this._playing || this._dwelling) {
      if (!this._visitedNodes.has(currentToIdx) && currentToIdx !== startId) {
        states.set(currentToIdx, "current");
      }
    }

    return states;
  }

  _emitStateChange() {
    this._cb.onStateChange?.({
      isPlaying: this._playing,
      currentStep: this._stepIndex,
      totalSteps: this.totalSteps,
      airplane: this.airplaneState,
      completedEdges: [...this._completedEdges],
      nodeStates: this._buildNodeStates(),
    });
  }
}
