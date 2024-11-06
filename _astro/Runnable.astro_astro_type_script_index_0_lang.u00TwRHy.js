const d=new Blob([`
      importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.3/full/pyodide.js");

      async function loadPyodideAndPackages() {
        self.pyodide = await loadPyodide();
        await self.pyodide.loadPackage("micropip");
      }

      let pyodideReadyPromise = loadPyodideAndPackages();

      self.onmessage = async (event) => {
        await pyodideReadyPromise;
        const { pythonCode } = event.data;
        try {
          self.pyodide.runPython(\`
            import sys
            import io
            sys.stdout = io.StringIO()
          \`);
          await self.pyodide.loadPackagesFromImports(pythonCode);
          await self.pyodide.runPythonAsync(pythonCode);
          const output = await self.pyodide.runPythonAsync("sys.stdout.getvalue()");
          self.postMessage({ results: output });
        } catch (error) {
          self.postMessage({ error: error.message });
        }
      };
    `],{type:"application/javascript"});function c(){const i=document.createElement("style");i.textContent=`
    .rb-btn { 
      font-family: monospace; line-height: normal;
      background-color: rgba(23, 23, 23, 0.2); color: #737373;
      border: 1px solid #737373; text-align: center; font-size: 1rem;
      border-radius: 4px; margin-left: 4px; padding: 0 4px 0 4px;
      height: 26px; width: 26px;
    }
    .rb-btn:hover { color: #d4d4d4; border-color: #d4d4d4; }
    .rb-editor { border-radius: 4px; padding: 2px; }
    .rb-editor .ace_content { padding-left: 8px;}
    .rb-container {
      position: relative; background-color: #282828; border-radius: 4px;
      line-height: normal; padding: 0px; margin: 24px 0px;
      box-shadow: 25px 25px 50px 5px #000000c6;
    }
    .rb-btn-group {
      position: absolute; z-index: 10; top: 8px; right: 8px;
      line-height: 0px;
    }
    .rb-output { margin: 0; padding: 0; color: #fafafa; }
    .rb-output:not(:empty) {
      font-family: monospace; font-size: 0.875rem;
      margin: 4px 8px; padding: 0 0 4px 0;
    }
    .rb-loading {
      display: flex; justify-content: center;
      div {
        width: 0.3rem; height: 0.3rem; margin: 0.4rem 0.3rem;
        background: #fafafa; border-radius: 50%;
        animation: 0.9s bounce infinite alternate;
        &:nth-child(2) { animation-delay: 0.3s; }
        &:nth-child(3) { animation-delay: 0.6s; }
      }
    }
    @keyframes bounce {
      to { opacity: 0.3; transform: translate3d(0, -0.4rem, 0); }
    }
  `,document.head.appendChild(i)}function l(i,n,e=!0){const o=document.createElement("div");o.classList.add("rb-editor");const t=ace.edit(o);return t.session.setMode("ace/mode/python"),t.setTheme("ace/theme/gruvbox"),t.renderer.setScrollMargin(10,10),t.getSession().selection.on("changeSelection",function(r){t.getSession().selection.clearSelection()}),t.container.style.pointerEvents="none",t.renderer.$cursorLayer.element.style.display="none",t.setValue(n),t.setOptions({readOnly:!0,fontSize:"0.875rem",highlightActiveLine:!1,highlightGutterLine:!1,showFoldWidgets:!1,showGutter:e,showPrintMargin:!1,minLines:2,maxLines:30}),i.appendChild(o),t}function a(i,n){const e=document.createElement("button");return e.textContent=i,e.classList.add("rb-btn"),e.addEventListener("click",n),e}function p(i,n,e,o){const t=document.createElement("div");t.classList.add("rb-btn-group"),t.appendChild(a("▷",n)),t.appendChild(a("⟳",e)),t.appendChild(a("⧠",o)),i.appendChild(t)}function u(i){const n=document.createElement("div");return n.classList.add("rb-output"),i.appendChild(n),n}class s{constructor(n,e,o){this.worker=new Worker(URL.createObjectURL(d)),c(),this.container=n,this.container.classList.add("rb-container","not-content"),this.editor=l(this.container,e,o),this.createOutput(),p(this.container,this.runCode.bind(this),this.clearOutput.bind(this),this.copyCode.bind(this))}createOutput(){this.output=u(this.container)}runCode(){this.output.innerHTML='<div class="rb-loading"><div></div><div></div><div></div></div>';const n=this.editor.getValue();this.worker.postMessage({pythonCode:n}),this.worker.onmessage=e=>{const{results:o,error:t}=e.data;this.output.textContent=o||this.handleError(t)}}clearOutput(){this.output.textContent=""}copyCode(){const n=this.editor.getValue();navigator.clipboard.writeText(n).then(()=>{console.log("Code copied to clipboard")}).catch(e=>{console.error("Could not copy text: ",e)})}handleError(n){const e=n.message||n.toString(),o=e.split(`
`);return o[o.length-2]||e}static initialize(){document.querySelectorAll("script[type='text/runnable'], pre.runnable, div.not-content").forEach(e=>{const o=e.textContent.trim(),t=e.dataset.lines!=="false",r=document.createElement("div");e.replaceWith(r),new s(r,o,t).editor.clearSelection(!0)})}}document.addEventListener("DOMContentLoaded",()=>{s.initialize()});
