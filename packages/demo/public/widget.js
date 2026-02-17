var FTPFeedback=(function(u){"use strict";var O=Object.defineProperty;var _=(u,f,x)=>f in u?O(u,f,{enumerable:!0,configurable:!0,writable:!0,value:x}):u[f]=x;var g=(u,f,x)=>_(u,typeof f!="symbol"?f+"":f,x);const f=`
:host {
  --ftp-theme-primary: #f97316;
  --ftp-theme-gradient: linear-gradient(135deg, #f97316, #f59e0b);
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
:host([no-trigger]) .trigger { display: none !important; }
* { box-sizing: border-box; margin: 0; padding: 0; }

.trigger {
  position: fixed; z-index: 99999;
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--ftp-theme-gradient); color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  transition: transform 0.2s, box-shadow 0.2s;
}
.trigger:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.trigger svg { width: 24px; height: 24px; }
.bottom-right { bottom: 26px; right: 26px; }
.bottom-left { bottom: 26px; left: 26px; }
.top-right { top: 26px; right: 26px; }
.top-left { top: 26px; left: 26px; }

.overlay {
  position: fixed; z-index: 100000;
  width: 380px; max-width: calc(100vw - 32px); max-height: min(560px, calc(100dvh - 32px));
  background: var(--ftp-bg); border-radius: var(--ftp-radius);
  box-shadow: var(--ftp-shadow); border: 1px solid var(--ftp-border);
  overflow: hidden; display: flex; flex-direction: column;
  animation: ftp-slide-in 0.25s ease-out;
}
.overlay.bottom-right { bottom: 86px; right: 26px; }
.overlay.bottom-left { bottom: 86px; left: 26px; }
.overlay.top-right { top: 86px; right: 26px; }
.overlay.top-left { top: 86px; left: 26px; }
.overlay.center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
@keyframes ftp-slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.overlay.center {
  animation: ftp-fade-in 0.25s ease-out;
}
@keyframes ftp-fade-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.header {
  padding: 16px; background: var(--ftp-theme-gradient); color: white;
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
.progress-dot.active { background: var(--ftp-theme-primary); }
.progress-dot.done { background: var(--ftp-theme-primary); opacity: 0.5; }

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
.category-card:hover { border-color: var(--ftp-theme-primary); background: rgba(249,115,22,0.04); }
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
.severity-btn:hover { border-color: var(--ftp-theme-primary); }
.severity-btn.active { border-color: var(--ftp-theme-primary); background: rgba(249,115,22,0.08); color: var(--ftp-theme-primary); }
.severity-btn .sev-icon { font-size: 20px; display: block; margin-bottom: 4px; }

/* Form inputs */
input[type="text"], textarea {
  width: 100%; padding: 10px 12px; border: 1.5px solid var(--ftp-border); border-radius: 5px;
  background: var(--ftp-bg); color: var(--ftp-text); font-size: 14px; font-family: inherit;
  transition: border-color 0.15s;
}
input:focus, textarea:focus { outline: none; border-color: var(--ftp-theme-primary); }
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
  margin-left: auto; background: var(--ftp-theme-gradient); color: white;
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

/* Upload */
.upload-area { display: flex; flex-direction: column; gap: 10px; }
.upload-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px; border: 2px dashed var(--ftp-border); border-radius: 8px;
  background: var(--ftp-bg); color: var(--ftp-text-secondary); cursor: pointer;
  font-size: 13px; font-weight: 500; transition: all 0.15s;
}
.upload-btn:hover { border-color: var(--ftp-theme-primary); color: var(--ftp-theme-primary); }
.upload-hint { font-size: 11px; color: var(--ftp-text-secondary); text-align: center; line-height: 1.4; }
.upload-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.upload-thumb {
  position: relative; width: 80px; height: 80px; border-radius: 6px; overflow: hidden;
  border: 1px solid var(--ftp-border);
}
.upload-thumb img { width: 100%; height: 100%; object-fit: cover; }
.upload-remove {
  position: absolute; top: 2px; right: 2px;
  width: 20px; height: 20px; border-radius: 50%;
  background: rgba(0,0,0,0.6); color: white; border: none; cursor: pointer;
  font-size: 14px; line-height: 1; display: flex; align-items: center; justify-content: center;
}
.upload-remove:hover { background: var(--ftp-error); }

.error-msg { color: var(--ftp-error); font-size: 12px; margin-top: 10px; }

.powered {
  padding: 10px 16px; text-align: center; font-size: 10px; color: var(--ftp-text-secondary);
  border-top: 1px solid var(--ftp-border); background: var(--ftp-bg-secondary);
}
.powered a { color: var(--ftp-text-secondary); text-decoration: none; }
.powered a:hover { color: var(--ftp-theme-primary); }

@media (max-width: 440px) {
  .overlay { width: calc(100vw - 24px); left: 12px !important; right: 12px !important; }
  .overlay.center { left: 50% !important; right: auto !important; transform: translate(-50%, -50%); }
}
`,x={minMoves:10,minScrolls:3,minKeyPresses:5,minTimeMs:6e4,minClicks:2,minClickDurationVariance:200,minPathVariance:.3,minScrollVariance:1e4,minTypingVariance:500,minSignalsToPass:3},v={cursorBehavior:28,scrollBehavior:12,keyPresses:10,typingPattern:12,clickBehavior:5,time:10,environment:10,backspaces:13},C=7,T=200,w=100;class A{constructor(e,t){g(this,"thresholds");g(this,"signals");g(this,"startTime",0);g(this,"target");g(this,"abortController",null);g(this,"pathPoints",[]);g(this,"pathIndex",0);g(this,"keyTimestamps",[]);g(this,"keyTsIndex",0);g(this,"clickDownTime",0);g(this,"clickDurations",[]);g(this,"scrollTimestamps",[]);g(this,"scrollPositions",[]);g(this,"scrollTsIndex",0);this.thresholds={...x,...e},this.target=t||document,this.signals={mouseMoves:0,scrolls:0,keyPresses:0,clicks:0,timeOnPageMs:0,webdriver:!1,hasTouch:!1,screenConsistent:!0,pathAngleVariance:0,pathSamples:0,pathAvgSpeed:0,pathSpeedVariance:0,clickAvgDuration:0,clickDurationVariance:0,clickSamples:0,scrollIntervalVariance:0,scrollDirectionChanges:0,scrollSamples:0,typingVariance:0,backspaceCount:0,typingSamples:0,typingAvgInterval:0}}start(){this.startTime=Date.now(),this.abortController=new AbortController;const e={signal:this.abortController.signal,passive:!0};let t=0,s=0;this.target.addEventListener("mousemove",r=>{const n=Date.now();if(n-t>50){this.signals.mouseMoves++,t=n;const o=r;this.addPathPoint(o.clientX,o.clientY,n)}},e),this.target.addEventListener("touchmove",r=>{const n=Date.now();if(n-t>50){this.signals.mouseMoves++,t=n;const o=r;o.touches.length>0&&this.addPathPoint(o.touches[0].clientX,o.touches[0].clientY,n)}},e);const i=()=>{const r=Date.now();if(r-s>200){this.signals.scrolls++,s=r;const n=window.scrollY||document.documentElement.scrollTop||0;if(this.scrollTimestamps.length<w)this.scrollTimestamps.push(r),this.scrollPositions.push(n);else{const o=this.scrollTsIndex%w;this.scrollTimestamps[o]=r,this.scrollPositions[o]=n}this.scrollTsIndex++}};this.target.addEventListener("scroll",i,e),window.addEventListener("scroll",i,e),this.target.addEventListener("keydown",r=>{this.signals.keyPresses++;const n=Date.now(),o=r;(o.key==="Backspace"||o.key==="Delete")&&this.signals.backspaceCount++,this.keyTimestamps.length<w?this.keyTimestamps.push(n):this.keyTimestamps[this.keyTsIndex%w]=n,this.keyTsIndex++},e),this.target.addEventListener("mousedown",()=>{this.clickDownTime=Date.now()},e),this.target.addEventListener("mouseup",()=>{if(this.clickDownTime>0){const r=Date.now()-this.clickDownTime;this.signals.clicks++,r<2e3&&this.clickDurations.push(r),this.clickDownTime=0}},e),this.target.addEventListener("touchstart",()=>{this.clickDownTime=Date.now()},e),this.target.addEventListener("touchend",()=>{if(this.clickDownTime>0){const r=Date.now()-this.clickDownTime;this.signals.clicks++,r<2e3&&this.clickDurations.push(r),this.clickDownTime=0}},e),this.signals.webdriver=!!navigator.webdriver,this.signals.hasTouch="ontouchstart"in window||navigator.maxTouchPoints>0,this.signals.screenConsistent=this.checkScreenConsistency()}evaluate(){this.signals.timeOnPageMs=Date.now()-this.startTime,this.analyzePath(),this.analyzeClicks(),this.analyzeScrolling(),this.analyzeTyping();const e=this.thresholds,t=this.signals,s=t.mouseMoves>=e.minMoves&&t.pathAngleVariance>=e.minPathVariance&&t.pathSamples>=5,i=t.scrolls>=e.minScrolls&&(t.scrollIntervalVariance>=e.minScrollVariance||t.scrollDirectionChanges>=1),r=t.keyPresses>=e.minKeyPresses,n=t.clickAvgDuration>=30&&t.clickAvgDuration<=500,o=t.clicks>=e.minClicks&&(t.clickDurationVariance>=e.minClickDurationVariance||n&&t.clickSamples>=2),c=t.timeOnPageMs>=e.minTimeMs,a=t.typingVariance>=e.minTypingVariance&&t.typingSamples>=5||t.backspaceCount>=1,l=!t.webdriver&&t.screenConsistent,d={cursorBehavior:{proven:s,value:t.mouseMoves,threshold:e.minMoves,label:"Cursor behavior"},scrollBehavior:{proven:i,value:t.scrolls,threshold:e.minScrolls,label:"Scroll behavior"},keyPresses:{proven:r,value:t.keyPresses,threshold:e.minKeyPresses,label:"Key presses"},clickBehavior:{proven:o,value:t.clicks,threshold:e.minClicks,label:"Click behavior"},time:{proven:c,value:t.timeOnPageMs,threshold:e.minTimeMs,label:"Time on page"},typingPattern:{proven:a,value:t.typingVariance,threshold:e.minTypingVariance,label:"Typing rhythm"},environment:{proven:l,value:l?1:0,threshold:1,label:"Environment"}},p=Object.values(d).filter(L=>L.proven).length,m=Math.min(Math.round(p/e.minSignalsToPass*100),100),b=p>=e.minSignalsToPass,y=Math.min(t.mouseMoves/e.minMoves,1),E=this.cursorPathScore(),D=y*E,$=t.typingSamples>=3?Math.min(t.typingVariance/e.minTypingVariance,1):0,B=Math.min(t.backspaceCount/2,1),V=Math.round(D*v.cursorBehavior+Math.min(t.scrolls/e.minScrolls,1)*(t.scrollDirectionChanges>=1||t.scrollIntervalVariance>=e.minScrollVariance?1:.3)*v.scrollBehavior+Math.min(t.keyPresses/e.minKeyPresses,1)*v.keyPresses+$*v.typingPattern+Math.min(t.clicks/e.minClicks,1)*(n?1:.3)*v.clickBehavior+Math.min(t.timeOnPageMs/e.minTimeMs,1)*v.time+this.envScore()*v.environment+B*v.backspaces);return{score:m,passed:b,provenCount:p,totalSignals:C,minRequired:e.minSignalsToPass,confidenceScore:V,breakdown:d,signals:{...this.signals}}}evaluateWith(e){const t={...this.signals},s=this.startTime;Object.assign(this.signals,e),e.timeOnPageMs!==void 0&&(this.startTime=Date.now()-e.timeOnPageMs);const i=this.evaluate();return this.signals=t,this.startTime=s,i}getThresholds(){return{...this.thresholds}}setThresholds(e){Object.assign(this.thresholds,e)}destroy(){var e;(e=this.abortController)==null||e.abort(),this.abortController=null,this.pathPoints=[],this.keyTimestamps=[],this.scrollTimestamps=[],this.scrollPositions=[],this.clickDurations=[]}analyzeClicks(){const e=this.clickDurations;if(this.signals.clickSamples=e.length,e.length<2){this.signals.clickAvgDuration=e.length===1?e[0]:0,this.signals.clickDurationVariance=0;return}this.signals.clickAvgDuration=e.reduce((t,s)=>t+s,0)/e.length,this.signals.clickDurationVariance=this.variance(e)}analyzeScrolling(){const e=this.scrollTimestamps,t=this.scrollPositions;if(this.signals.scrollSamples=e.length,e.length<3){this.signals.scrollIntervalVariance=0,this.signals.scrollDirectionChanges=0;return}const s=e.map((a,l)=>l).sort((a,l)=>e[a]-e[l]),i=s.map(a=>e[a]),r=s.map(a=>t[a]),n=[];for(let a=1;a<i.length;a++){const l=i[a]-i[a-1];l<5e3&&n.push(l)}this.signals.scrollIntervalVariance=n.length>=2?this.variance(n):0;let o=0,c=0;for(let a=1;a<r.length;a++){const l=r[a]-r[a-1];if(l===0)continue;const d=l>0?1:-1;c!==0&&d!==c&&o++,c=d}this.signals.scrollDirectionChanges=o}analyzeTyping(){const e=this.keyTimestamps;if(this.signals.typingSamples=e.length,e.length<3){this.signals.typingVariance=0,this.signals.typingAvgInterval=0;return}const t=[...e].sort((i,r)=>i-r),s=[];for(let i=1;i<t.length;i++){const r=t[i]-t[i-1];r<5e3&&s.push(r)}if(s.length<2){this.signals.typingVariance=0,this.signals.typingAvgInterval=0;return}this.signals.typingAvgInterval=s.reduce((i,r)=>i+r,0)/s.length,this.signals.typingVariance=this.variance(s)}addPathPoint(e,t,s){this.pathPoints.length<T?this.pathPoints.push({x:e,y:t,t:s}):this.pathPoints[this.pathIndex%T]={x:e,y:t,t:s},this.pathIndex++}analyzePath(){const e=this.pathPoints;if(this.signals.pathSamples=e.length,e.length<3){this.signals.pathAngleVariance=0,this.signals.pathAvgSpeed=0,this.signals.pathSpeedVariance=0;return}const t=[],s=[];for(let i=1;i<e.length;i++){const r=e[i].x-e[i-1].x,n=e[i].y-e[i-1].y,o=e[i].t-e[i-1].t,c=Math.sqrt(r*r+n*n);if(o>0&&s.push(c/o),i>=2){const a=e[i-1].x-e[i-2].x,l=e[i-1].y-e[i-2].y,d=Math.atan2(l,a);let m=Math.atan2(n,r)-d;for(;m>Math.PI;)m-=2*Math.PI;for(;m<-Math.PI;)m+=2*Math.PI;t.push(m)}}this.signals.pathAngleVariance=this.variance(t),s.length>0&&(this.signals.pathAvgSpeed=s.reduce((i,r)=>i+r,0)/s.length,this.signals.pathSpeedVariance=this.variance(s))}cursorPathScore(){if(this.pathPoints.length<5)return .5;let t=0;const s=this.signals.pathAngleVariance;t+=Math.min(s/this.thresholds.minPathVariance,1)*.6;const i=this.signals.pathSpeedVariance,r=i>.01?Math.min(i/.1,1):0;return t+=r*.4,Math.min(t,1)}envScore(){let e=1;return this.signals.webdriver&&(e-=.6),this.signals.screenConsistent||(e-=.3),this.signals.hasTouch&&this.signals.mouseMoves===0&&this.signals.timeOnPageMs>1e4&&(e-=.1),Math.max(0,e)}checkScreenConsistency(){const{innerWidth:e,innerHeight:t,screen:s}=window;return!(e===0||t===0||s.width===0||s.height===0||e>s.width+50||t>s.height+50)}variance(e){if(e.length<2)return 0;const t=e.reduce((i,r)=>i+r,0)/e.length;return e.map(i=>(i-t)**2).reduce((i,r)=>i+r,0)/e.length}}const k={bug:{totalSteps:5,steps:[{key:"title",title:"What happened?",subtitle:"Give a brief title for the bug",type:"input",required:!0,placeholder:"e.g. Button doesn't respond when clicked"},{key:"reproduction",title:"Steps to reproduce",subtitle:"What were you doing when this happened?",type:"textarea",required:!1,placeholder:"I clicked on... then I..."},{key:"expected",title:"Expected vs actual",subtitle:"What should have happened instead?",type:"textarea",required:!1,placeholder:"I expected... but instead..."},{key:"severity",title:"How severe is this?",subtitle:"Pick the option that best describes the impact",type:"severity",required:!0},{key:"screenshots",title:"Add screenshots",subtitle:"Attach images to help us understand (optional)",type:"upload",required:!1}]},suggestion:{totalSteps:4,steps:[{key:"title",title:"What's your idea?",subtitle:"A short title for your suggestion",type:"input",required:!0,placeholder:"e.g. Add dark mode support"},{key:"description",title:"Tell us more",subtitle:"Describe your idea in detail",type:"textarea",required:!1,placeholder:"It would be great if..."},{key:"motivation",title:"Why does it matter?",subtitle:"Help us understand the value (optional)",type:"textarea",required:!1,placeholder:"This would help because..."},{key:"screenshots",title:"Add screenshots",subtitle:"Attach images to help us understand (optional)",type:"upload",required:!1}]},question:{totalSteps:3,steps:[{key:"title",title:"What's your question?",subtitle:"Ask away — no question is too small",type:"textarea",required:!0,placeholder:"How do I..."},{key:"context",title:"Where are you stuck?",subtitle:"Share the page or context (optional)",type:"input",required:!1,placeholder:"URL or description",defaultValue:()=>window.location.href},{key:"screenshots",title:"Add screenshots",subtitle:"Attach images to help us understand (optional)",type:"upload",required:!1}]}},M=[{value:"blocking",label:"Blocking",icon:"🔴",desc:"Can't continue"},{value:"major",label:"Major",icon:"🟠",desc:"Significant issue"},{value:"minor",label:"Minor",icon:"🟡",desc:"Small annoyance"},{value:"cosmetic",label:"Cosmetic",icon:"🟢",desc:"Visual only"}],S="ftp-feedback-draft",I="https://ftp-feedback-api.onrender.com";class z extends HTMLElement{constructor(){super();g(this,"shadow");g(this,"config");g(this,"isOpen",!1);g(this,"wizard",{category:null,step:0,data:{}});g(this,"submitting",!1);g(this,"trust",null);this.shadow=this.attachShadow({mode:"open"}),this.config={appId:"",apiUrl:I,position:"bottom-right",formPosition:"",theme:"light",themeColors:null,categories:["bug","suggestion","question"],user:{}}}static get observedAttributes(){return["app-id","api-url","position","theme","categories","user-id","user-email","branding","no-trigger","trust-min-moves","trust-min-scrolls","trust-min-keys","trust-min-time","trust-min-clicks"]}connectedCallback(){this.config.appId=this.getAttribute("app-id")||this.config.appId,this.config.apiUrl=this.getAttribute("api-url")||this.config.apiUrl,this.config.position=this.getAttribute("position")||this.config.position,this.config.theme=this.getAttribute("theme")||this.config.theme,this.config.user.id=this.getAttribute("user-id")||void 0,this.config.user.email=this.getAttribute("user-email")||void 0,this.config.formPosition=this.getAttribute("data-form-position")||"";const t=this.getAttribute("categories");t&&(this.config.categories=t.split(",").map(l=>l.trim())),this.config.theme!=="light"&&this.setAttribute("theme",this.config.theme);const s=this.getAttribute("data-theme-colors");if(s)try{this.config.themeColors=JSON.parse(s)}catch{}if(this.config.themeColors){const l=this.shadow.host;this.config.themeColors.primary&&l.style.setProperty("--ftp-theme-primary",this.config.themeColors.primary),this.config.themeColors.gradient&&l.style.setProperty("--ftp-theme-gradient",this.config.themeColors.gradient)}const i={},r=this.getAttribute("trust-min-moves"),n=this.getAttribute("trust-min-scrolls"),o=this.getAttribute("trust-min-keys"),c=this.getAttribute("trust-min-time"),a=this.getAttribute("trust-min-clicks");r&&(i.minMoves=parseInt(r)),n&&(i.minScrolls=parseInt(n)),o&&(i.minKeyPresses=parseInt(o)),c&&(i.minTimeMs=parseInt(c)),a&&(i.minClicks=parseInt(a)),this.trust=new A(i),this.trust.start(),this.loadDraft(),this.render()}disconnectedCallback(){var t;(t=this.trust)==null||t.destroy()}configure(t){Object.assign(this.config,t),t.theme&&this.setAttribute("theme",t.theme),this.render()}open(){this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.submitting=!1,this.render()}resetWizard(){this.wizard={category:null,step:0,data:{}},this.clearDraft()}saveDraft(){try{sessionStorage.setItem(S,JSON.stringify(this.wizard))}catch{}}loadDraft(){try{const t=sessionStorage.getItem(S);if(t){const s=JSON.parse(t);s.category&&(this.wizard=s)}}catch{}}clearDraft(){try{sessionStorage.removeItem(S)}catch{}}get flow(){return this.wizard.category?k[this.wizard.category]:null}get totalStepsWithConfirm(){return this.flow?this.flow.totalSteps+1:0}get currentFlowStep(){var t;return(t=this.flow)==null?void 0:t.steps[this.wizard.step-1]}get isConfirmStep(){return this.flow&&this.wizard.step===this.flow.totalSteps+1}canProceed(){var i;const t=this.currentFlowStep;return!t||!t.required?!0:!!((i=this.wizard.data[t.key])==null?void 0:i.trim())}render(){const t=this.config.position;this.shadow.innerHTML=`
      <style>${f}</style>
      <button class="trigger ${t}" id="trigger"
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      ${this.isOpen?this.renderOverlay():""}
    `,this.bindEvents()}renderOverlay(){const t=this.config.formPosition||this.config.position,s=this.wizard.step===0?"Send Feedback":this.isConfirmStep?"Confirm & Submit":`${this.categoryLabel(this.wizard.category)}`;return`
      <div class="overlay ${t}" id="overlay">
        <div class="header">
          <h3>${s}</h3>
          <button class="close-btn" id="close">&times;</button>
        </div>
        ${this.wizard.step>0?this.renderProgress():""}
        <div class="body" id="formBody">
          ${this.renderStep()}
        </div>
        ${this.getAttribute("branding")!=="false"?'<div class="powered">Powered by <a href="https://github.com/for-the-people-initiative/ftp-feedback" target="_blank">FTP Feedback</a></div>':""}
      </div>
    `}renderProgress(){const t=this.totalStepsWithConfirm;let s="";for(let i=1;i<=t;i++){const r=i<this.wizard.step?"done":i===this.wizard.step?"active":"";s+=`<div class="progress-dot ${r}"></div>`}return`<div class="progress">${s}</div>`}renderStep(){return this.wizard.step===0?this.renderCategoryPicker():this.isConfirmStep?this.renderConfirm():this.renderFlowStep()}renderCategoryPicker(){return`
      <div class="step-content">
        <div class="step-title">What kind of feedback?</div>
        <div class="step-subtitle">Choose a category to get started</div>
        <div class="category-grid">
          ${[{type:"bug",emoji:"🐛",label:"Bug Report",desc:"Something isn't working right"},{type:"suggestion",emoji:"💡",label:"Suggestion",desc:"I have an idea to improve things"},{type:"question",emoji:"❓",label:"Question",desc:"I need help with something"}].filter(s=>this.config.categories.includes(s.type)).map(s=>`
            <button class="category-card" data-cat="${s.type}">
              <span class="cat-emoji">${s.emoji}</span>
              <div><div class="cat-label">${s.label}</div><div class="cat-desc">${s.desc}</div></div>
            </button>
          `).join("")}
        </div>
      </div>
    `}renderFlowStep(){var n;const t=this.currentFlowStep,s=this.wizard.data[t.key]??(((n=t.defaultValue)==null?void 0:n.call(t))||"");t.required;const i=this.wizard.step===this.flow.totalSteps;let r="";if(t.type==="input")r=`<input type="text" id="stepInput" placeholder="${t.placeholder||""}" value="${this.escAttr(s)}" maxlength="200">`;else if(t.type==="textarea")r=`<textarea id="stepInput" placeholder="${t.placeholder||""}" rows="4">${this.escHtml(s)}</textarea>`;else if(t.type==="upload"){const o=this.wizard.data.screenshots||[],c=o.map((a,l)=>`
        <div class="upload-thumb">
          <img src="${a}" alt="Screenshot ${l+1}">
          <button class="upload-remove" data-idx="${l}">&times;</button>
        </div>
      `).join("");r=`
        <div class="upload-area">
          <label class="upload-btn" id="uploadLabel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Choose images (max 5)
            <input type="file" accept="image/*" multiple id="fileInput" style="display:none">
          </label>
          <div class="upload-hint">📸 Screenshots: Win+Shift+S · Cmd+Shift+4 · iPhone: side+vol · Android: power+vol</div>
          ${o.length>0?`<div class="upload-grid">${c}</div>`:""}
          <div id="uploadError" class="error-msg" style="display:none"></div>
        </div>
      `}else t.type==="severity"&&(r=`<div class="severity-grid">${M.map(o=>`
        <button class="severity-btn ${s===o.value?"active":""}" data-sev="${o.value}">
          <span class="sev-icon">${o.icon}</span>${o.label}
        </button>
      `).join("")}</div>`);return`
      <div class="step-content">
        <div class="step-title">${t.title}</div>
        <div class="step-subtitle">${t.subtitle}</div>
        ${r}
        <div id="errorMsg" class="error-msg" style="display:none"></div>
        <div class="nav-row">
          <button class="btn btn-back" id="backBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Back</button>
          <button class="btn btn-next" id="nextBtn">${i?"Review":"Next"} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
        </div>
      </div>
    `}renderConfirm(){const t=this.wizard.category,i=k[t].steps.filter(r=>{var n,o;return r.type==="upload"?((n=this.wizard.data.screenshots)==null?void 0:n.length)>0:(o=this.wizard.data[r.key])==null?void 0:o.trim()}).map(r=>{if(r.type==="upload"){const o=this.wizard.data.screenshots||[];return o.length===0?"":`<div class="summary-item"><div class="summary-label">${r.title}</div><div class="upload-grid">${o.map(c=>`<div class="upload-thumb"><img src="${c}"></div>`).join("")}</div></div>`}let n=this.wizard.data[r.key];if(r.type==="severity"){const o=M.find(c=>c.value===n);n=o?`${o.icon} ${o.label}`:n}return`<div class="summary-item"><div class="summary-label">${r.title}</div><div class="summary-value">${this.escHtml(n)}</div></div>`}).join("");return`
      <div class="step-content">
        <div class="step-title">Review your ${this.categoryLabel(t).toLowerCase()}</div>
        <div class="step-subtitle">Make sure everything looks good</div>
        <div class="summary">${i}</div>
        <div id="errorMsg" class="error-msg" style="display:none"></div>
        <div class="nav-row">
          <button class="btn btn-back" id="backBtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Back</button>
          <button class="btn btn-submit" id="submitBtn" ${this.submitting?"disabled":""}>${this.submitting?"Submitting...":"Submit ✓"}</button>
        </div>
      </div>
    `}categoryLabel(t){return t==="bug"?"🐛 Bug Report":t==="suggestion"?"💡 Suggestion":"❓ Question"}bindEvents(){var i,r,n,o,c;(i=this.shadow.getElementById("trigger"))==null||i.addEventListener("click",()=>this.isOpen?this.close():this.open()),(r=this.shadow.getElementById("close"))==null||r.addEventListener("click",()=>this.close()),this.shadow.querySelectorAll(".category-card").forEach(a=>{a.addEventListener("click",()=>{const l=a.dataset.cat;this.wizard.category=l,this.wizard.step=1,k[l].steps.forEach(p=>{p.defaultValue&&!this.wizard.data[p.key]&&(this.wizard.data[p.key]=p.defaultValue())}),this.saveDraft(),this.render()})});const t=this.shadow.getElementById("stepInput");t&&(t.addEventListener("input",()=>{const a=this.currentFlowStep;a&&(this.wizard.data[a.key]=t.value,this.saveDraft())}),requestAnimationFrame(()=>t.focus())),this.shadow.querySelectorAll(".severity-btn").forEach(a=>{a.addEventListener("click",()=>{const l=a.dataset.sev;this.wizard.data.severity=l,this.saveDraft(),this.shadow.querySelectorAll(".severity-btn").forEach(p=>p.classList.remove("active")),a.classList.add("active");const d=this.shadow.getElementById("nextBtn");d&&(d.disabled=!1)})});const s=this.shadow.getElementById("fileInput");s&&s.addEventListener("change",async()=>{const a=Array.from(s.files||[]),l=this.wizard.data.screenshots||[],d=this.shadow.getElementById("uploadError");d&&(d.style.display="none");for(const p of a){if(l.length>=5){d&&(d.textContent="Maximum 5 images allowed",d.style.display="block");break}if(p.size>5242880){d&&(d.textContent=`${p.name} exceeds 5MB limit`,d.style.display="block");continue}try{const m=await this.resizeImage(p);l.push(m)}catch{}}this.wizard.data.screenshots=l,this.saveDraft(),this.render()}),this.shadow.querySelectorAll(".upload-remove").forEach(a=>{a.addEventListener("click",l=>{l.preventDefault();const d=parseInt(a.dataset.idx),p=this.wizard.data.screenshots||[];p.splice(d,1),this.wizard.data.screenshots=p,this.saveDraft(),this.render()})}),(n=this.shadow.getElementById("backBtn"))==null||n.addEventListener("click",()=>{this.wizard.step<=1?(this.wizard.step=0,this.wizard.category=null):this.wizard.step--,this.saveDraft(),this.render()}),(o=this.shadow.getElementById("nextBtn"))==null||o.addEventListener("click",()=>{this.wizard.step++,this.saveDraft(),this.render()}),(c=this.shadow.getElementById("submitBtn"))==null||c.addEventListener("click",()=>this.submit())}async submit(){var a,l,d,p,m;if(this.submitting)return;this.submitting=!0,this.render();const t=this.wizard.category,s=this.wizard.data;let i={},r={};t==="bug"?(i={reproduction:s.reproduction||"",expected:s.expected||""},r={severity:s.severity||""}):t==="suggestion"?i={description:s.description||"",motivation:s.motivation||""}:i={context:s.context||""};const n=this.collectMetadata(),o=(a=this.trust)==null?void 0:a.evaluate(),c={type:t,title:s.title||"",body:JSON.stringify(i),user_id:this.config.user.id,user_email:this.config.user.email,page_url:window.location.href,route:window.location.pathname,user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,screenshots:this.wizard.data.screenshots||[],metadata:{...n,...r,trust_score:o==null?void 0:o.score,trust_passed:o==null?void 0:o.passed,trust_signals:o==null?void 0:o.signals}};try{const b=await fetch(`${this.config.apiUrl}/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-App-Id":this.config.appId},body:JSON.stringify(c)});if(!b.ok){const y=await b.json().catch(()=>({}));throw new Error(y.error||`HTTP ${b.status}`)}(d=(l=this.config).onSubmit)==null||d.call(l,c),this.clearDraft(),this.showSuccess()}catch(b){this.submitting=!1,this.render();const y=this.shadow.getElementById("errorMsg");y&&(y.textContent=b.message||"Failed to submit",y.style.display="block"),(m=(p=this.config).onError)==null||m.call(p,b)}}collectMetadata(){var c,a;const t=navigator.userAgent,s=navigator;let i="Unknown";/Windows NT 10/.test(t)?i="Windows 10/11":/Windows NT/.test(t)?i="Windows":/Mac OS X (\d+[._]\d+)/.test(t)?i=`macOS ${RegExp.$1.replace("_",".")}`:/iPhone OS (\d+[._]\d+)/.test(t)?i=`iOS ${RegExp.$1.replace("_",".")}`:/Android (\d+(\.\d+)?)/.test(t)?i=`Android ${RegExp.$1}`:/Linux/.test(t)&&(i="Linux");let r="Unknown";/Edg\/(\d+)/.test(t)?r=`Edge ${RegExp.$1}`:/Chrome\/(\d+)/.test(t)?r=`Chrome ${RegExp.$1}`:/Safari\/(\d+)/.test(t)&&/Version\/(\d+(\.\d+)?)/.test(t)?r=`Safari ${RegExp.$1}`:/Firefox\/(\d+)/.test(t)&&(r=`Firefox ${RegExp.$1}`);const n=/Mobi|Android.*Mobile|iPhone/.test(t),o=s.connection||s.mozConnection||s.webkitConnection;return{device_type:n?"mobile":"desktop",os:i,browser:r,screen_resolution:`${screen.width}x${screen.height}`,language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,connection_type:(o==null?void 0:o.effectiveType)||null,color_scheme:(a=(c=window.matchMedia)==null?void 0:c.call(window,"(prefers-color-scheme: dark)"))!=null&&a.matches?"dark":"light",pixel_ratio:window.devicePixelRatio,online:navigator.onLine,referrer:document.referrer||null}}resizeImage(t){return new Promise((s,i)=>{const r=new FileReader;r.onload=()=>{const n=new Image;n.onload=()=>{let{width:c,height:a}=n;(c>1920||a>1920)&&(c>a?(a=Math.round(a*1920/c),c=1920):(c=Math.round(c*1920/a),a=1920));const l=document.createElement("canvas");l.width=c,l.height=a,l.getContext("2d").drawImage(n,0,0,c,a),s(l.toDataURL("image/jpeg",.8))},n.onerror=i,n.src=r.result},r.onerror=i,r.readAsDataURL(t)})}showSuccess(){this.wizard={category:null,step:0,data:{}};const t=this.shadow.getElementById("formBody");t&&(t.innerHTML=`
        <div class="success">
          <div class="check">✅</div>
          <h3>Thank you!</h3>
          <p>Your feedback has been submitted.</p>
        </div>
      `),setTimeout(()=>this.close(),2500)}escHtml(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}escAttr(t){return this.escHtml(t).replace(/"/g,"&quot;")}}customElements.get("ftp-feedback")||customElements.define("ftp-feedback",z);const P={_el:null,init(h){var t,s,i;(t=document.querySelector("ftp-feedback"))==null||t.remove();const e=document.createElement("ftp-feedback");return e.setAttribute("app-id",h.appId),h.apiUrl&&e.setAttribute("api-url",h.apiUrl),h.position&&e.setAttribute("position",h.position),h.theme&&e.setAttribute("theme",h.theme),h.categories&&e.setAttribute("categories",h.categories.join(",")),(s=h.user)!=null&&s.id&&e.setAttribute("user-id",h.user.id),(i=h.user)!=null&&i.email&&e.setAttribute("user-email",h.user.email),document.body.appendChild(e),requestAnimationFrame(()=>{e.configure({onSubmit:h.onSubmit,onError:h.onError})}),this._el=e,e},open(){var h;(h=this._el)==null||h.open()},close(){var h;(h=this._el)==null||h.close()}};return(function(){const e=document.currentScript||document.querySelector("script[data-app-id]");if(e&&e instanceof HTMLScriptElement){const t=e.getAttribute("data-app-id");if(t){const s=()=>{var r;const i=P.init({appId:t,apiUrl:e.getAttribute("data-api-url")||void 0,position:e.getAttribute("data-position")||void 0,theme:e.getAttribute("data-theme")||void 0,categories:(r=e.getAttribute("data-categories"))==null?void 0:r.split(",").map(n=>n.trim()),user:{id:e.getAttribute("data-user-id")||void 0,email:e.getAttribute("data-user-email")||void 0}});e.hasAttribute("data-no-trigger")&&i.setAttribute("no-trigger","")};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",s):s()}}})(),u.FTPFeedback=P,u.FTPFeedbackElement=z,u.TrustScore=A,u.default=P,Object.defineProperties(u,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),u})({});
