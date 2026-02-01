var FTPFeedback=(function(l){"use strict";var A=Object.defineProperty;var T=(l,h,g)=>h in l?A(l,h,{enumerable:!0,configurable:!0,writable:!0,value:g}):l[h]=g;var p=(l,h,g)=>T(l,typeof h!="symbol"?h+"":h,g);const h=`
:host {
  --ftp-primary: #f97316;
  --ftp-primary-hover: #fb923c;
  --ftp-bg: #ffffff;
  --ftp-bg-secondary: #f5f5f5;
  --ftp-text: #0a0e1f;
  --ftp-text-secondary: #7680a9;
  --ftp-border: #e5e7eb;
  --ftp-shadow: 0 8px 16px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08);
  --ftp-radius: 13px;
  --ftp-success: #22c55e;
  --ftp-error: #ef4444;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ftp-text);
}
:host([theme="dark"]) {
  --ftp-primary: #f97316;
  --ftp-primary-hover: #fb923c;
  --ftp-bg: #11162d;
  --ftp-bg-secondary: #0a0e1f;
  --ftp-text: #ffffff;
  --ftp-text-secondary: #9ea5c2;
  --ftp-border: #242e5c;
}
* { box-sizing: border-box; margin: 0; padding: 0; }

.trigger {
  position: fixed; z-index: 99999;
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #f59e0b); color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(249,115,22,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.trigger:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(249,115,22,0.5); }
.trigger svg { width: 24px; height: 24px; }
.bottom-right { bottom: 26px; right: 26px; }
.bottom-left { bottom: 26px; left: 26px; }
.top-right { top: 26px; right: 26px; }
.top-left { top: 26px; left: 26px; }

.overlay {
  position: fixed; z-index: 100000;
  width: 380px; max-height: 560px;
  background: var(--ftp-bg); border-radius: var(--ftp-radius);
  box-shadow: var(--ftp-shadow); border: 1px solid var(--ftp-border);
  overflow: hidden; display: flex; flex-direction: column;
  animation: ftp-slide-in 0.25s ease-out;
}
.overlay.bottom-right { bottom: 86px; right: 26px; }
.overlay.bottom-left { bottom: 86px; left: 26px; }
.overlay.top-right { top: 86px; right: 26px; }
.overlay.top-left { top: 86px; left: 26px; }
@keyframes ftp-slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  padding: 16px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white;
  display: flex; justify-content: space-between; align-items: center;
}
.header h3 { font-size: 15px; font-weight: 600; }
.close-btn {
  background: none; border: none; color: white; cursor: pointer;
  width: 36px; height: 36px; border-radius: 5px;
  display: flex; align-items: center; justify-content: center; font-size: 24px;
}
.close-btn:hover { background: rgba(255,255,255,0.2); }

/* Progress bar */
.progress { display: flex; gap: 6px; padding: 10px 16px 0; }
.progress-dot {
  height: 4px; flex: 1; border-radius: 2px;
  background: var(--ftp-border); transition: background 0.3s;
}
.progress-dot.active { background: #f97316; }
.progress-dot.done { background: #f97316; opacity: 0.5; }

/* Step container */
.body { padding: 16px; overflow-y: auto; flex: 1; }

.step-content {
  animation: ftp-step-in 0.2s ease-out;
}
@keyframes ftp-step-in {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}

.step-title {
  font-size: 15px; font-weight: 600; color: var(--ftp-text); margin-bottom: 4px;
}
.step-subtitle {
  font-size: 12px; color: var(--ftp-text-secondary); margin-bottom: 16px;
}

/* Category picker */
.category-grid { display: flex; flex-direction: column; gap: 10px; }
.category-card {
  display: flex; align-items: center; gap: 16px;
  padding: 16px; border: 2px solid var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text); cursor: pointer;
  font-size: 14px; font-weight: 500; transition: all 0.15s; text-align: left;
  width: 100%;
}
.category-card:hover { border-color: #f97316; background: rgba(249,115,22,0.04); }
.category-card .cat-emoji { font-size: 26px; flex-shrink: 0; }
.category-card .cat-label { font-weight: 600; }
.category-card .cat-desc { font-size: 12px; color: var(--ftp-text-secondary); margin-top: 2px; }

/* Severity buttons */
.severity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.severity-btn {
  padding: 10px; border: 2px solid var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text); cursor: pointer;
  font-size: 13px; font-weight: 500; text-align: center; transition: all 0.15s;
}
.severity-btn:hover { border-color: #f97316; }
.severity-btn.active { border-color: #f97316; background: rgba(249,115,22,0.08); color: #f97316; }
.severity-btn .sev-icon { font-size: 20px; display: block; margin-bottom: 4px; }

/* Form inputs */
input[type="text"], textarea {
  width: 100%; padding: 10px 12px; border: 1.5px solid var(--ftp-border); border-radius: 5px;
  background: var(--ftp-bg); color: var(--ftp-text); font-size: 14px; font-family: inherit;
  transition: border-color 0.15s;
}
input:focus, textarea:focus { outline: none; border-color: #f97316; }
textarea { resize: vertical; min-height: 80px; }

/* Nav buttons */
.nav-row { display: flex; gap: 10px; margin-top: 16px; }
.btn {
  padding: 10px 16px; border-radius: 5px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; border: none;
  display: inline-flex; align-items: center; gap: 6px;
}
.btn svg { flex-shrink: 0; }
.btn-back {
  background: var(--ftp-bg-secondary); color: var(--ftp-text-secondary); border: 1px solid var(--ftp-border);
}
.btn-back:hover { background: var(--ftp-border); }
.btn-next {
  margin-left: auto; background: linear-gradient(135deg, #f97316, #f59e0b); color: white;
}
.btn-next:hover { opacity: 0.9; }
.btn-submit {
  margin-left: auto; background: #22c55e; color: white;
}
.btn-submit:hover { background: #16a34a; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* Summary */
.summary { display: flex; flex-direction: column; gap: 10px; }
.summary-item {
  padding: 10px 12px; background: var(--ftp-bg-secondary); border-radius: 8px;
  border: 1px solid var(--ftp-border);
}
.summary-label {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--ftp-text-secondary); margin-bottom: 4px;
}
.summary-value {
  font-size: 13px; color: var(--ftp-text); word-break: break-word;
  white-space: pre-wrap; max-height: 60px; overflow: hidden;
}

/* Success */
.success { text-align: center; padding: 42px 16px; }
.success .check { font-size: 42px; margin-bottom: 10px; animation: ftp-pop 0.4s ease-out; }
@keyframes ftp-pop {
  0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); }
}
.success h3 { font-size: 18px; margin-bottom: 6px; color: var(--ftp-text); }
.success p { color: var(--ftp-text-secondary); font-size: 13px; }

.error-msg { color: var(--ftp-error); font-size: 12px; margin-top: 10px; }

.powered {
  padding: 10px 16px; text-align: center; font-size: 10px; color: var(--ftp-text-secondary);
  border-top: 1px solid var(--ftp-border); background: var(--ftp-bg-secondary);
}
.powered a { color: var(--ftp-text-secondary); text-decoration: none; }
.powered a:hover { color: #f97316; }

@media (max-width: 440px) {
  .overlay { width: calc(100vw - 24px); left: 12px !important; right: 12px !important; }
}
`,g={minMoves:10,minScrolls:3,minKeyPresses:5,minTimeMs:6e4,minClicks:2},f={moves:25,scrolls:10,keyPresses:20,clicks:10,time:20,environment:15};class k{constructor(i,t){p(this,"thresholds");p(this,"signals");p(this,"startTime",0);p(this,"target");p(this,"abortController",null);this.thresholds={...g,...i},this.target=t||document,this.signals={mouseMoves:0,scrolls:0,keyPresses:0,clicks:0,timeOnPageMs:0,webdriver:!1,hasTouch:!1,screenConsistent:!0}}start(){this.startTime=Date.now(),this.abortController=new AbortController;const i={signal:this.abortController.signal,passive:!0};let t=0,e=0;this.target.addEventListener("mousemove",()=>{const s=Date.now();s-t>50&&(this.signals.mouseMoves++,t=s)},i),this.target.addEventListener("touchmove",()=>{const s=Date.now();s-t>50&&(this.signals.mouseMoves++,t=s)},i),this.target.addEventListener("scroll",()=>{const s=Date.now();s-e>200&&(this.signals.scrolls++,e=s)},i),window.addEventListener("scroll",()=>{const s=Date.now();s-e>200&&(this.signals.scrolls++,e=s)},i),this.target.addEventListener("keydown",()=>{this.signals.keyPresses++},i),this.target.addEventListener("click",()=>{this.signals.clicks++},i),this.target.addEventListener("touchstart",()=>{this.signals.clicks++},i),this.signals.webdriver=!!navigator.webdriver,this.signals.hasTouch="ontouchstart"in window||navigator.maxTouchPoints>0,this.signals.screenConsistent=this.checkScreenConsistency()}evaluate(){this.signals.timeOnPageMs=Date.now()-this.startTime;const i=this.thresholds,t=this.signals,e={moves:{value:t.mouseMoves,threshold:i.minMoves,score:Math.min(t.mouseMoves/i.minMoves,1)*f.moves},scrolls:{value:t.scrolls,threshold:i.minScrolls,score:Math.min(t.scrolls/i.minScrolls,1)*f.scrolls},keyPresses:{value:t.keyPresses,threshold:i.minKeyPresses,score:Math.min(t.keyPresses/i.minKeyPresses,1)*f.keyPresses},clicks:{value:t.clicks,threshold:i.minClicks,score:Math.min(t.clicks/i.minClicks,1)*f.clicks},time:{value:t.timeOnPageMs,threshold:i.minTimeMs,score:Math.min(t.timeOnPageMs/i.minTimeMs,1)*f.time},environment:{value:this.envScore(),threshold:1,score:this.envScore()*f.environment}},s=Math.round(Object.values(e).reduce((r,n)=>r+n.score,0));return{score:s,passed:s>=60,breakdown:e,signals:{...this.signals}}}getThresholds(){return{...this.thresholds}}setThresholds(i){Object.assign(this.thresholds,i)}destroy(){var i;(i=this.abortController)==null||i.abort(),this.abortController=null}envScore(){let i=1;return this.signals.webdriver&&(i-=.6),this.signals.screenConsistent||(i-=.3),this.signals.hasTouch&&this.signals.mouseMoves===0&&this.signals.timeOnPageMs>1e4&&(i-=.1),Math.max(0,i)}checkScreenConsistency(){const{innerWidth:i,innerHeight:t,screen:e}=window;return!(i===0||t===0||e.width===0||e.height===0||i>e.width+50||t>e.height+50)}}const y={bug:{totalSteps:4,steps:[{key:"title",title:"What happened?",subtitle:"Give a brief title for the bug",type:"input",required:!0,placeholder:"e.g. Button doesn't respond when clicked"},{key:"reproduction",title:"Steps to reproduce",subtitle:"What were you doing when this happened?",type:"textarea",required:!1,placeholder:"I clicked on... then I..."},{key:"expected",title:"Expected vs actual",subtitle:"What should have happened instead?",type:"textarea",required:!1,placeholder:"I expected... but instead..."},{key:"severity",title:"How severe is this?",subtitle:"Pick the option that best describes the impact",type:"severity",required:!0}]},suggestion:{totalSteps:3,steps:[{key:"title",title:"What's your idea?",subtitle:"A short title for your suggestion",type:"input",required:!0,placeholder:"e.g. Add dark mode support"},{key:"description",title:"Tell us more",subtitle:"Describe your idea in detail",type:"textarea",required:!1,placeholder:"It would be great if..."},{key:"motivation",title:"Why does it matter?",subtitle:"Help us understand the value (optional)",type:"textarea",required:!1,placeholder:"This would help because..."}]},question:{totalSteps:2,steps:[{key:"title",title:"What's your question?",subtitle:"Ask away — no question is too small",type:"textarea",required:!0,placeholder:"How do I..."},{key:"context",title:"Where are you stuck?",subtitle:"Share the page or context (optional)",type:"input",required:!1,placeholder:"URL or description",defaultValue:()=>window.location.href}]}},S=[{value:"blocking",label:"Blocking",icon:"🔴",desc:"Can't continue"},{value:"major",label:"Major",icon:"🟠",desc:"Significant issue"},{value:"minor",label:"Minor",icon:"🟡",desc:"Small annoyance"},{value:"cosmetic",label:"Cosmetic",icon:"🟢",desc:"Visual only"}],x="ftp-feedback-draft",M="https://ftp-feedback-api.onrender.com";class z extends HTMLElement{constructor(){super();p(this,"shadow");p(this,"config");p(this,"isOpen",!1);p(this,"wizard",{category:null,step:0,data:{}});p(this,"submitting",!1);p(this,"trust",null);this.shadow=this.attachShadow({mode:"open"}),this.config={appId:"",apiUrl:M,position:"bottom-right",theme:"light",categories:["bug","suggestion","question"],user:{}}}static get observedAttributes(){return["app-id","api-url","position","theme","categories","user-id","user-email","branding","trust-min-moves","trust-min-scrolls","trust-min-keys","trust-min-time","trust-min-clicks"]}connectedCallback(){this.config.appId=this.getAttribute("app-id")||this.config.appId,this.config.apiUrl=this.getAttribute("api-url")||this.config.apiUrl,this.config.position=this.getAttribute("position")||this.config.position,this.config.theme=this.getAttribute("theme")||this.config.theme,this.config.user.id=this.getAttribute("user-id")||void 0,this.config.user.email=this.getAttribute("user-email")||void 0;const t=this.getAttribute("categories");t&&(this.config.categories=t.split(",").map(c=>c.trim())),this.config.theme!=="light"&&this.setAttribute("theme",this.config.theme);const e={},s=this.getAttribute("trust-min-moves"),r=this.getAttribute("trust-min-scrolls"),n=this.getAttribute("trust-min-keys"),o=this.getAttribute("trust-min-time"),d=this.getAttribute("trust-min-clicks");s&&(e.minMoves=parseInt(s)),r&&(e.minScrolls=parseInt(r)),n&&(e.minKeyPresses=parseInt(n)),o&&(e.minTimeMs=parseInt(o)),d&&(e.minClicks=parseInt(d)),this.trust=new k(e),this.trust.start(),this.loadDraft(),this.render()}disconnectedCallback(){var t;(t=this.trust)==null||t.destroy()}configure(t){Object.assign(this.config,t),t.theme&&this.setAttribute("theme",t.theme),this.render()}open(){this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.submitting=!1,this.render()}resetWizard(){this.wizard={category:null,step:0,data:{}},this.clearDraft()}saveDraft(){try{sessionStorage.setItem(x,JSON.stringify(this.wizard))}catch{}}loadDraft(){try{const t=sessionStorage.getItem(x);if(t){const e=JSON.parse(t);e.category&&(this.wizard=e)}}catch{}}clearDraft(){try{sessionStorage.removeItem(x)}catch{}}get flow(){return this.wizard.category?y[this.wizard.category]:null}get totalStepsWithConfirm(){return this.flow?this.flow.totalSteps+1:0}get currentFlowStep(){var t;return(t=this.flow)==null?void 0:t.steps[this.wizard.step-1]}get isConfirmStep(){return this.flow&&this.wizard.step===this.flow.totalSteps+1}canProceed(){var s;const t=this.currentFlowStep;return!t||!t.required?!0:!!((s=this.wizard.data[t.key])==null?void 0:s.trim())}render(){const t=this.config.position;this.shadow.innerHTML=`
      <style>${h}</style>
      <button class="trigger ${t}" id="trigger">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      ${this.isOpen?this.renderOverlay():""}
    `,this.bindEvents()}renderOverlay(){const t=this.config.position,e=this.wizard.step===0?"Send Feedback":this.isConfirmStep?"Confirm & Submit":`${this.categoryLabel(this.wizard.category)}`;return`
      <div class="overlay ${t}" id="overlay">
        <div class="header">
          <h3>${e}</h3>
          <button class="close-btn" id="close">&times;</button>
        </div>
        ${this.wizard.step>0?this.renderProgress():""}
        <div class="body" id="formBody">
          ${this.renderStep()}
        </div>
        ${this.getAttribute("branding")!=="false"?'<div class="powered">Powered by <a href="https://github.com/for-the-people-initiative/ftp-feedback" target="_blank">FTP Feedback</a></div>':""}
      </div>
    `}renderProgress(){const t=this.totalStepsWithConfirm;let e="";for(let s=1;s<=t;s++){const r=s<this.wizard.step?"done":s===this.wizard.step?"active":"";e+=`<div class="progress-dot ${r}"></div>`}return`<div class="progress">${e}</div>`}renderStep(){return this.wizard.step===0?this.renderCategoryPicker():this.isConfirmStep?this.renderConfirm():this.renderFlowStep()}renderCategoryPicker(){return`
      <div class="step-content">
        <div class="step-title">What kind of feedback?</div>
        <div class="step-subtitle">Choose a category to get started</div>
        <div class="category-grid">
          ${[{type:"bug",emoji:"🐛",label:"Bug Report",desc:"Something isn't working right"},{type:"suggestion",emoji:"💡",label:"Suggestion",desc:"I have an idea to improve things"},{type:"question",emoji:"❓",label:"Question",desc:"I need help with something"}].filter(e=>this.config.categories.includes(e.type)).map(e=>`
            <button class="category-card" data-cat="${e.type}">
              <span class="cat-emoji">${e.emoji}</span>
              <div><div class="cat-label">${e.label}</div><div class="cat-desc">${e.desc}</div></div>
            </button>
          `).join("")}
        </div>
      </div>
    `}renderFlowStep(){var n;const t=this.currentFlowStep,e=this.wizard.data[t.key]??(((n=t.defaultValue)==null?void 0:n.call(t))||"");t.required;const s=this.wizard.step===this.flow.totalSteps;let r="";return t.type==="input"?r=`<input type="text" id="stepInput" placeholder="${t.placeholder||""}" value="${this.escAttr(e)}" maxlength="200">`:t.type==="textarea"?r=`<textarea id="stepInput" placeholder="${t.placeholder||""}" rows="4">${this.escHtml(e)}</textarea>`:t.type==="severity"&&(r=`<div class="severity-grid">${S.map(o=>`
        <button class="severity-btn ${e===o.value?"active":""}" data-sev="${o.value}">
          <span class="sev-icon">${o.icon}</span>${o.label}
        </button>
      `).join("")}</div>`),`
      <div class="step-content">
        <div class="step-title">${t.title}</div>
        <div class="step-subtitle">${t.subtitle}</div>
        ${r}
        <div id="errorMsg" class="error-msg" style="display:none"></div>
        <div class="nav-row">
          <button class="btn btn-back" id="backBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Back</button>
          <button class="btn btn-next" id="nextBtn">${s?"Review":"Next"} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
        </div>
      </div>
    `}renderConfirm(){const t=this.wizard.category,s=y[t].steps.filter(r=>{var n;return(n=this.wizard.data[r.key])==null?void 0:n.trim()}).map(r=>{let n=this.wizard.data[r.key];if(r.type==="severity"){const o=S.find(d=>d.value===n);n=o?`${o.icon} ${o.label}`:n}return`<div class="summary-item"><div class="summary-label">${r.title}</div><div class="summary-value">${this.escHtml(n)}</div></div>`}).join("");return`
      <div class="step-content">
        <div class="step-title">Review your ${this.categoryLabel(t).toLowerCase()}</div>
        <div class="step-subtitle">Make sure everything looks good</div>
        <div class="summary">${s}</div>
        <div id="errorMsg" class="error-msg" style="display:none"></div>
        <div class="nav-row">
          <button class="btn btn-back" id="backBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Back</button>
          <button class="btn btn-submit" id="submitBtn" ${this.submitting?"disabled":""}>${this.submitting?"Submitting...":"Submit ✓"}</button>
        </div>
      </div>
    `}categoryLabel(t){return t==="bug"?"🐛 Bug Report":t==="suggestion"?"💡 Suggestion":"❓ Question"}bindEvents(){var e,s,r,n,o;(e=this.shadow.getElementById("trigger"))==null||e.addEventListener("click",()=>this.isOpen?this.close():this.open()),(s=this.shadow.getElementById("close"))==null||s.addEventListener("click",()=>this.close()),this.shadow.querySelectorAll(".category-card").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.cat;this.wizard.category=c,this.wizard.step=1,y[c].steps.forEach(u=>{u.defaultValue&&!this.wizard.data[u.key]&&(this.wizard.data[u.key]=u.defaultValue())}),this.saveDraft(),this.render()})});const t=this.shadow.getElementById("stepInput");t&&(t.addEventListener("input",()=>{const d=this.currentFlowStep;d&&(this.wizard.data[d.key]=t.value,this.saveDraft())}),requestAnimationFrame(()=>t.focus())),this.shadow.querySelectorAll(".severity-btn").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.sev;this.wizard.data.severity=c,this.saveDraft(),this.shadow.querySelectorAll(".severity-btn").forEach(u=>u.classList.remove("active")),d.classList.add("active");const m=this.shadow.getElementById("nextBtn");m&&(m.disabled=!1)})}),(r=this.shadow.getElementById("backBtn"))==null||r.addEventListener("click",()=>{this.wizard.step<=1?(this.wizard.step=0,this.wizard.category=null):this.wizard.step--,this.saveDraft(),this.render()}),(n=this.shadow.getElementById("nextBtn"))==null||n.addEventListener("click",()=>{this.wizard.step++,this.saveDraft(),this.render()}),(o=this.shadow.getElementById("submitBtn"))==null||o.addEventListener("click",()=>this.submit())}async submit(){var c,m,u,E,$;if(this.submitting)return;this.submitting=!0,this.render();const t=this.wizard.category,e=this.wizard.data;let s={},r={};t==="bug"?(s={reproduction:e.reproduction||"",expected:e.expected||""},r={severity:e.severity||""}):t==="suggestion"?s={description:e.description||"",motivation:e.motivation||""}:s={context:e.context||""};const n=this.collectMetadata(),o=(c=this.trust)==null?void 0:c.evaluate(),d={type:t,title:e.title||"",body:JSON.stringify(s),user_id:this.config.user.id,user_email:this.config.user.email,page_url:window.location.href,route:window.location.pathname,user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,metadata:{...n,...r,trust_score:o==null?void 0:o.score,trust_passed:o==null?void 0:o.passed,trust_signals:o==null?void 0:o.signals}};try{const b=await fetch(`${this.config.apiUrl}/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-App-Id":this.config.appId},body:JSON.stringify(d)});if(!b.ok){const v=await b.json().catch(()=>({}));throw new Error(v.error||`HTTP ${b.status}`)}(u=(m=this.config).onSubmit)==null||u.call(m,d),this.clearDraft(),this.showSuccess()}catch(b){this.submitting=!1,this.render();const v=this.shadow.getElementById("errorMsg");v&&(v.textContent=b.message||"Failed to submit",v.style.display="block"),($=(E=this.config).onError)==null||$.call(E,b)}}collectMetadata(){var d,c;const t=navigator.userAgent,e=navigator;let s="Unknown";/Windows NT 10/.test(t)?s="Windows 10/11":/Windows NT/.test(t)?s="Windows":/Mac OS X (\d+[._]\d+)/.test(t)?s=`macOS ${RegExp.$1.replace("_",".")}`:/iPhone OS (\d+[._]\d+)/.test(t)?s=`iOS ${RegExp.$1.replace("_",".")}`:/Android (\d+(\.\d+)?)/.test(t)?s=`Android ${RegExp.$1}`:/Linux/.test(t)&&(s="Linux");let r="Unknown";/Edg\/(\d+)/.test(t)?r=`Edge ${RegExp.$1}`:/Chrome\/(\d+)/.test(t)?r=`Chrome ${RegExp.$1}`:/Safari\/(\d+)/.test(t)&&/Version\/(\d+(\.\d+)?)/.test(t)?r=`Safari ${RegExp.$1}`:/Firefox\/(\d+)/.test(t)&&(r=`Firefox ${RegExp.$1}`);const n=/Mobi|Android.*Mobile|iPhone/.test(t),o=e.connection||e.mozConnection||e.webkitConnection;return{device_type:n?"mobile":"desktop",os:s,browser:r,screen_resolution:`${screen.width}x${screen.height}`,language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,connection_type:(o==null?void 0:o.effectiveType)||null,color_scheme:(c=(d=window.matchMedia)==null?void 0:d.call(window,"(prefers-color-scheme: dark)"))!=null&&c.matches?"dark":"light",pixel_ratio:window.devicePixelRatio,online:navigator.onLine,referrer:document.referrer||null}}showSuccess(){this.wizard={category:null,step:0,data:{}};const t=this.shadow.getElementById("formBody");t&&(t.innerHTML=`
        <div class="success">
          <div class="check">✅</div>
          <h3>Thank you!</h3>
          <p>Your feedback has been submitted.</p>
        </div>
      `),setTimeout(()=>this.close(),2500)}escHtml(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}escAttr(t){return this.escHtml(t).replace(/"/g,"&quot;")}}customElements.get("ftp-feedback")||customElements.define("ftp-feedback",z);const w={_el:null,init(a){var t,e,s;(t=document.querySelector("ftp-feedback"))==null||t.remove();const i=document.createElement("ftp-feedback");return i.setAttribute("app-id",a.appId),a.apiUrl&&i.setAttribute("api-url",a.apiUrl),a.position&&i.setAttribute("position",a.position),a.theme&&i.setAttribute("theme",a.theme),a.categories&&i.setAttribute("categories",a.categories.join(",")),(e=a.user)!=null&&e.id&&i.setAttribute("user-id",a.user.id),(s=a.user)!=null&&s.email&&i.setAttribute("user-email",a.user.email),document.body.appendChild(i),requestAnimationFrame(()=>{i.configure({onSubmit:a.onSubmit,onError:a.onError})}),this._el=i,i},open(){var a;(a=this._el)==null||a.open()},close(){var a;(a=this._el)==null||a.close()}};return(function(){const i=document.currentScript||document.querySelector("script[data-app-id]");if(i&&i instanceof HTMLScriptElement){const t=i.getAttribute("data-app-id");if(t){const e=()=>{var s;w.init({appId:t,apiUrl:i.getAttribute("data-api-url")||void 0,position:i.getAttribute("data-position")||void 0,theme:i.getAttribute("data-theme")||void 0,categories:(s=i.getAttribute("data-categories"))==null?void 0:s.split(",").map(r=>r.trim()),user:{id:i.getAttribute("data-user-id")||void 0,email:i.getAttribute("data-user-email")||void 0}})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}}})(),l.FTPFeedback=w,l.FTPFeedbackElement=z,l.TrustScore=k,l.default=w,Object.defineProperties(l,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),l})({});
