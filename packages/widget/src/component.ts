import { styles } from './styles.js';

interface FTPConfig {
  appId: string;
  apiUrl: string;
  position: string;
  theme: string;
  categories: string[];
  user: { id?: string; email?: string };
  onSubmit?: (data: any) => void;
  onError?: (err: Error) => void;
}

type Category = 'bug' | 'suggestion' | 'question';

interface WizardState {
  category: Category | null;
  step: number; // 0 = category picker
  data: Record<string, string>;
}

const FLOWS: Record<Category, { steps: { key: string; title: string; subtitle: string; type: 'input' | 'textarea' | 'severity'; required: boolean; placeholder?: string; defaultValue?: () => string }[]; totalSteps: number }> = {
  bug: {
    totalSteps: 4,
    steps: [
      { key: 'title', title: 'What happened?', subtitle: 'Give a brief title for the bug', type: 'input', required: true, placeholder: 'e.g. Button doesn\'t respond when clicked' },
      { key: 'reproduction', title: 'Steps to reproduce', subtitle: 'What were you doing when this happened?', type: 'textarea', required: false, placeholder: 'I clicked on... then I...' },
      { key: 'expected', title: 'Expected vs actual', subtitle: 'What should have happened instead?', type: 'textarea', required: false, placeholder: 'I expected... but instead...' },
      { key: 'severity', title: 'How severe is this?', subtitle: 'Pick the option that best describes the impact', type: 'severity', required: true },
    ],
  },
  suggestion: {
    totalSteps: 3,
    steps: [
      { key: 'title', title: 'What\'s your idea?', subtitle: 'A short title for your suggestion', type: 'input', required: true, placeholder: 'e.g. Add dark mode support' },
      { key: 'description', title: 'Tell us more', subtitle: 'Describe your idea in detail', type: 'textarea', required: false, placeholder: 'It would be great if...' },
      { key: 'motivation', title: 'Why does it matter?', subtitle: 'Help us understand the value (optional)', type: 'textarea', required: false, placeholder: 'This would help because...' },
    ],
  },
  question: {
    totalSteps: 2,
    steps: [
      { key: 'title', title: 'What\'s your question?', subtitle: 'Ask away — no question is too small', type: 'textarea', required: true, placeholder: 'How do I...' },
      { key: 'context', title: 'Where are you stuck?', subtitle: 'Share the page or context (optional)', type: 'input', required: false, placeholder: 'URL or description', defaultValue: () => window.location.href },
    ],
  },
};

const SEVERITY_OPTIONS = [
  { value: 'blocking', label: 'Blocking', icon: '🔴', desc: 'Can\'t continue' },
  { value: 'major', label: 'Major', icon: '🟠', desc: 'Significant issue' },
  { value: 'minor', label: 'Minor', icon: '🟡', desc: 'Small annoyance' },
  { value: 'cosmetic', label: 'Cosmetic', icon: '🟢', desc: 'Visual only' },
];

const STORAGE_KEY = 'ftp-feedback-draft';

const DEFAULT_API = 'https://ftp-feedback-api.onrender.com';

export class FTPFeedbackElement extends HTMLElement {
  private shadow: ShadowRoot;
  private config: FTPConfig;
  private isOpen = false;
  private wizard: WizardState = { category: null, step: 0, data: {} };
  private submitting = false;

