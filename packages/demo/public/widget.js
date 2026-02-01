var FTPFeedback=(function(h){"use strict";var $=Object.defineProperty;var T=(h,u,b)=>u in h?$(h,u,{enumerable:!0,configurable:!0,writable:!0,value:b}):h[u]=b;var c=(h,u,b)=>T(h,typeof u!="symbol"?u+"":u,b);const u=`
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
`,b={minMoves:10,minScrolls:3,minKeyPresses:5,minTimeMs:6e4,minClicks:2,minPathVariance:.3},m={moves:15,scrolls:10,keyPresses:15,clicks:5,time:15,cursorPath:25,environment:15},P=200;class M{constructor(e,t){c(this,"thresholds");c(this,"signals");c(this,"startTime",0);c(this,"target");c(this,"abortController",null);c(this,"pathPoints",[]);c(this,"pathIndex",0);this.thresholds={...b,...e},this.target=t||document,this.signals={mouseMoves:0,scrolls:0,keyPresses:0,clicks:0,timeOnPageMs:0,webdriver:!1,hasTouch:!1,screenConsistent:!0,pathAngleVariance:0,pathSamples:0,pathAvgSpeed:0,pathSpeedVariance:0}}start(){this.startTime=Date.now(),this.abortController=new AbortController;const e={signal:this.abortController.signal,passive:!0};let t=0,i=0;this.target.addEventListener("mousemove",s=>{const r=Date.now();if(r-t>50){this.signals.mouseMoves++,t=r;const o=s;this.addPathPoint(o.clientX,o.clientY,r)}},e),this.target.addEventListener("touchmove",s=>{const r=Date.now();if(r-t>50){this.signals.mouseMoves++,t=r;const o=s;o.touches.length>0&&this.addPathPoint(o.touches[0].clientX,o.touches[0].clientY,r)}},e),this.target.addEventListener("scroll",()=>{const s=Date.now();s-i>200&&(this.signals.scrolls++,i=s)},e),window.addEventListener("scroll",()=>{const s=Date.now();s-i>200&&(this.signals.scrolls++,i=s)},e),this.target.addEventListener("keydown",()=>{this.signals.keyPresses++},e),this.target.addEventListener("click",()=>{this.signals.clicks++},e),this.target.addEventListener("touchstart",()=>{this.signals.clicks++},e),this.signals.webdriver=!!navigator.webdriver,this.signals.hasTouch="ontouchstart"in window||navigator.maxTouchPoints>0,this.signals.screenConsistent=this.checkScreenConsistency()}evaluate(){this.signals.timeOnPageMs=Date.now()-this.startTime,this.analyzePath();const e=this.thresholds,t=this.signals,i={moves:{value:t.mouseMoves,threshold:e.minMoves,score:Math.min(t.mouseMoves/e.minMoves,1)*m.moves},scrolls:{value:t.scrolls,threshold:e.minScrolls,score:Math.min(t.scrolls/e.minScrolls,1)*m.scrolls},keyPresses:{value:t.keyPresses,threshold:e.minKeyPresses,score:Math.min(t.keyPresses/e.minKeyPresses,1)*m.keyPresses},clicks:{value:t.clicks,threshold:e.minClicks,score:Math.min(t.clicks/e.minClicks,1)*m.clicks},time:{value:t.timeOnPageMs,threshold:e.minTimeMs,score:Math.min(t.timeOnPageMs/e.minTimeMs,1)*m.time},cursorPath:{value:t.pathAngleVariance,threshold:e.minPathVariance,score:this.cursorPathScore()*m.cursorPath},environment:{value:this.envScore(),threshold:1,score:this.envScore()*m.environment}},s=Math.round(Object.values(i).reduce((r,o)=>r+o.score,0));return{score:s,passed:s>=60,breakdown:i,signals:{...this.signals}}}getThresholds(){return{...this.thresholds}}setThresholds(e){Object.assign(this.thresholds,e)}destroy(){var e;(e=this.abortController)==null||e.abort(),this.abortController=null,this.pathPoints=[]}addPathPoint(e,t,i){this.pathPoints.length<P?this.pathPoints.push({x:e,y:t,t:i}):this.pathPoints[this.pathIndex%P]={x:e,y:t,t:i},this.pathIndex++}analyzePath(){const e=this.pathPoints;if(this.signals.pathSamples=e.length,e.length<3){this.signals.pathAngleVariance=0,this.signals.pathAvgSpeed=0,this.signals.pathSpeedVariance=0;return}const t=[],i=[];for(let s=1;s<e.length;s++){const r=e[s].x-e[s-1].x,o=e[s].y-e[s-1].y,a=e[s].t-e[s-1].t,l=Math.sqrt(r*r+o*o);if(a>0&&i.push(l/a),s>=2){const d=e[s-1].x-e[s-2].x,g=e[s-1].y-e[s-2].y,p=Math.atan2(g,d);let f=Math.atan2(o,r)-p;for(;f>Math.PI;)f-=2*Math.PI;for(;f<-Math.PI;)f+=2*Math.PI;t.push(f)}}this.signals.pathAngleVariance=this.variance(t),i.length>0&&(this.signals.pathAvgSpeed=i.reduce((s,r)=>s+r,0)/i.length,this.signals.pathSpeedVariance=this.variance(i))}cursorPathScore(){if(this.pathPoints.length<5)return .5;let t=0;const i=this.signals.pathAngleVariance,s=Math.min(i/this.thresholds.minPathVariance,1);t+=s*.6;const r=this.signals.pathSpeedVariance,o=r>.01?Math.min(r/.1,1):0;return t+=o*.4,Math.min(t,1)}envScore(){let e=1;return this.signals.webdriver&&(e-=.6),this.signals.screenConsistent||(e-=.3),this.signals.hasTouch&&this.signals.mouseMoves===0&&this.signals.timeOnPageMs>1e4&&(e-=.1),Math.max(0,e)}checkScreenConsistency(){const{innerWidth:e,innerHeight:t,screen:i}=window;return!(e===0||t===0||i.width===0||i.height===0||e>i.width+50||t>i.height+50)}variance(e){if(e.length<2)return 0;const t=e.reduce((s,r)=>s+r,0)/e.length;return e.map(s=>(s-t)**2).reduce((s,r)=>s+r,0)/e.length}}const x={bug:{totalSteps:4,steps:[{key:"title",title:"What happened?",subtitle:"Give a brief title for the bug",type:"input",required:!0,placeholder:"e.g. Button doesn't respond when clicked"},{key:"reproduction",title:"Steps to reproduce",subtitle:"What were you doing when this happened?",type:"textarea",required:!1,placeholder:"I clicked on... then I..."},{key:"expected",title:"Expected vs actual",subtitle:"What should have happened instead?",type:"textarea",required:!1,placeholder:"I expected... but instead..."},{key:"severity",title:"How severe is this?",subtitle:"Pick the option that best describes the impact",type:"severity",required:!0}]},suggestion:{totalSteps:3,steps:[{key:"title",title:"What's your idea?",subtitle:"A short title for your suggestion",type:"input",required:!0,placeholder:"e.g. Add dark mode support"},{key:"description",title:"Tell us more",subtitle:"Describe your idea in detail",type:"textarea",required:!1,placeholder:"It would be great if..."},{key:"motivation",title:"Why does it matter?",subtitle:"Help us understand the value (optional)",type:"textarea",required:!1,placeholder:"This would help because..."}]},question:{totalSteps:2,steps:[{key:"title",title:"What's your question?",subtitle:"Ask away — no question is too small",type:"textarea",required:!0,placeholder:"How do I..."},{key:"context",title:"Where are you stuck?",subtitle:"Share the page or context (optional)",type:"input",required:!1,placeholder:"URL or description",defaultValue:()=>window.location.href}]}},A=[{value:"blocking",label:"Blocking",icon:"🔴",desc:"Can't continue"},{value:"major",label:"Major",icon:"🟠",desc:"Significant issue"},{value:"minor",label:"Minor",icon:"🟡",desc:"Small annoyance"},{value:"cosmetic",label:"Cosmetic",icon:"🟢",desc:"Visual only"}],w="ftp-feedback-draft",E="https://ftp-feedback-api.onrender.com";class z extends HTMLElement{constructor(){super();c(this,"shadow");c(this,"config");c(this,"isOpen",!1);c(this,"wizard",{category:null,step:0,data:{}});c(this,"submitting",!1);c(this,"trust",null);this.shadow=this.attachShadow({mode:"open"}),this.config={appId:"",apiUrl:E,position:"bottom-right",theme:"light",categories:["bug","suggestion","question"],user:{}}}static get observedAttributes(){return["app-id","api-url","position","theme","categories","user-id","user-email","branding","trust-min-moves","trust-min-scrolls","trust-min-keys","trust-min-time","trust-min-clicks"]}connectedCallback(){this.config.appId=this.getAttribute("app-id")||this.config.appId,this.config.apiUrl=this.getAttribute("api-url")||this.config.apiUrl,this.config.position=this.getAttribute("position")||this.config.position,this.config.theme=this.getAttribute("theme")||this.config.theme,this.config.user.id=this.getAttribute("user-id")||void 0,this.config.user.email=this.getAttribute("user-email")||void 0;const t=this.getAttribute("categories");t&&(this.config.categories=t.split(",").map(d=>d.trim())),this.config.theme!=="light"&&this.setAttribute("theme",this.config.theme);const i={},s=this.getAttribute("trust-min-moves"),r=this.getAttribute("trust-min-scrolls"),o=this.getAttribute("trust-min-keys"),a=this.getAttribute("trust-min-time"),l=this.getAttribute("trust-min-clicks");s&&(i.minMoves=parseInt(s)),r&&(i.minScrolls=parseInt(r)),o&&(i.minKeyPresses=parseInt(o)),a&&(i.minTimeMs=parseInt(a)),l&&(i.minClicks=parseInt(l)),this.trust=new M(i),this.trust.start(),this.loadDraft(),this.render()}disconnectedCallback(){var t;(t=this.trust)==null||t.destroy()}configure(t){Object.assign(this.config,t),t.theme&&this.setAttribute("theme",t.theme),this.render()}open(){this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.submitting=!1,this.render()}resetWizard(){this.wizard={category:null,step:0,data:{}},this.clearDraft()}saveDraft(){try{sessionStorage.setItem(w,JSON.stringify(this.wizard))}catch{}}loadDraft(){try{const t=sessionStorage.getItem(w);if(t){const i=JSON.parse(t);i.category&&(this.wizard=i)}}catch{}}clearDraft(){try{sessionStorage.removeItem(w)}catch{}}get flow(){return this.wizard.category?x[this.wizard.category]:null}get totalStepsWithConfirm(){return this.flow?this.flow.totalSteps+1:0}get currentFlowStep(){var t;return(t=this.flow)==null?void 0:t.steps[this.wizard.step-1]}get isConfirmStep(){return this.flow&&this.wizard.step===this.flow.totalSteps+1}canProceed(){var s;const t=this.currentFlowStep;return!t||!t.required?!0:!!((s=this.wizard.data[t.key])==null?void 0:s.trim())}render(){const t=this.config.position;this.shadow.innerHTML=`
      <style>${u}</style>
      <button class="trigger ${t}" id="trigger">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      ${this.isOpen?this.renderOverlay():""}
    `,this.bindEvents()}renderOverlay(){const t=this.config.position,i=this.wizard.step===0?"Send Feedback":this.isConfirmStep?"Confirm & Submit":`${this.categoryLabel(this.wizard.category)}`;return`
      <div class="overlay ${t}" id="overlay">
        <div class="header">
          <h3>${i}</h3>
          <button class="close-btn" id="close">&times;</button>
        </div>
        ${this.wizard.step>0?this.renderProgress():""}
        <div class="body" id="formBody">
          ${this.renderStep()}
        </div>
        ${this.getAttribute("branding")!=="false"?'<div class="powered">Powered by <a href="https://github.com/for-the-people-initiative/ftp-feedback" target="_blank">FTP Feedback</a></div>':""}
      </div>
    `}renderProgress(){const t=this.totalStepsWithConfirm;let i="";for(let s=1;s<=t;s++){const r=s<this.wizard.step?"done":s===this.wizard.step?"active":"";i+=`<div class="progress-dot ${r}"></div>`}return`<div class="progress">${i}</div>`}renderStep(){return this.wizard.step===0?this.renderCategoryPicker():this.isConfirmStep?this.renderConfirm():this.renderFlowStep()}renderCategoryPicker(){return`
      <div class="step-content">
        <div class="step-title">What kind of feedback?</div>
        <div class="step-subtitle">Choose a category to get started</div>
        <div class="category-grid">
          ${[{type:"bug",emoji:"🐛",label:"Bug Report",desc:"Something isn't working right"},{type:"suggestion",emoji:"💡",label:"Suggestion",desc:"I have an idea to improve things"},{type:"question",emoji:"❓",label:"Question",desc:"I need help with something"}].filter(i=>this.config.categories.includes(i.type)).map(i=>`
            <button class="category-card" data-cat="${i.type}">
              <span class="cat-emoji">${i.emoji}</span>
              <div><div class="cat-label">${i.label}</div><div class="cat-desc">${i.desc}</div></div>
            </button>
          `).join("")}
        </div>
      </div>
    `}renderFlowStep(){var o;const t=this.currentFlowStep,i=this.wizard.data[t.key]??(((o=t.defaultValue)==null?void 0:o.call(t))||"");t.required;const s=this.wizard.step===this.flow.totalSteps;let r="";return t.type==="input"?r=`<input type="text" id="stepInput" placeholder="${t.placeholder||""}" value="${this.escAttr(i)}" maxlength="200">`:t.type==="textarea"?r=`<textarea id="stepInput" placeholder="${t.placeholder||""}" rows="4">${this.escHtml(i)}</textarea>`:t.type==="severity"&&(r=`<div class="severity-grid">${A.map(a=>`
        <button class="severity-btn ${i===a.value?"active":""}" data-sev="${a.value}">
          <span class="sev-icon">${a.icon}</span>${a.label}
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
    `}renderConfirm(){const t=this.wizard.category,s=x[t].steps.filter(r=>{var o;return(o=this.wizard.data[r.key])==null?void 0:o.trim()}).map(r=>{let o=this.wizard.data[r.key];if(r.type==="severity"){const a=A.find(l=>l.value===o);o=a?`${a.icon} ${a.label}`:o}return`<div class="summary-item"><div class="summary-label">${r.title}</div><div class="summary-value">${this.escHtml(o)}</div></div>`}).join("");return`
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
    `}categoryLabel(t){return t==="bug"?"🐛 Bug Report":t==="suggestion"?"💡 Suggestion":"❓ Question"}bindEvents(){var i,s,r,o,a;(i=this.shadow.getElementById("trigger"))==null||i.addEventListener("click",()=>this.isOpen?this.close():this.open()),(s=this.shadow.getElementById("close"))==null||s.addEventListener("click",()=>this.close()),this.shadow.querySelectorAll(".category-card").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.cat;this.wizard.category=d,this.wizard.step=1,x[d].steps.forEach(p=>{p.defaultValue&&!this.wizard.data[p.key]&&(this.wizard.data[p.key]=p.defaultValue())}),this.saveDraft(),this.render()})});const t=this.shadow.getElementById("stepInput");t&&(t.addEventListener("input",()=>{const l=this.currentFlowStep;l&&(this.wizard.data[l.key]=t.value,this.saveDraft())}),requestAnimationFrame(()=>t.focus())),this.shadow.querySelectorAll(".severity-btn").forEach(l=>{l.addEventListener("click",()=>{const d=l.dataset.sev;this.wizard.data.severity=d,this.saveDraft(),this.shadow.querySelectorAll(".severity-btn").forEach(p=>p.classList.remove("active")),l.classList.add("active");const g=this.shadow.getElementById("nextBtn");g&&(g.disabled=!1)})}),(r=this.shadow.getElementById("backBtn"))==null||r.addEventListener("click",()=>{this.wizard.step<=1?(this.wizard.step=0,this.wizard.category=null):this.wizard.step--,this.saveDraft(),this.render()}),(o=this.shadow.getElementById("nextBtn"))==null||o.addEventListener("click",()=>{this.wizard.step++,this.saveDraft(),this.render()}),(a=this.shadow.getElementById("submitBtn"))==null||a.addEventListener("click",()=>this.submit())}async submit(){var d,g,p,S,f;if(this.submitting)return;this.submitting=!0,this.render();const t=this.wizard.category,i=this.wizard.data;let s={},r={};t==="bug"?(s={reproduction:i.reproduction||"",expected:i.expected||""},r={severity:i.severity||""}):t==="suggestion"?s={description:i.description||"",motivation:i.motivation||""}:s={context:i.context||""};const o=this.collectMetadata(),a=(d=this.trust)==null?void 0:d.evaluate(),l={type:t,title:i.title||"",body:JSON.stringify(s),user_id:this.config.user.id,user_email:this.config.user.email,page_url:window.location.href,route:window.location.pathname,user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,metadata:{...o,...r,trust_score:a==null?void 0:a.score,trust_passed:a==null?void 0:a.passed,trust_signals:a==null?void 0:a.signals}};try{const v=await fetch(`${this.config.apiUrl}/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-App-Id":this.config.appId},body:JSON.stringify(l)});if(!v.ok){const y=await v.json().catch(()=>({}));throw new Error(y.error||`HTTP ${v.status}`)}(p=(g=this.config).onSubmit)==null||p.call(g,l),this.clearDraft(),this.showSuccess()}catch(v){this.submitting=!1,this.render();const y=this.shadow.getElementById("errorMsg");y&&(y.textContent=v.message||"Failed to submit",y.style.display="block"),(f=(S=this.config).onError)==null||f.call(S,v)}}collectMetadata(){var l,d;const t=navigator.userAgent,i=navigator;let s="Unknown";/Windows NT 10/.test(t)?s="Windows 10/11":/Windows NT/.test(t)?s="Windows":/Mac OS X (\d+[._]\d+)/.test(t)?s=`macOS ${RegExp.$1.replace("_",".")}`:/iPhone OS (\d+[._]\d+)/.test(t)?s=`iOS ${RegExp.$1.replace("_",".")}`:/Android (\d+(\.\d+)?)/.test(t)?s=`Android ${RegExp.$1}`:/Linux/.test(t)&&(s="Linux");let r="Unknown";/Edg\/(\d+)/.test(t)?r=`Edge ${RegExp.$1}`:/Chrome\/(\d+)/.test(t)?r=`Chrome ${RegExp.$1}`:/Safari\/(\d+)/.test(t)&&/Version\/(\d+(\.\d+)?)/.test(t)?r=`Safari ${RegExp.$1}`:/Firefox\/(\d+)/.test(t)&&(r=`Firefox ${RegExp.$1}`);const o=/Mobi|Android.*Mobile|iPhone/.test(t),a=i.connection||i.mozConnection||i.webkitConnection;return{device_type:o?"mobile":"desktop",os:s,browser:r,screen_resolution:`${screen.width}x${screen.height}`,language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,connection_type:(a==null?void 0:a.effectiveType)||null,color_scheme:(d=(l=window.matchMedia)==null?void 0:l.call(window,"(prefers-color-scheme: dark)"))!=null&&d.matches?"dark":"light",pixel_ratio:window.devicePixelRatio,online:navigator.onLine,referrer:document.referrer||null}}showSuccess(){this.wizard={category:null,step:0,data:{}};const t=this.shadow.getElementById("formBody");t&&(t.innerHTML=`
        <div class="success">
          <div class="check">✅</div>
          <h3>Thank you!</h3>
          <p>Your feedback has been submitted.</p>
        </div>
      `),setTimeout(()=>this.close(),2500)}escHtml(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}escAttr(t){return this.escHtml(t).replace(/"/g,"&quot;")}}customElements.get("ftp-feedback")||customElements.define("ftp-feedback",z);const k={_el:null,init(n){var t,i,s;(t=document.querySelector("ftp-feedback"))==null||t.remove();const e=document.createElement("ftp-feedback");return e.setAttribute("app-id",n.appId),n.apiUrl&&e.setAttribute("api-url",n.apiUrl),n.position&&e.setAttribute("position",n.position),n.theme&&e.setAttribute("theme",n.theme),n.categories&&e.setAttribute("categories",n.categories.join(",")),(i=n.user)!=null&&i.id&&e.setAttribute("user-id",n.user.id),(s=n.user)!=null&&s.email&&e.setAttribute("user-email",n.user.email),document.body.appendChild(e),requestAnimationFrame(()=>{e.configure({onSubmit:n.onSubmit,onError:n.onError})}),this._el=e,e},open(){var n;(n=this._el)==null||n.open()},close(){var n;(n=this._el)==null||n.close()}};return(function(){const e=document.currentScript||document.querySelector("script[data-app-id]");if(e&&e instanceof HTMLScriptElement){const t=e.getAttribute("data-app-id");if(t){const i=()=>{var s;k.init({appId:t,apiUrl:e.getAttribute("data-api-url")||void 0,position:e.getAttribute("data-position")||void 0,theme:e.getAttribute("data-theme")||void 0,categories:(s=e.getAttribute("data-categories"))==null?void 0:s.split(",").map(r=>r.trim()),user:{id:e.getAttribute("data-user-id")||void 0,email:e.getAttribute("data-user-email")||void 0}})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i()}}})(),h.FTPFeedback=k,h.FTPFeedbackElement=z,h.TrustScore=M,h.default=k,Object.defineProperties(h,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),h})({});
