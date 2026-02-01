/**
 * FTP Trust Score — Lightweight behavioral verification module.
 *
 * Tracks real user signals (mouse, keyboard, scroll, time, cursor path)
 * and produces a trust score from 0–100. Fully configurable thresholds.
 *
 * Usage:
 *   const trust = new TrustScore({ minTimeMs: 60000, minMoves: 10 });
 *   trust.start();
 *   // ... later, on submit:
 *   const result = trust.evaluate();
 *   // { score: 87, passed: true, signals: { ... } }
 *   trust.destroy();
 */

export interface TrustThresholds {
  /** Minimum mouse/touch moves (default: 10) */
  minMoves: number;
  /** Minimum scroll events (default: 3) */
  minScrolls: number;
  /** Minimum key presses (default: 5) */
  minKeyPresses: number;
  /** Minimum time on page in ms (default: 60000 = 1 min) */
  minTimeMs: number;
  /** Minimum clicks/taps (default: 2) */
  minClicks: number;
  /** Minimum cursor path angle variance to be considered human (default: 0.3 radians²) */
  minPathVariance: number;
}

export interface TrustSignals {
  mouseMoves: number;
  scrolls: number;
  keyPresses: number;
  clicks: number;
  timeOnPageMs: number;
  webdriver: boolean;
  hasTouch: boolean;
  screenConsistent: boolean;
  /** Variance of angle changes in cursor path. High = human (curvy), low = bot (straight) */
  pathAngleVariance: number;
  /** Number of cursor path samples collected */
  pathSamples: number;
  /** Average speed of cursor in px/ms */
  pathAvgSpeed: number;
  /** Variance of cursor speed. High = human (accel/decel), low = bot (constant) */
  pathSpeedVariance: number;
}

export interface TrustResult {
  /** 0–100 overall trust score */
  score: number;
  /** Whether score meets the passing threshold (≥ 60) */
  passed: boolean;
  /** Breakdown per signal: 0 (fail) to weight (full pass) */
  breakdown: Record<string, { value: number; threshold: number; score: number }>;
  /** Raw collected signals */
  signals: TrustSignals;
}

const DEFAULT_THRESHOLDS: TrustThresholds = {
  minMoves: 10,
  minScrolls: 3,
  minKeyPresses: 5,
  minTimeMs: 60000,
  minClicks: 2,
  minPathVariance: 0.3,
};

// How much each signal contributes to the total (must sum to 100)
const WEIGHTS = {
  moves: 15,
  scrolls: 10,
  keyPresses: 15,
  clicks: 5,
  time: 15,
  cursorPath: 25,
  environment: 15,
};

/** Max path points to store (ring buffer to cap memory) */
const MAX_PATH_POINTS = 200;

interface PathPoint {
  x: number;
  y: number;
  t: number; // timestamp
}

export class TrustScore {
  private thresholds: TrustThresholds;
  private signals: TrustSignals;
  private startTime: number = 0;
  private target: EventTarget;
  private abortController: AbortController | null = null;

  /** Cursor path samples (ring buffer) */
  private pathPoints: PathPoint[] = [];
  private pathIndex = 0;

