var FTPFeedback=(function(a){"use strict";var S=Object.defineProperty;var A=(a,d,c)=>d in a?S(a,d,{enumerable:!0,configurable:!0,writable:!0,value:c}):a[d]=c;var x=(a,d,c)=>A(a,typeof d!="symbol"?d+"":d,c);const d=`
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
`,c="https://ftp-feedback-api.onrender.com";class y extends HTMLElement{constructor(){super();x(this,"shadow");x(this,"config");x(this,"isOpen",!1);x(this,"screenshots",[]);this.shadow=this.attachShadow({mode:"open"}),this.config={appId:"",apiUrl:c,position:"bottom-right",theme:"light",categories:["bug","suggestion","question"],user:{}}}static get observedAttributes(){return["app-id","api-url","position","theme","categories","user-id","user-email"]}connectedCallback(){this.config.appId=this.getAttribute("app-id")||this.config.appId,this.config.apiUrl=this.getAttribute("api-url")||this.config.apiUrl,this.config.position=this.getAttribute("position")||this.config.position,this.config.theme=this.getAttribute("theme")||this.config.theme,this.config.user.id=this.getAttribute("user-id")||void 0,this.config.user.email=this.getAttribute("user-email")||void 0;const e=this.getAttribute("categories");e&&(this.config.categories=e.split(",").map(t=>t.trim())),this.config.theme!=="light"&&this.setAttribute("theme",this.config.theme),this.render()}configure(e){Object.assign(this.config,e),e.theme&&this.setAttribute("theme",e.theme),this.render()}open(){this.isOpen=!0,this.render()}close(){this.isOpen=!1,this.screenshots=[],this.render()}render(){const e=this.config.position;this.shadow.innerHTML=`
      <style>${d}</style>
      <button class="trigger ${e}" id="trigger">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      ${this.isOpen?this.renderForm():""}
    `,this.bindEvents()}renderForm(){return`
      <div class="overlay ${this.config.position}" id="overlay">
        <div class="header">
          <h3>Send Feedback</h3>
          <button class="close-btn" id="close">&times;</button>
        </div>
        <div class="body" id="formBody">
          <div class="field">
            <label>Type</label>
            <div class="type-selector" id="typeSelector">
              ${this.config.categories.map((t,o)=>`
                <button class="type-btn ${o===0?"active":""}" data-type="${t}">
                  <span class="emoji">${t==="bug"?"🐛":t==="suggestion"?"💡":t==="question"?"❓":"📝"}</span>
                  ${t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              `).join("")}
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
    `}bindEvents(){const e=this.shadow.getElementById("trigger");e==null||e.addEventListener("click",()=>{this.isOpen?this.close():this.open()});const t=this.shadow.getElementById("close");t==null||t.addEventListener("click",()=>this.close());const o=this.shadow.getElementById("typeSelector");o==null||o.querySelectorAll(".type-btn").forEach(p=>{p.addEventListener("click",()=>{o.querySelectorAll(".type-btn").forEach(f=>f.classList.remove("active")),p.classList.add("active")})});const s=this.shadow.getElementById("fileInput");s==null||s.addEventListener("change",()=>{s.files&&(Array.from(s.files).forEach(p=>this.addScreenshot(p)),s.value="")});const n=this.shadow.getElementById("overlay");n==null||n.addEventListener("paste",p=>{var g;const b=(g=p.clipboardData)==null?void 0:g.items;if(b){for(const u of Array.from(b))if(u.type.startsWith("image/")){const m=u.getAsFile();m&&this.addScreenshot(m)}}});const h=this.shadow.getElementById("submitBtn");h==null||h.addEventListener("click",()=>this.submit())}addScreenshot(e){if(this.screenshots.length>=5)return;const t=new FileReader;t.onload=()=>{this.screenshots.push(t.result),this.renderScreenshots()},t.readAsDataURL(e)}renderScreenshots(){const e=this.shadow.getElementById("screenshots");if(!e)return;e.querySelectorAll(".screenshot-preview").forEach(o=>o.remove());const t=e.querySelector(".upload-btn");this.screenshots.forEach((o,s)=>{const n=document.createElement("div");n.className="screenshot-preview",n.innerHTML=`<img src="${o}"><button class="screenshot-remove" data-idx="${s}">&times;</button>`,e.insertBefore(n,t)}),e.querySelectorAll(".screenshot-remove").forEach(o=>{o.addEventListener("click",s=>{const n=parseInt(s.target.getAttribute("data-idx")||"0");this.screenshots.splice(n,1),this.renderScreenshots()})}),t&&(t.style.display=this.screenshots.length>=5?"none":"")}async submit(){var b,g,u,m,w,k;const e=this.shadow.querySelector(".type-btn.active"),t=this.shadow.getElementById("title"),o=this.shadow.getElementById("description"),s=this.shadow.getElementById("submitBtn"),n=this.shadow.getElementById("errorMsg"),h=(e==null?void 0:e.dataset.type)||"bug",p=(b=t==null?void 0:t.value)==null?void 0:b.trim();if(!p){n.textContent="Please enter a title",n.style.display="block";return}n.style.display="none",s.disabled=!0,s.textContent="Submitting...";const f={type:h,title:p,body:((g=o==null?void 0:o.value)==null?void 0:g.trim())||void 0,user_id:this.config.user.id,user_email:this.config.user.email,page_url:window.location.href,route:window.location.pathname,user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,screenshots:this.screenshots.length?this.screenshots:void 0};try{const l=await fetch(`${this.config.apiUrl}/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json","X-App-Id":this.config.appId},body:JSON.stringify(f)});if(!l.ok){const E=await l.json().catch(()=>({}));throw new Error(E.error||`HTTP ${l.status}`)}(m=(u=this.config).onSubmit)==null||m.call(u,f),this.showSuccess()}catch(l){n.textContent=l.message||"Failed to submit",n.style.display="block",s.disabled=!1,s.textContent="Submit Feedback",(k=(w=this.config).onError)==null||k.call(w,l)}}showSuccess(){const e=this.shadow.getElementById("formBody");e&&(e.innerHTML=`
        <div class="success">
          <div class="check">✅</div>
          <h3>Thank you!</h3>
          <p>Your feedback has been submitted.</p>
        </div>
      `),setTimeout(()=>{this.close()},2500)}}customElements.get("ftp-feedback")||customElements.define("ftp-feedback",y);const v={_el:null,init(r){var e,t,o;(e=document.querySelector("ftp-feedback"))==null||e.remove();const i=document.createElement("ftp-feedback");return i.setAttribute("app-id",r.appId),r.apiUrl&&i.setAttribute("api-url",r.apiUrl),r.position&&i.setAttribute("position",r.position),r.theme&&i.setAttribute("theme",r.theme),r.categories&&i.setAttribute("categories",r.categories.join(",")),(t=r.user)!=null&&t.id&&i.setAttribute("user-id",r.user.id),(o=r.user)!=null&&o.email&&i.setAttribute("user-email",r.user.email),document.body.appendChild(i),requestAnimationFrame(()=>{i.configure({onSubmit:r.onSubmit,onError:r.onError})}),this._el=i,i},open(){var r;(r=this._el)==null||r.open()},close(){var r;(r=this._el)==null||r.close()}};return(function(){const i=document.currentScript||document.querySelector("script[data-app-id]");if(i&&i instanceof HTMLScriptElement){const e=i.getAttribute("data-app-id");if(e){const t=()=>{var o;v.init({appId:e,apiUrl:i.getAttribute("data-api-url")||void 0,position:i.getAttribute("data-position")||void 0,theme:i.getAttribute("data-theme")||void 0,categories:(o=i.getAttribute("data-categories"))==null?void 0:o.split(",").map(s=>s.trim()),user:{id:i.getAttribute("data-user-id")||void 0,email:i.getAttribute("data-user-email")||void 0}})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):t()}}})(),a.FTPFeedback=v,a.FTPFeedbackElement=y,a.default=v,Object.defineProperties(a,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),a})({});
