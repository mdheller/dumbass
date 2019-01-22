// common for all r submodules
  export const CODE              = ''+Math.random();
  export const BROWSER_SIDE      = (() => {try{ return self.DOMParser && true; } catch(e) { return false; }})();

  export function safe (v) {
    return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&#34;').replace(/'/g,'&#39;');
  }