  constructor(thresholds?: Partial<TrustThresholds>, target?: EventTarget) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.target = target || document;
    this.signals = {
      mouseMoves: 0,
      scrolls: 0,
      keyPresses: 0,
      clicks: 0,
      timeOnPageMs: 0,
      webdriver: false,
      hasTouch: false,
      screenConsistent: true,
      pathAngleVariance: 0,
      pathSamples: 0,
      pathAvgSpeed: 0,
      pathSpeedVariance: 0,
    };
  }

  /** Start tracking user behavior signals */
  start(): void {
    this.startTime = Date.now();
    this.abortController = new AbortController();
    const opts = { signal: this.abortController.signal, passive: true };

    // Throttle high-frequency events
    let moveThrottle = 0;
    let scrollThrottle = 0;

    // Mouse move: count + collect path
    this.target.addEventListener('mousemove', (e: Event) => {
      const now = Date.now();
      if (now - moveThrottle > 50) {
        this.signals.mouseMoves++;
        moveThrottle = now;
        const me = e as MouseEvent;
        this.addPathPoint(me.clientX, me.clientY, now);
      }
    }, opts);

    // Touch move: count + collect path
    this.target.addEventListener('touchmove', (e: Event) => {
      const now = Date.now();
      if (now - moveThrottle > 50) {
        this.signals.mouseMoves++;
        moveThrottle = now;
        const te = e as TouchEvent;
        if (te.touches.length > 0) {
          this.addPathPoint(te.touches[0].clientX, te.touches[0].clientY, now);
        }
      }
    }, opts);

    this.target.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - scrollThrottle > 200) {
        this.signals.scrolls++;
        scrollThrottle = now;
      }
    }, opts);

    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - scrollThrottle > 200) {
        this.signals.scrolls++;
        scrollThrottle = now;
      }
    }, opts);

    this.target.addEventListener('keydown', () => {
      this.signals.keyPresses++;
    }, opts);

    this.target.addEventListener('click', () => {
      this.signals.clicks++;
    }, opts);

    this.target.addEventListener('touchstart', () => {
      this.signals.clicks++;
    }, opts);

    // Environment checks (one-time)
    this.signals.webdriver = !!(navigator as any).webdriver;
    this.signals.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.signals.screenConsistent = this.checkScreenConsistency();
  }

  /** Evaluate the trust score based on collected signals */
  evaluate(): TrustResult {
    this.signals.timeOnPageMs = Date.now() - this.startTime;

    // Compute cursor path analysis
    this.analyzePath();

    const t = this.thresholds;
    const s = this.signals;

    const breakdown: TrustResult['breakdown'] = {
      moves: {
        value: s.mouseMoves,
        threshold: t.minMoves,
        score: Math.min(s.mouseMoves / t.minMoves, 1) * WEIGHTS.moves,
      },
      scrolls: {
        value: s.scrolls,
        threshold: t.minScrolls,
        score: Math.min(s.scrolls / t.minScrolls, 1) * WEIGHTS.scrolls,
      },
      keyPresses: {
        value: s.keyPresses,
        threshold: t.minKeyPresses,
        score: Math.min(s.keyPresses / t.minKeyPresses, 1) * WEIGHTS.keyPresses,
      },
      clicks: {
        value: s.clicks,
        threshold: t.minClicks,
        score: Math.min(s.clicks / t.minClicks, 1) * WEIGHTS.clicks,
      },
      time: {
        value: s.timeOnPageMs,
        threshold: t.minTimeMs,
        score: Math.min(s.timeOnPageMs / t.minTimeMs, 1) * WEIGHTS.time,
      },
      cursorPath: {
        value: s.pathAngleVariance,
        threshold: t.minPathVariance,
        score: this.cursorPathScore() * WEIGHTS.cursorPath,
      },
      environment: {
        value: this.envScore(),
        threshold: 1,
        score: this.envScore() * WEIGHTS.environment,
      },
    };

    const score = Math.round(
      Object.values(breakdown).reduce((sum, b) => sum + b.score, 0)
    );

    return {
      score,
      passed: score >= 60,
      breakdown,
      signals: { ...this.signals },
    };
  }

  /** Get current thresholds */
  getThresholds(): TrustThresholds {
    return { ...this.thresholds };
  }

  /** Update thresholds at runtime */
  setThresholds(thresholds: Partial<TrustThresholds>): void {
    Object.assign(this.thresholds, thresholds);
  }

  /** Stop tracking and clean up listeners */
  destroy(): void {
    this.abortController?.abort();
    this.abortController = null;
    this.pathPoints = [];
  }

  // ─── Path analysis ───────────────────────────────────────

  private addPathPoint(x: number, y: number, t: number): void {
    if (this.pathPoints.length < MAX_PATH_POINTS) {
      this.pathPoints.push({ x, y, t });
    } else {
      // Ring buffer: overwrite oldest
      this.pathPoints[this.pathIndex % MAX_PATH_POINTS] = { x, y, t };
    }
    this.pathIndex++;
  }

  /**
   * Analyze the cursor path for human-like behavior:
   * 1. Angle variance — humans make curved paths (high variance), bots go straight (low)
   * 2. Speed variance — humans accelerate/decelerate, bots move at constant speed
   */
  private analyzePath(): void {
    const pts = this.pathPoints;
    this.signals.pathSamples = pts.length;

    if (pts.length < 3) {
      // Not enough data — can't compute
      this.signals.pathAngleVariance = 0;
      this.signals.pathAvgSpeed = 0;
      this.signals.pathSpeedVariance = 0;
      return;
    }

    // Compute angles between consecutive segments
    const angles: number[] = [];
    const speeds: number[] = [];

    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      const dt = pts[i].t - pts[i - 1].t;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Speed in px/ms
      if (dt > 0) {
        speeds.push(dist / dt);
      }

      // Angle of this segment
      if (i >= 2) {
        const prevDx = pts[i - 1].x - pts[i - 2].x;
        const prevDy = pts[i - 1].y - pts[i - 2].y;

        const prevAngle = Math.atan2(prevDy, prevDx);
        const currAngle = Math.atan2(dy, dx);

        // Angle change (direction delta)
        let delta = currAngle - prevAngle;
        // Normalize to [-π, π]
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;

        angles.push(delta);
      }
    }

    // Compute variance of angle changes
    this.signals.pathAngleVariance = this.variance(angles);

    // Compute speed stats
    if (speeds.length > 0) {
      this.signals.pathAvgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      this.signals.pathSpeedVariance = this.variance(speeds);
    }
  }

  /**
   * Cursor path score: 0.0 – 1.0
   *
   * Combines angle variance (are movements curvy?) and speed variance
   * (does the cursor accelerate/decelerate?).
   *
   * Human: high angle variance (>0.3), high speed variance
   * Bot: near-zero angle variance (straight lines), constant speed
   */
  private cursorPathScore(): number {
    const pts = this.pathPoints.length;

    // Not enough samples — neutral (don't penalize mobile/touch users)
    if (pts < 5) return 0.5;

    let score = 0;

    // Angle variance: 0 = straight line bot, >threshold = human curves
    const angleVar = this.signals.pathAngleVariance;
    const angleScore = Math.min(angleVar / this.thresholds.minPathVariance, 1);
    score += angleScore * 0.6; // 60% of cursor path weight

    // Speed variance: humans speed up/slow down, bots are constant
    const speedVar = this.signals.pathSpeedVariance;
    // Threshold: any meaningful speed variation is good (>0.01 px²/ms²)
    const speedScore = speedVar > 0.01 ? Math.min(speedVar / 0.1, 1) : 0;
    score += speedScore * 0.4; // 40% of cursor path weight

    return Math.min(score, 1);
  }

  // ─── Environment ─────────────────────────────────────────

  private envScore(): number {
    let score = 1.0;
    if (this.signals.webdriver) score -= 0.6;
    if (!this.signals.screenConsistent) score -= 0.3;
    if (this.signals.hasTouch && this.signals.mouseMoves === 0 && this.signals.timeOnPageMs > 10000) {
      score -= 0.1;
    }
    return Math.max(0, score);
  }

  private checkScreenConsistency(): boolean {
    const { innerWidth, innerHeight, screen } = window;
    if (innerWidth === 0 || innerHeight === 0) return false;
    if (screen.width === 0 || screen.height === 0) return false;
    if (innerWidth > screen.width + 50 || innerHeight > screen.height + 50) return false;
    return true;
  }

  // ─── Math helpers ────────────────────────────────────────

  private variance(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => (v - mean) ** 2);
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
}
