// common for all r submodules
  export const CODE              = ''+Math.random();
  export const BROWSER_SIDE      = (() => {try{ return self.DOMParser && true; } catch(e) { return false; }})();

  export function safe (v) {
    if ( typeof v == "object" ) throw new TypeError(`safe() can only be called on a string, or primitive.`);  
    return String(v);
    return String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&#34;').replace(/'/g,'&#39;');
  }

