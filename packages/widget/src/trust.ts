/**
 * FTP Trust Score — Lightweight behavioral verification module.
 *
 * "Enough Evidence" model: tracks 7 behavioral signals passively.
 * Each signal that meets its threshold counts as "proven".
 * When enough signals pass (default: 3 of 7), we're confident you're human.
 *
 * Usage:
 *   const trust = new TrustScore({ minTimeMs: 60000, minMoves: 10 });
 *   trust.start();
 *   // ... later, on submit:
 *   const result = trust.evaluate();
 *   // { score: 100, passed: true, provenCount: 5, ... }
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
  /** Minimum scroll interval variance to be considered human (default: 10000 ms²) */
  minScrollVariance: number;
  /** Minimum typing interval variance to be considered human (default: 500 ms²) */
  minTypingVariance: number;
  /** Minimum number of signals that must pass to consider user human (default: 3) */
  minSignalsToPass: number;
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
  /** Variance of scroll intervals. High = human (irregular), low = bot (constant) */
  scrollIntervalVariance: number;
  /** Number of scroll direction changes (up↔down). Humans scroll both ways */
  scrollDirectionChanges: number;
  /** Number of scroll samples collected */
  scrollSamples: number;
  /** Variance of intervals between key presses in ms². High = human, low = bot */
  typingVariance: number;
  /** Number of backspace/delete presses (typo corrections = strong human signal) */
  backspaceCount: number;
  /** Number of typing samples collected */
  typingSamples: number;
  /** Average interval between key presses in ms */
  typingAvgInterval: number;
}

export interface TrustResult {
  /** 0–100 score based on proven signals vs minSignalsToPass */
  score: number;
  /** Whether provenCount >= minSignalsToPass */
  passed: boolean;
  /** How many signals passed their threshold */
  provenCount: number;
  /** Total number of signals (always 7) */
  totalSignals: number;
  /** minSignalsToPass threshold */
  minRequired: number;
  /** 0–100 secondary score using old weighted additive approach */
  confidenceScore: number;
  /** Per-signal breakdown */
  breakdown: Record<string, {
    proven: boolean;
    value: number;
    threshold: number;
    label: string;
  }>;
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
  minScrollVariance: 10000,
  minTypingVariance: 500,
  minSignalsToPass: 3,
};

// Weights for the confidenceScore (additive model, must sum to 100)
const WEIGHTS = {
  cursorBehavior: 28,
  scrollBehavior: 12,
  keyPresses: 10,
  typingPattern: 12,
  clicks: 5,
  time: 10,
  environment: 10,
  backspaces: 13,
};

const TOTAL_SIGNALS = 7;

/** Max path points to store (ring buffer to cap memory) */
const MAX_PATH_POINTS = 200;
/** Max key timestamps to store */
const MAX_KEY_TIMESTAMPS = 100;

interface PathPoint {
  x: number;
  y: number;
  t: number;
}

export class TrustScore {
  private thresholds: TrustThresholds;
  private signals: TrustSignals;
  private startTime: number = 0;
  private target: EventTarget;
  private abortController: AbortController | null = null;

  private pathPoints: PathPoint[] = [];
  private pathIndex = 0;

  /** Timestamps of keydown events for interval analysis */
  private keyTimestamps: number[] = [];
  private keyTsIndex = 0;

