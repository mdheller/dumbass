// common for all r submodules
  export const CODE              = ''+Math.random();
  export const BROWSER_SIDE      = (() => {try{ return self.DOMParser && true; } catch(e) { return false; }})();

