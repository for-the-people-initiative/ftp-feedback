import { FTPFeedbackElement } from './component.js';

// Register web component
if (!customElements.get('ftp-feedback')) {
  customElements.define('ftp-feedback', FTPFeedbackElement);
}

// Programmatic API
export const FTPFeedback = {
  _el: null as FTPFeedbackElement | null,

  init(opts: {
    appId: string;
    apiUrl?: string;
    position?: string;
    theme?: string;
    categories?: string[];
    user?: { id?: string; email?: string };
    onSubmit?: (data: any) => void;
    onError?: (err: Error) => void;
  }) {
    // Remove existing
    document.querySelector('ftp-feedback')?.remove();

    const el = document.createElement('ftp-feedback') as FTPFeedbackElement;
    el.setAttribute('app-id', opts.appId);
    if (opts.apiUrl) el.setAttribute('api-url', opts.apiUrl);
    if (opts.position) el.setAttribute('position', opts.position);
    if (opts.theme) el.setAttribute('theme', opts.theme);
    if (opts.categories) el.setAttribute('categories', opts.categories.join(','));
    if (opts.user?.id) el.setAttribute('user-id', opts.user.id);
    if (opts.user?.email) el.setAttribute('user-email', opts.user.email);
    document.body.appendChild(el);

    // Set callbacks after connected
    requestAnimationFrame(() => {
      el.configure({ onSubmit: opts.onSubmit, onError: opts.onError } as any);
    });

    this._el = el;
    return el;
  },

  open() { this._el?.open(); },
  close() { this._el?.close(); },
};

// Auto-init from script tag
(function autoInit() {
  const script = document.currentScript || document.querySelector('script[data-app-id]');
  if (script && script instanceof HTMLScriptElement) {
    const appId = script.getAttribute('data-app-id');
    if (appId) {
      // Wait for DOM
      const init = () => {
        FTPFeedback.init({
          appId,
          apiUrl: script.getAttribute('data-api-url') || undefined,
          position: script.getAttribute('data-position') || undefined,
          theme: script.getAttribute('data-theme') || undefined,
          categories: script.getAttribute('data-categories')?.split(',').map(s => s.trim()),
          user: {
            id: script.getAttribute('data-user-id') || undefined,
            email: script.getAttribute('data-user-email') || undefined,
          },
        });
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    }
  }
})();

export { FTPFeedbackElement };
export { TrustScore } from './trust.js';
export type { TrustThresholds, TrustResult, TrustSignals } from './trust.js';
export default FTPFeedback;