  /** Scroll event data for variance analysis */
  private scrollTimestamps: number[] = [];
  private scrollPositions: number[] = [];
  private scrollTsIndex = 0;

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
      scrollIntervalVariance: 0,
      scrollDirectionChanges: 0,
      scrollSamples: 0,
      typingVariance: 0,
      backspaceCount: 0,
      typingSamples: 0,
      typingAvgInterval: 0,
    };
  }

  /** Start tracking user behavior signals */
  start(): void {
    this.startTime = Date.now();
    this.abortController = new AbortController();
    const opts = { signal: this.abortController.signal, passive: true };

    let moveThrottle = 0;
    let scrollThrottle = 0;

    this.target.addEventListener('mousemove', (e: Event) => {
      const now = Date.now();
      if (now - moveThrottle > 50) {
        this.signals.mouseMoves++;
        moveThrottle = now;
        const me = e as MouseEvent;
        this.addPathPoint(me.clientX, me.clientY, now);
      }
    }, opts);

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

    const trackScroll = () => {
      const now = Date.now();
      if (now - scrollThrottle > 200) {
        this.signals.scrolls++;
        scrollThrottle = now;
        const pos = window.scrollY || document.documentElement.scrollTop || 0;
        if (this.scrollTimestamps.length < MAX_KEY_TIMESTAMPS) {
          this.scrollTimestamps.push(now);
          this.scrollPositions.push(pos);
        } else {
          const idx = this.scrollTsIndex % MAX_KEY_TIMESTAMPS;
          this.scrollTimestamps[idx] = now;
          this.scrollPositions[idx] = pos;
        }
        this.scrollTsIndex++;
      }
    };

    this.target.addEventListener('scroll', trackScroll, opts);
    window.addEventListener('scroll', trackScroll, opts);

    this.target.addEventListener('keydown', (e: Event) => {
      this.signals.keyPresses++;
      const now = Date.now();
      const ke = e as KeyboardEvent;

      // Track backspace/delete (typo corrections = strong human signal)
      if (ke.key === 'Backspace' || ke.key === 'Delete') {
        this.signals.backspaceCount++;
      }

      // Store timestamp for interval analysis
      if (this.keyTimestamps.length < MAX_KEY_TIMESTAMPS) {
        this.keyTimestamps.push(now);
      } else {
        this.keyTimestamps[this.keyTsIndex % MAX_KEY_TIMESTAMPS] = now;
      }
      this.keyTsIndex++;
    }, opts);

    this.target.addEventListener('click', () => {
      this.signals.clicks++;
    }, opts);

    this.target.addEventListener('touchstart', () => {
      this.signals.clicks++;
    }, opts);

    this.signals.webdriver = !!(navigator as any).webdriver;
    this.signals.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.signals.screenConsistent = this.checkScreenConsistency();
  }

  /** Evaluate using the "Enough Evidence" model */
  evaluate(): TrustResult {
    this.signals.timeOnPageMs = Date.now() - this.startTime;
    this.analyzePath();
    this.analyzeScrolling();
    this.analyzeTyping();

    const t = this.thresholds;
    const s = this.signals;

    // Determine proven status for each signal
    // Cursor Behavior: moves + organic path combined — bot can't score by just firing events
    const cursorBehaviorProven = s.mouseMoves >= t.minMoves && s.pathAngleVariance >= t.minPathVariance && s.pathSamples >= 5;
    // Scroll Behavior: enough scrolls AND (interval variance OR direction changes)
    const scrollBehaviorProven = s.scrolls >= t.minScrolls &&
      (s.scrollIntervalVariance >= t.minScrollVariance || s.scrollDirectionChanges >= 1);
    const keyPressesProven = s.keyPresses >= t.minKeyPresses;
    const clicksProven = s.clicks >= t.minClicks;
    const timeProven = s.timeOnPageMs >= t.minTimeMs;
    // Typing pattern: variance must exceed threshold AND have enough samples, OR have backspaces (typo corrections)
    const typingPatternProven = (s.typingVariance >= t.minTypingVariance && s.typingSamples >= 5) || s.backspaceCount >= 1;
    const envProven = !s.webdriver && s.screenConsistent;

    const breakdown: TrustResult['breakdown'] = {
      cursorBehavior: {
        proven: cursorBehaviorProven,
        value: s.mouseMoves,
        threshold: t.minMoves,
        label: 'Cursor behavior',
      },
      scrollBehavior: {
        proven: scrollBehaviorProven,
        value: s.scrolls,
        threshold: t.minScrolls,
        label: 'Scroll behavior',
      },
      keyPresses: {
        proven: keyPressesProven,
        value: s.keyPresses,
        threshold: t.minKeyPresses,
        label: 'Key presses',
      },
      clicks: {
        proven: clicksProven,
        value: s.clicks,
        threshold: t.minClicks,
        label: 'Clicks',
      },
      time: {
        proven: timeProven,
        value: s.timeOnPageMs,
        threshold: t.minTimeMs,
        label: 'Time on page',
      },
      typingPattern: {
        proven: typingPatternProven,
        value: s.typingVariance,
        threshold: t.minTypingVariance,
        label: 'Typing rhythm',
      },
      environment: {
        proven: envProven,
        value: envProven ? 1 : 0,
        threshold: 1,
        label: 'Environment',
      },
    };

    const provenCount = Object.values(breakdown).filter(b => b.proven).length;
    const score = Math.min(Math.round((provenCount / t.minSignalsToPass) * 100), 100);
    const passed = provenCount >= t.minSignalsToPass;

    // Confidence score (weighted additive approach)
    // Cursor behavior: both quantity AND quality must be present
    const moveRatio = Math.min(s.mouseMoves / t.minMoves, 1);
    const pathQuality = this.cursorPathScore();
    const cursorBehaviorScore = moveRatio * pathQuality; // Both must be high

    const typingPatternScore = s.typingSamples >= 3
      ? Math.min(s.typingVariance / t.minTypingVariance, 1)
      : 0;
    const backspaceScore = Math.min(s.backspaceCount / 2, 1);

    const confidenceScore = Math.round(
      cursorBehaviorScore * WEIGHTS.cursorBehavior +
      (Math.min(s.scrolls / t.minScrolls, 1) * (s.scrollDirectionChanges >= 1 || s.scrollIntervalVariance >= t.minScrollVariance ? 1 : 0.3)) * WEIGHTS.scrollBehavior +
      Math.min(s.keyPresses / t.minKeyPresses, 1) * WEIGHTS.keyPresses +
      typingPatternScore * WEIGHTS.typingPattern +
      Math.min(s.clicks / t.minClicks, 1) * WEIGHTS.clicks +
      Math.min(s.timeOnPageMs / t.minTimeMs, 1) * WEIGHTS.time +
      this.envScore() * WEIGHTS.environment +
      backspaceScore * WEIGHTS.backspaces
    );

    return {
      score,
      passed,
      provenCount,
      totalSignals: TOTAL_SIGNALS,
      minRequired: t.minSignalsToPass,
      confidenceScore,
      breakdown,
      signals: { ...this.signals },
    };
  }

  /** Evaluate with custom signals (for simulations) */
  evaluateWith(customSignals: Partial<TrustSignals>): TrustResult {
    const origSignals = { ...this.signals };
    const origStartTime = this.startTime;
    Object.assign(this.signals, customSignals);
    if (customSignals.timeOnPageMs !== undefined) {
      this.startTime = Date.now() - customSignals.timeOnPageMs;
    }
    const result = this.evaluate();
    this.signals = origSignals;
    this.startTime = origStartTime;
    return result;
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
    this.keyTimestamps = [];
    this.scrollTimestamps = [];
    this.scrollPositions = [];
  }

  // ─── Scroll analysis ──────────────────────────────────────

  /**
   * Analyze scroll behavior for human-like patterns:
   * - Interval variance: humans scroll irregularly, bots at constant rate
   * - Direction changes: humans scroll up and down, bots typically only down
   */
  private analyzeScrolling(): void {
    const ts = this.scrollTimestamps;
    const pos = this.scrollPositions;
    this.signals.scrollSamples = ts.length;

    if (ts.length < 3) {
      this.signals.scrollIntervalVariance = 0;
      this.signals.scrollDirectionChanges = 0;
      return;
    }

    // Sort by timestamp (ring buffer may be out of order)
    const indices = ts.map((_, i) => i).sort((a, b) => ts[a] - ts[b]);
    const sortedTs = indices.map(i => ts[i]);
    const sortedPos = indices.map(i => pos[i]);

    // Compute interval variance
    const intervals: number[] = [];
    for (let i = 1; i < sortedTs.length; i++) {
      const interval = sortedTs[i] - sortedTs[i - 1];
      if (interval < 5000) intervals.push(interval);
    }
    this.signals.scrollIntervalVariance = intervals.length >= 2 ? this.variance(intervals) : 0;

    // Count direction changes (up ↔ down)
    let dirChanges = 0;
    let lastDir = 0; // 0=none, 1=down, -1=up
    for (let i = 1; i < sortedPos.length; i++) {
      const diff = sortedPos[i] - sortedPos[i - 1];
      if (diff === 0) continue;
      const dir = diff > 0 ? 1 : -1;
      if (lastDir !== 0 && dir !== lastDir) dirChanges++;
      lastDir = dir;
    }
    this.signals.scrollDirectionChanges = dirChanges;
  }

  // ─── Typing analysis ──────────────────────────────────────

  /**
   * Analyze typing rhythm for human-like behavior:
   * - Interval variance: humans type unevenly (50-300ms), bots at constant speed
   * - Average interval: extremely fast (<20ms avg) = likely programmatic
   */
  private analyzeTyping(): void {
    const ts = this.keyTimestamps;
    this.signals.typingSamples = ts.length;

    if (ts.length < 3) {
      this.signals.typingVariance = 0;
      this.signals.typingAvgInterval = 0;
      return;
    }

    // Sort timestamps (ring buffer may be out of order)
    const sorted = [...ts].sort((a, b) => a - b);

    // Compute intervals between consecutive key presses
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const interval = sorted[i] - sorted[i - 1];
      // Ignore gaps > 5s (user paused, not continuous typing)
      if (interval < 5000) {
        intervals.push(interval);
      }
    }

    if (intervals.length < 2) {
      this.signals.typingVariance = 0;
      this.signals.typingAvgInterval = 0;
      return;
    }

    this.signals.typingAvgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    this.signals.typingVariance = this.variance(intervals);
  }

  // ─── Path analysis ───────────────────────────────────────

  private addPathPoint(x: number, y: number, t: number): void {
    if (this.pathPoints.length < MAX_PATH_POINTS) {
      this.pathPoints.push({ x, y, t });
    } else {
      this.pathPoints[this.pathIndex % MAX_PATH_POINTS] = { x, y, t };
    }
    this.pathIndex++;
  }

  private analyzePath(): void {
    const pts = this.pathPoints;
    this.signals.pathSamples = pts.length;

    if (pts.length < 3) {
      this.signals.pathAngleVariance = 0;
      this.signals.pathAvgSpeed = 0;
      this.signals.pathSpeedVariance = 0;
      return;
    }

    const angles: number[] = [];
    const speeds: number[] = [];

    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      const dt = pts[i].t - pts[i - 1].t;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dt > 0) speeds.push(dist / dt);

      if (i >= 2) {
        const prevDx = pts[i - 1].x - pts[i - 2].x;
        const prevDy = pts[i - 1].y - pts[i - 2].y;
        const prevAngle = Math.atan2(prevDy, prevDx);
        const currAngle = Math.atan2(dy, dx);
        let delta = currAngle - prevAngle;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;
        angles.push(delta);
      }
    }

    this.signals.pathAngleVariance = this.variance(angles);

    if (speeds.length > 0) {
      this.signals.pathAvgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      this.signals.pathSpeedVariance = this.variance(speeds);
    }
  }

  private cursorPathScore(): number {
    const pts = this.pathPoints.length;
    if (pts < 5) return 0.5;

    let score = 0;
    const angleVar = this.signals.pathAngleVariance;
    score += Math.min(angleVar / this.thresholds.minPathVariance, 1) * 0.6;

    const speedVar = this.signals.pathSpeedVariance;
    const speedScore = speedVar > 0.01 ? Math.min(speedVar / 0.1, 1) : 0;
    score += speedScore * 0.4;

    return Math.min(score, 1);
  }

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

  private variance(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => (v - mean) ** 2);
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }
}
