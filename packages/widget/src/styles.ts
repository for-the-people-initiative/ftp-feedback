export const styles = `
:host {
  --ftp-primary: #6366f1;
  --ftp-primary-hover: #4f46e5;
  --ftp-bg: #ffffff;
  --ftp-bg-secondary: #f9fafb;
  --ftp-text: #111827;
  --ftp-text-secondary: #6b7280;
  --ftp-border: #e5e7eb;
  --ftp-shadow: 0 20px 60px rgba(0,0,0,0.15);
  --ftp-radius: 12px;
  --ftp-success: #10b981;
  --ftp-error: #ef4444;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ftp-text);
}
:host([theme="dark"]) {
  --ftp-primary: #818cf8;
  --ftp-primary-hover: #6366f1;
  --ftp-bg: #1f2937;
  --ftp-bg-secondary: #111827;
  --ftp-text: #f9fafb;
  --ftp-text-secondary: #9ca3af;
  --ftp-border: #374151;
}
* { box-sizing: border-box; margin: 0; padding: 0; }

.trigger {
  position: fixed; z-index: 99999;
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--ftp-primary); color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(99,102,241,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.trigger:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }
.trigger svg { width: 24px; height: 24px; }
.bottom-right { bottom: 20px; right: 20px; }
.bottom-left { bottom: 20px; left: 20px; }
.top-right { top: 20px; right: 20px; }
.top-left { top: 20px; left: 20px; }

.overlay {
  position: fixed; z-index: 100000;
  width: 380px; max-height: 560px;
  background: var(--ftp-bg); border-radius: var(--ftp-radius);
  box-shadow: var(--ftp-shadow); border: 1px solid var(--ftp-border);
  overflow: hidden; display: flex; flex-direction: column;
  animation: ftp-slide-in 0.25s ease-out;
}
.overlay.bottom-right { bottom: 80px; right: 20px; }
.overlay.bottom-left { bottom: 80px; left: 20px; }
.overlay.top-right { top: 80px; right: 20px; }
.overlay.top-left { top: 80px; left: 20px; }
@keyframes ftp-slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  padding: 14px 20px; background: var(--ftp-primary); color: white;
  display: flex; justify-content: space-between; align-items: center;
}
.header h3 { font-size: 15px; font-weight: 600; }
.close-btn {
  background: none; border: none; color: white; cursor: pointer;
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.close-btn:hover { background: rgba(255,255,255,0.2); }

/* Progress bar */
.progress { display: flex; gap: 6px; padding: 12px 20px 0; }
.progress-dot {
  height: 4px; flex: 1; border-radius: 2px;
  background: var(--ftp-border); transition: background 0.3s;
}
.progress-dot.active { background: var(--ftp-primary); }
.progress-dot.done { background: var(--ftp-primary); opacity: 0.5; }

/* Step container */
.body { padding: 16px 20px; overflow-y: auto; flex: 1; }

.step-content {
  animation: ftp-step-in 0.2s ease-out;
}
@keyframes ftp-step-in {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}

.step-title {
  font-size: 15px; font-weight: 600; color: var(--ftp-text); margin-bottom: 4px;
}
.step-subtitle {
  font-size: 12px; color: var(--ftp-text-secondary); margin-bottom: 14px;
}

/* Category picker */
.category-grid { display: flex; flex-direction: column; gap: 10px; }
.category-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border: 2px solid var(--ftp-border); border-radius: 10px;
  background: var(--ftp-bg); color: var(--ftp-text); cursor: pointer;
  font-size: 14px; font-weight: 500; transition: all 0.15s; text-align: left;
  width: 100%;
}
.category-card:hover { border-color: var(--ftp-primary); background: rgba(99,102,241,0.04); }
.category-card .cat-emoji { font-size: 26px; flex-shrink: 0; }
.category-card .cat-label { font-weight: 600; }
.category-card .cat-desc { font-size: 12px; color: var(--ftp-text-secondary); margin-top: 1px; }

/* Severity buttons */
.severity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.severity-btn {
  padding: 12px 8px; border: 2px solid var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text); cursor: pointer;
  font-size: 13px; font-weight: 500; text-align: center; transition: all 0.15s;
}
.severity-btn:hover { border-color: var(--ftp-primary); }
.severity-btn.active { border-color: var(--ftp-primary); background: rgba(99,102,241,0.08); color: var(--ftp-primary); }
.severity-btn .sev-icon { font-size: 20px; display: block; margin-bottom: 4px; }

/* Form inputs */
input[type="text"], textarea {
  width: 100%; padding: 10px 12px; border: 1.5px solid var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text); font-size: 14px; font-family: inherit;
  transition: border-color 0.15s;
}
input:focus, textarea:focus { outline: none; border-color: var(--ftp-primary); }
textarea { resize: vertical; min-height: 80px; }

/* Nav buttons */
.nav-row { display: flex; gap: 8px; margin-top: 16px; }
.btn {
  padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; border: none;
}
.btn-back {
  background: var(--ftp-bg-secondary); color: var(--ftp-text-secondary); border: 1px solid var(--ftp-border);
}
.btn-back:hover { background: var(--ftp-border); }
.btn-next {
  flex: 1; background: var(--ftp-primary); color: white;
}
.btn-next:hover { background: var(--ftp-primary-hover); }
.btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-skip {
  background: transparent; color: var(--ftp-text-secondary); text-decoration: underline;
  font-weight: 400;
}
.btn-skip:hover { color: var(--ftp-text); }
.btn-submit {
  flex: 1; background: var(--ftp-success); color: white;
}
.btn-submit:hover { background: #059669; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* Summary */
.summary { display: flex; flex-direction: column; gap: 10px; }
.summary-item {
  padding: 10px 12px; background: var(--ftp-bg-secondary); border-radius: 8px;
  border: 1px solid var(--ftp-border);
}
.summary-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--ftp-text-secondary); margin-bottom: 3px;
}
.summary-value {
  font-size: 13px; color: var(--ftp-text); word-break: break-word;
  white-space: pre-wrap; max-height: 60px; overflow: hidden;
}

/* Success */
.success { text-align: center; padding: 40px 20px; }
.success .check { font-size: 48px; margin-bottom: 12px; animation: ftp-pop 0.4s ease-out; }
@keyframes ftp-pop {
  0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); }
}
.success h3 { font-size: 18px; margin-bottom: 6px; color: var(--ftp-text); }
.success p { color: var(--ftp-text-secondary); font-size: 13px; }

.error-msg { color: var(--ftp-error); font-size: 12px; margin-top: 8px; }

.powered {
  padding: 8px 20px; text-align: center; font-size: 10px; color: var(--ftp-text-secondary);
  border-top: 1px solid var(--ftp-border); background: var(--ftp-bg-secondary);
}
.powered a { color: var(--ftp-text-secondary); text-decoration: none; }
.powered a:hover { color: var(--ftp-primary); }

@media (max-width: 440px) {
  .overlay { width: calc(100vw - 24px); left: 12px !important; right: 12px !important; }
}
`;
