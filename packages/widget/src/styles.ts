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
  position: fixed;
  z-index: 99999;
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--ftp-primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
  position: fixed;
  z-index: 100000;
  width: 380px;
  max-height: 560px;
  background: var(--ftp-bg);
  border-radius: var(--ftp-radius);
  box-shadow: var(--ftp-shadow);
  border: 1px solid var(--ftp-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  padding: 16px 20px;
  background: var(--ftp-primary);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header h3 { font-size: 16px; font-weight: 600; }
.close-btn {
  background: none; border: none; color: white; cursor: pointer;
  width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { background: rgba(255,255,255,0.2); }

.body { padding: 16px 20px; overflow-y: auto; flex: 1; }

.field { margin-bottom: 14px; }
.field label { display: block; font-size: 12px; font-weight: 600; color: var(--ftp-text-secondary); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }

.type-selector { display: flex; gap: 8px; }
.type-btn {
  flex: 1; padding: 8px 4px; border: 2px solid var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text); cursor: pointer; font-size: 12px;
  font-weight: 500; text-align: center; transition: all 0.15s;
}
.type-btn:hover { border-color: var(--ftp-primary); }
.type-btn.active { border-color: var(--ftp-primary); background: rgba(99,102,241,0.08); color: var(--ftp-primary); }
.type-btn .emoji { font-size: 18px; display: block; margin-bottom: 2px; }

input[type="text"], textarea {
  width: 100%; padding: 10px 12px; border: 1.5px solid var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text); font-size: 14px; font-family: inherit;
  transition: border-color 0.15s;
}
input:focus, textarea:focus { outline: none; border-color: var(--ftp-primary); }
textarea { resize: vertical; min-height: 80px; }

.screenshots { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.screenshot-preview {
  width: 64px; height: 64px; border-radius: 6px; overflow: hidden; position: relative;
  border: 1px solid var(--ftp-border);
}
.screenshot-preview img { width: 100%; height: 100%; object-fit: cover; }
.screenshot-remove {
  position: absolute; top: -4px; right: -4px; width: 18px; height: 18px;
  border-radius: 50%; background: var(--ftp-error); color: white; border: none;
  font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
}

.upload-btn {
  width: 64px; height: 64px; border: 2px dashed var(--ftp-border); border-radius: 6px;
  background: var(--ftp-bg-secondary); cursor: pointer; display: flex; flex-direction: column;
  align-items: center; justify-content: center; font-size: 10px; color: var(--ftp-text-secondary);
  transition: border-color 0.15s;
}
.upload-btn:hover { border-color: var(--ftp-primary); }
.upload-btn svg { width: 20px; height: 20px; margin-bottom: 2px; }

.screenshot-help {
  margin-top: 8px;
}
.screenshot-help summary {
  font-size: 11px; color: var(--ftp-text-secondary); cursor: pointer; user-select: none;
}
.screenshot-help .help-content {
  margin-top: 6px; padding: 10px; background: var(--ftp-bg-secondary); border-radius: 6px; font-size: 11px; color: var(--ftp-text-secondary); line-height: 1.6;
}
.screenshot-help .help-content strong { color: var(--ftp-text); }

.submit-btn {
  width: 100%; padding: 12px; background: var(--ftp-primary); color: white; border: none;
  border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
  transition: background 0.15s; margin-top: 4px;
}
.submit-btn:hover { background: var(--ftp-primary-hover); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.success {
  text-align: center; padding: 40px 20px;
}
.success .check { font-size: 48px; margin-bottom: 12px; }
.success h3 { font-size: 18px; margin-bottom: 6px; color: var(--ftp-text); }
.success p { color: var(--ftp-text-secondary); font-size: 13px; }

.error-msg { color: var(--ftp-error); font-size: 12px; margin-top: 4px; }

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
