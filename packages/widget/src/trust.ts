/**
 * FTP Trust Score — Lightweight behavioral verification module.
 *
 * Tracks real user signals (mouse, keyboard, scroll, time) and produces
 * a trust score from 0–100. Fully configurable thresholds.
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
};

// How much each signal contributes to the total (must sum to 100)
const WEIGHTS = {
  moves: 25,
  scrolls: 10,
  keyPresses: 20,
  clicks: 10,
  time: 20,
  environment: 15,
};

export class TrustScore {
  private thresholds: TrustThresholds;
  private signals: TrustSignals;
  private startTime: number = 0;
  private target: EventTarget;
  private abortController: AbortController | null = null;

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

    this.target.addEventListener('mousemove', () => {
      const now = Date.now();
      if (now - moveThrottle > 50) { // Count max ~20/sec
        this.signals.mouseMoves++;
        moveThrottle = now;
      }
    }, opts);

    this.target.addEventListener('touchmove', () => {
      const now = Date.now();
      if (now - moveThrottle > 50) {
        this.signals.mouseMoves++; // Touch counts as movement
        moveThrottle = now;
      }
    }, opts);

    this.target.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - scrollThrottle > 200) {
        this.signals.scrolls++;
        scrollThrottle = now;
      }
    }, opts);

    // Capture scroll on window too (most common scroll target)
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
      this.signals.clicks++; // Tap counts as click
    }, opts);

    // Environment checks (one-time)
    this.signals.webdriver = !!(navigator as any).webdriver;
    this.signals.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.signals.screenConsistent = this.checkScreenConsistency();
  }

  /** Evaluate the trust score based on collected signals */
  evaluate(): TrustResult {
    this.signals.timeOnPageMs = Date.now() - this.startTime;

    const t = this.thresholds;
    const s = this.signals;

    // Score each signal: ratio of actual/threshold, capped at 1.0, then multiply by weight
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

  /** Get current thresholds (for inspection/debug) */
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
  }

  /** Environment score: 0.0 – 1.0 */
  private envScore(): number {
    let score = 1.0;
    if (this.signals.webdriver) score -= 0.6;
    if (!this.signals.screenConsistent) score -= 0.3;
    // Mobile claiming touch but no touch events recorded is suspicious
    // (only penalize after some time has passed)
    if (this.signals.hasTouch && this.signals.mouseMoves === 0 && this.signals.timeOnPageMs > 10000) {
      score -= 0.1;
    }
    return Math.max(0, score);
  }

  private checkScreenConsistency(): boolean {
    const { innerWidth, innerHeight, screen } = window;
    // Headless browsers often have 0-dimension or mismatched screen
    if (innerWidth === 0 || innerHeight === 0) return false;
    if (screen.width === 0 || screen.height === 0) return false;
    // Window shouldn't be bigger than screen
    if (innerWidth > screen.width + 50 || innerHeight > screen.height + 50) return false;
    return true;
  }
}
