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

const DEFAULT_API = 'https://ftp-feedback-api.onrender.com';

export class FTPFeedbackElement extends HTMLElement {
  private shadow: ShadowRoot;
  private config: FTPConfig;
  private isOpen = false;
  private screenshots: string[] = [];

  static get observedAttributes() {
    return ['app-id', 'api-url', 'position', 'theme', 'categories', 'user-id', 'user-email'];
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

    if (this.config.theme !== 'light') {
      this.setAttribute('theme', this.config.theme);
    }

    this.render();
  }

  configure(opts: Partial<FTPConfig>) {
    Object.assign(this.config, opts);
    if (opts.theme) this.setAttribute('theme', opts.theme);
    this.render();
  }

  open() { this.isOpen = true; this.render(); }
  close() { this.isOpen = false; this.screenshots = []; this.render(); }

  private render() {
    const pos = this.config.position;
    this.shadow.innerHTML = `
      <style>${styles}</style>
      <button class="trigger ${pos}" id="trigger">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      ${this.isOpen ? this.renderForm() : ''}
    `;
    this.bindEvents();
  }

  private renderForm() {
    const pos = this.config.position;
    return `
      <div class="overlay ${pos}" id="overlay">
        <div class="header">
          <h3>Send Feedback</h3>
          <button class="close-btn" id="close">&times;</button>
        </div>
        <div class="body" id="formBody">
          <div class="field">
            <label>Type</label>
            <div class="type-selector" id="typeSelector">
              ${this.config.categories.map((cat, i) => `
                <button class="type-btn ${i === 0 ? 'active' : ''}" data-type="${cat}">
                  <span class="emoji">${cat === 'bug' ? '🐛' : cat === 'suggestion' ? '💡' : cat === 'question' ? '❓' : '📝'}</span>
                  ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              `).join('')}
            </div>
          </div>
          <div class="field">
            <label>Title</label>
            <input type="text" id="title" placeholder="Brief summary..." maxlength="200">
          </div>
          <div class="field">
            <label>Description</label>
            <textarea id="description" placeholder="Tell us more..." rows="3"></textarea>
          </div>
          <div class="field">
            <label>Screenshots</label>
            <div class="screenshots" id="screenshots">
              <label class="upload-btn" id="uploadBtn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                Add
                <input type="file" accept="image/*" multiple hidden id="fileInput">
              </label>
            </div>
            <details class="screenshot-help">
              <summary>📸 How to take a screenshot</summary>
              <div class="help-content">
                <strong>Windows:</strong> Win + Shift + S (Snipping Tool)<br>
                <strong>Mac:</strong> Cmd + Shift + 4 (area) or Cmd + Shift + 3 (full)<br>
                <strong>Linux:</strong> PrtSc or use Flameshot<br>
                <strong>Mobile:</strong> Power + Volume Down<br><br>
                Then paste or upload the image above.
              </div>
            </details>
          </div>
          <div id="errorMsg" class="error-msg" style="display:none"></div>
          <button class="submit-btn" id="submitBtn">Submit Feedback</button>
        </div>
        <div class="powered">Powered by <a href="https://github.com/for-the-people-initiative/ftp-feedback" target="_blank">FTP Feedback</a></div>
      </div>
    `;
  }

  private bindEvents() {
    const trigger = this.shadow.getElementById('trigger');
    trigger?.addEventListener('click', () => { this.isOpen ? this.close() : this.open(); });

    const closeBtn = this.shadow.getElementById('close');
    closeBtn?.addEventListener('click', () => this.close());

    // Type selector
    const typeSelector = this.shadow.getElementById('typeSelector');
    typeSelector?.querySelectorAll('.type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        typeSelector.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // File input
    const fileInput = this.shadow.getElementById('fileInput') as HTMLInputElement;
    fileInput?.addEventListener('change', () => {
      if (fileInput.files) {
        Array.from(fileInput.files).forEach(file => this.addScreenshot(file));
        fileInput.value = '';
      }
    });

    // Paste support on overlay
    const overlay = this.shadow.getElementById('overlay');
    overlay?.addEventListener('paste', (e: Event) => {
      const ce = e as ClipboardEvent;
      const items = ce.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) this.addScreenshot(file);
        }
      }
    });

    // Submit
    const submitBtn = this.shadow.getElementById('submitBtn');
    submitBtn?.addEventListener('click', () => this.submit());
  }

  private addScreenshot(file: File) {
    if (this.screenshots.length >= 5) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.screenshots.push(reader.result as string);
      this.renderScreenshots();
    };
    reader.readAsDataURL(file);
  }

  private renderScreenshots() {
    const container = this.shadow.getElementById('screenshots');
    if (!container) return;
    // Remove existing previews (keep upload button)
    container.querySelectorAll('.screenshot-preview').forEach(el => el.remove());
    const uploadBtn = container.querySelector('.upload-btn');

    this.screenshots.forEach((src, i) => {
      const div = document.createElement('div');
      div.className = 'screenshot-preview';
      div.innerHTML = `<img src="${src}"><button class="screenshot-remove" data-idx="${i}">&times;</button>`;
      container.insertBefore(div, uploadBtn);
    });

    // Bind remove buttons
    container.querySelectorAll('.screenshot-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.target as HTMLElement).getAttribute('data-idx') || '0');
        this.screenshots.splice(idx, 1);
        this.renderScreenshots();
      });
    });

    // Hide upload if max reached
    if (uploadBtn) {
      (uploadBtn as HTMLElement).style.display = this.screenshots.length >= 5 ? 'none' : '';
    }
  }

  private async submit() {
    const typeBtn = this.shadow.querySelector('.type-btn.active') as HTMLElement;
    const titleInput = this.shadow.getElementById('title') as HTMLInputElement;
    const descInput = this.shadow.getElementById('description') as HTMLTextAreaElement;
    const submitBtn = this.shadow.getElementById('submitBtn') as HTMLButtonElement;
    const errorMsg = this.shadow.getElementById('errorMsg') as HTMLElement;

    const type = typeBtn?.dataset.type || 'bug';
    const title = titleInput?.value?.trim();

    if (!title) {
      errorMsg.textContent = 'Please enter a title';
      errorMsg.style.display = 'block';
      return;
    }

    errorMsg.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const payload = {
      type,
      title,
      body: descInput?.value?.trim() || undefined,
      user_id: this.config.user.id,
      user_email: this.config.user.email,
      page_url: window.location.href,
      route: window.location.pathname,
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screenshots: this.screenshots.length ? this.screenshots : undefined,
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
      this.showSuccess();
    } catch (err: any) {
      errorMsg.textContent = err.message || 'Failed to submit';
      errorMsg.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
      this.config.onError?.(err);
    }
  }

  private showSuccess() {
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
    setTimeout(() => { this.close(); }, 2500);
  }
}