  static get observedAttributes() {
    return ['app-id', 'api-url', 'position', 'theme', 'categories', 'user-id', 'user-email', 'branding'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.config = {
      appId: '',
      apiUrl: DEFAULT_API,
      position: 'bottom-right',
      theme: 'light',
      categories: ['bug', 'suggestion', 'question'],
      user: {},
    };
  }

  connectedCallback() {
    this.config.appId = this.getAttribute('app-id') || this.config.appId;
    this.config.apiUrl = this.getAttribute('api-url') || this.config.apiUrl;
    this.config.position = this.getAttribute('position') || this.config.position;
    this.config.theme = this.getAttribute('theme') || this.config.theme;
    this.config.user.id = this.getAttribute('user-id') || undefined;
    this.config.user.email = this.getAttribute('user-email') || undefined;
    const cats = this.getAttribute('categories');
    if (cats) this.config.categories = cats.split(',').map(s => s.trim());
    if (this.config.theme !== 'light') this.setAttribute('theme', this.config.theme);
    this.loadDraft();
    this.render();
  }

  configure(opts: Partial<FTPConfig>) {
    Object.assign(this.config, opts);
    if (opts.theme) this.setAttribute('theme', opts.theme);
    this.render();
  }

  open() { this.isOpen = true; this.render(); }
  close() {
    this.isOpen = false;
    this.submitting = false;
    this.render();
  }

  private resetWizard() {
    this.wizard = { category: null, step: 0, data: {} };
    this.clearDraft();
  }

  private saveDraft() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.wizard)); } catch {}
  }

  private loadDraft() {
    try {
      const d = sessionStorage.getItem(STORAGE_KEY);
      if (d) { const parsed = JSON.parse(d); if (parsed.category) this.wizard = parsed; }
    } catch {}
  }

  private clearDraft() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }

  private get flow() {
    return this.wizard.category ? FLOWS[this.wizard.category] : null;
  }

  private get totalStepsWithConfirm() {
    return this.flow ? this.flow.totalSteps + 1 : 0; // +1 for confirm
  }

  private get currentFlowStep() {
    return this.flow?.steps[this.wizard.step - 1];
  }

  private get isConfirmStep() {
    return this.flow && this.wizard.step === this.flow.totalSteps + 1;
  }

  private canProceed(): boolean {
    const step = this.currentFlowStep;
    if (!step) return true;
    if (!step.required) return true;
    const val = this.wizard.data[step.key]?.trim();
    return !!val;
  }

  private render() {
    const pos = this.config.position;
    this.shadow.innerHTML = `
      <style>${styles}</style>
      <button class="trigger ${pos}" id="trigger">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      ${this.isOpen ? this.renderOverlay() : ''}
    `;
    this.bindEvents();
  }

  private renderOverlay(): string {
    const pos = this.config.position;
    const headerTitle = this.wizard.step === 0 ? 'Send Feedback' :
      this.isConfirmStep ? 'Confirm & Submit' :
      `${this.categoryLabel(this.wizard.category!)}`;

    return `
      <div class="overlay ${pos}" id="overlay">
        <div class="header">
          <h3>${headerTitle}</h3>
          <button class="close-btn" id="close">&times;</button>
        </div>
        ${this.wizard.step > 0 ? this.renderProgress() : ''}
        <div class="body" id="formBody">
          ${this.renderStep()}
        </div>
        ${this.getAttribute('branding') !== 'false' ? '<div class="powered">Powered by <a href="https://github.com/for-the-people-initiative/ftp-feedback" target="_blank">FTP Feedback</a></div>' : ''}
      </div>
    `;
  }

  private renderProgress(): string {
    const total = this.totalStepsWithConfirm;
    let dots = '';
    for (let i = 1; i <= total; i++) {
      const cls = i < this.wizard.step ? 'done' : i === this.wizard.step ? 'active' : '';
      dots += `<div class="progress-dot ${cls}"></div>`;
    }
    return `<div class="progress">${dots}</div>`;
  }

  private renderStep(): string {
    if (this.wizard.step === 0) return this.renderCategoryPicker();
    if (this.isConfirmStep) return this.renderConfirm();
    return this.renderFlowStep();
  }

  private renderCategoryPicker(): string {
    const cats: { type: Category; emoji: string; label: string; desc: string }[] = [
      { type: 'bug', emoji: '🐛', label: 'Bug Report', desc: 'Something isn\'t working right' },
      { type: 'suggestion', emoji: '💡', label: 'Suggestion', desc: 'I have an idea to improve things' },
      { type: 'question', emoji: '❓', label: 'Question', desc: 'I need help with something' },
    ];
    return `
      <div class="step-content">
        <div class="step-title">What kind of feedback?</div>
        <div class="step-subtitle">Choose a category to get started</div>
        <div class="category-grid">
          ${cats.filter(c => this.config.categories.includes(c.type)).map(c => `
            <button class="category-card" data-cat="${c.type}">
              <span class="cat-emoji">${c.emoji}</span>
              <div><div class="cat-label">${c.label}</div><div class="cat-desc">${c.desc}</div></div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  private renderFlowStep(): string {
    const step = this.currentFlowStep!;
    const val = this.wizard.data[step.key] ?? (step.defaultValue?.() || '');
    const isOptional = !step.required;
    const isLastBeforeConfirm = this.wizard.step === this.flow!.totalSteps;

    let fieldHtml = '';
    if (step.type === 'input') {
      fieldHtml = `<input type="text" id="stepInput" placeholder="${step.placeholder || ''}" value="${this.escAttr(val)}" maxlength="200">`;
    } else if (step.type === 'textarea') {
      fieldHtml = `<textarea id="stepInput" placeholder="${step.placeholder || ''}" rows="4">${this.escHtml(val)}</textarea>`;
    } else if (step.type === 'severity') {
      fieldHtml = `<div class="severity-grid">${SEVERITY_OPTIONS.map(s => `
        <button class="severity-btn ${val === s.value ? 'active' : ''}" data-sev="${s.value}">
          <span class="sev-icon">${s.icon}</span>${s.label}
        </button>
      `).join('')}</div>`;
    }

    return `
      <div class="step-content">
        <div class="step-title">${step.title}</div>
        <div class="step-subtitle">${step.subtitle}</div>
        ${fieldHtml}
        <div id="errorMsg" class="error-msg" style="display:none"></div>
        <div class="nav-row">
          <button class="btn btn-back" id="backBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Back</button>
          <button class="btn btn-next" id="nextBtn">${isLastBeforeConfirm ? 'Review' : 'Next'} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
        </div>
      </div>
    `;
  }

  private renderConfirm(): string {
    const cat = this.wizard.category!;
    const flow = FLOWS[cat];
    const items = flow.steps
      .filter(s => this.wizard.data[s.key]?.trim())
      .map(s => {
        let displayVal = this.wizard.data[s.key];
        if (s.type === 'severity') {
          const opt = SEVERITY_OPTIONS.find(o => o.value === displayVal);
          displayVal = opt ? `${opt.icon} ${opt.label}` : displayVal;
        }
        return `<div class="summary-item"><div class="summary-label">${s.title}</div><div class="summary-value">${this.escHtml(displayVal)}</div></div>`;
      }).join('');

    return `
      <div class="step-content">
        <div class="step-title">Review your ${this.categoryLabel(cat).toLowerCase()}</div>
        <div class="step-subtitle">Make sure everything looks good</div>
        <div class="summary">${items}</div>
        <div id="errorMsg" class="error-msg" style="display:none"></div>
        <div class="nav-row">
          <button class="btn btn-back" id="backBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Back</button>
          <button class="btn btn-submit" id="submitBtn" ${this.submitting ? 'disabled' : ''}>${this.submitting ? 'Submitting...' : 'Submit ✓'}</button>
        </div>
      </div>
    `;
  }

  private categoryLabel(cat: Category): string {
    return cat === 'bug' ? '🐛 Bug Report' : cat === 'suggestion' ? '💡 Suggestion' : '❓ Question';
  }

  private bindEvents() {
    this.shadow.getElementById('trigger')?.addEventListener('click', () => this.isOpen ? this.close() : this.open());
    this.shadow.getElementById('close')?.addEventListener('click', () => this.close());

    // Category picker
    this.shadow.querySelectorAll('.category-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = (btn as HTMLElement).dataset.cat as Category;
        this.wizard.category = cat;
        this.wizard.step = 1;
        // Pre-fill defaults
        const flow = FLOWS[cat];
        flow.steps.forEach(s => {
          if (s.defaultValue && !this.wizard.data[s.key]) {
            this.wizard.data[s.key] = s.defaultValue();
          }
        });
        this.saveDraft();
        this.render();
      });
    });

    // Input tracking
    const input = this.shadow.getElementById('stepInput') as HTMLInputElement | HTMLTextAreaElement;
    if (input) {
      input.addEventListener('input', () => {
        const step = this.currentFlowStep;
        if (step) {
          this.wizard.data[step.key] = input.value;
          this.saveDraft();
        }
      });
      // Auto-focus
      requestAnimationFrame(() => input.focus());
    }

    // Severity buttons
    this.shadow.querySelectorAll('.severity-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = (btn as HTMLElement).dataset.sev!;
        this.wizard.data['severity'] = val;
        this.saveDraft();
        this.shadow.querySelectorAll('.severity-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const nextBtn = this.shadow.getElementById('nextBtn') as HTMLButtonElement;
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    // Navigation
    this.shadow.getElementById('backBtn')?.addEventListener('click', () => {
      if (this.wizard.step <= 1) {
        this.wizard.step = 0;
        this.wizard.category = null;
      } else {
        this.wizard.step--;
      }
      this.saveDraft();
      this.render();
    });

    this.shadow.getElementById('nextBtn')?.addEventListener('click', () => {
      this.wizard.step++;
      this.saveDraft();
      this.render();
    });

    this.shadow.getElementById('submitBtn')?.addEventListener('click', () => this.submit());
  }

  private async submit() {
    if (this.submitting) return;
    this.submitting = true;
    this.render();

    const cat = this.wizard.category!;
    const d = this.wizard.data;

    let body: Record<string, string> = {};
    let metadata: Record<string, string> = {};

    if (cat === 'bug') {
      body = { reproduction: d.reproduction || '', expected: d.expected || '' };
      metadata = { severity: d.severity || '' };
    } else if (cat === 'suggestion') {
      body = { description: d.description || '', motivation: d.motivation || '' };
    } else {
      body = { context: d.context || '' };
    }

    const autoContext = this.collectMetadata();
    const payload = {
      type: cat,
      title: d.title || '',
      body: JSON.stringify(body),
      user_id: this.config.user.id,
      user_email: this.config.user.email,
      page_url: window.location.href,
      route: window.location.pathname,
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      metadata: { ...autoContext, ...metadata },
    };

    try {
      const res = await fetch(`${this.config.apiUrl}/v1/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-App-Id': this.config.appId },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || `HTTP ${res.status}`);
      }
      this.config.onSubmit?.(payload);
      this.clearDraft();
      this.showSuccess();
    } catch (err: any) {
      this.submitting = false;
      this.render();
      const errorMsg = this.shadow.getElementById('errorMsg');
      if (errorMsg) {
        errorMsg.textContent = err.message || 'Failed to submit';
        errorMsg.style.display = 'block';
      }
      this.config.onError?.(err);
    }
  }

  private collectMetadata(): Record<string, any> {
    const ua = navigator.userAgent;
    const nav = navigator as any;
    let os = 'Unknown';
    if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
    else if (/Windows NT/.test(ua)) os = 'Windows';
    else if (/Mac OS X (\d+[._]\d+)/.test(ua)) { os = `macOS ${RegExp.$1.replace('_', '.')}`; }
    else if (/iPhone OS (\d+[._]\d+)/.test(ua)) { os = `iOS ${RegExp.$1.replace('_', '.')}`; }
    else if (/Android (\d+(\.\d+)?)/.test(ua)) os = `Android ${RegExp.$1}`;
    else if (/Linux/.test(ua)) os = 'Linux';

    let browser = 'Unknown';
    if (/Edg\/(\d+)/.test(ua)) browser = `Edge ${RegExp.$1}`;
    else if (/Chrome\/(\d+)/.test(ua)) browser = `Chrome ${RegExp.$1}`;
    else if (/Safari\/(\d+)/.test(ua) && /Version\/(\d+(\.\d+)?)/.test(ua)) browser = `Safari ${RegExp.$1}`;
    else if (/Firefox\/(\d+)/.test(ua)) browser = `Firefox ${RegExp.$1}`;

    const isMobile = /Mobi|Android.*Mobile|iPhone/.test(ua);
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    return {
      device_type: isMobile ? 'mobile' : 'desktop',
      os, browser,
      screen_resolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection_type: conn?.effectiveType || null,
      color_scheme: window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light',
      pixel_ratio: window.devicePixelRatio,
      online: navigator.onLine,
      referrer: document.referrer || null,
    };
  }

  private showSuccess() {
    this.wizard = { category: null, step: 0, data: {} };
    const body = this.shadow.getElementById('formBody');
    if (body) {
      body.innerHTML = `
        <div class="success">
          <div class="check">✅</div>
          <h3>Thank you!</h3>
          <p>Your feedback has been submitted.</p>
        </div>
      `;
    }
    setTimeout(() => this.close(), 2500);
  }

  private escHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  private escAttr(s: string): string {
    return this.escHtml(s).replace(/"/g, '&quot;');
  }
}
