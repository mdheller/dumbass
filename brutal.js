(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.bundleobrutal = {})));
}(this, (function (exports) { 'use strict';

  // common for all r submodules
    const CODE              = ''+Math.random();
    const BROWSER_SIDE      = (() => {try{ return self.DOMParser && true; } catch(e) { return false; }})();

    function safe (v) {
      return String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&/g,'&amp;').replace(/"/g,'&#34;').replace(/'/g,'&#39;');
    }

  const BROWSER_SIDE$1      = (() => {try{ return self.DOMParser && true; } catch(e) { return false; }})();

    const BuiltIns = [
      Symbol, Boolean, Number, String, Object, Set, Map, WeakMap, WeakSet,
      Uint8Array, Uint16Array, Uint32Array, Float32Array, Float64Array,
      Int8Array, Int16Array, Int32Array, 
      Uint8ClampedArray, 
      ...(BROWSER_SIDE$1 ? [
        Node,NodeList,Element,HTMLElement, Blob, ArrayBuffer,
        FileList, Text, Document, DocumentFragment,
        Error, File, Event, EventTarget, URL
      ] : [ Buffer ])
    ];

    const isNone = instance => instance == null || instance == undefined;

    const typeCache = new Map();

    Object.assign(T, {check, sub, verify: verify$1, validate, def, defSub, defTuple, defCollection, defOr, option, defOption, or, guard, errors});

    defineSpecials();
    mapBuiltins();

    function T(parts, ...vals) {
      const cooked = vals.reduce((prev,cur,i) => prev+cur+parts[i+1], parts[0]);
      const typeName = cooked;
      if ( !typeCache.has(typeName) ) throw {error:`Cannot use type ${typeName} before it is defined.`};
      return new Type(typeName);
    }

    function validate(type, instance) {
      guardType(type);
      guardExists(type);
      let typeName = type.name;

      const {spec,kind,verify} = typeCache.get(typeName);

      const bigErrors = [];

      switch(kind) {
        case "def": 
          let allValid = true;
          if ( !! spec ) {
            const keyPaths = Object.keys(spec);
            allValid = !isNone(instance) && keyPaths.every(kp => {
              const {resolved, errors:lookupErrors} = lookup(instance,kp);
              bigErrors.push(...lookupErrors);
              if ( lookupErrors.length ) return false;
              const {valid, errors: validationErrors} = validate(spec[kp], resolved);
              bigErrors.push(...validationErrors);
              return valid;
            });
          }
          let verified = true;
          if ( !!verify ) {
            try {
              verified = verify(instance);
            } catch(e) {
              bigErrors.push(e);
            }
          }
          return {valid: allValid && verified, errors: bigErrors}
        case "defCollection":
          const {valid:containerValid, errors:containerErrors} = validate(spec.container, instance);
          bigErrors.push(...containerErrors);
          let membersValid = true;
          if ( containerValid ) {
             membersValid= [...instance].every(member => {
              const {valid, errors} = validate(spec.member, member);
              bigErrors.push(...errors);
              return valid;
            });
          }
          return {valid:containerValid && membersValid, errors:bigErrors};
        default: {
          throw {error: `Checking for type kind ${kind} is not yet implemented.`}
        }
      }
    }

    function check(...args) {
      return validate(...args).valid;
    }

    function lookup(obj, keyPath) {
      if ( isNone(obj) ) throw {error:`Lookup requires a non-unset object.`};

      if ( !keyPath ) throw {error: `keyPath must not be empty`};

      const keys = keyPath.split(/\./g);
      const pathComplete = [];
      const errors = [];

      let resolved = obj;

      while(keys.length) {
        const nextKey = keys.shift();
        resolved = resolved[nextKey];
        pathComplete.push(nextKey);
        if ( keys.length && resolved == null || resolved == undefined ) {
          errors.push( { error: `Lookup on key path ${keyPath} failed at ${pathComplete.join('.')}
          when null or undefined was found.` });
          break;
        }
      }
      return {resolved,errors};
    }

    function option(type) {
      return T`?${type.name}`;
    }

    function sub(type) {
      return T`>${type.name}`;
    }

    function defSub(type, spec, {verify} = {}) {
      guardType(type);
      guardExists(type);
      return def(`>${type.name}`, spec, {verify});
    }

    function exists(name) {
      return typeCache.has(name);
    }

    function guardRedefinition(name) {
      if ( exists(name) ) throw {error: `Type ${name} cannot be redefined.`};
    }

    function defOption(type) {
      guardType(type);
      const typeName = type.name;
      return T.def(`?${typeName}`, null, {verify: i => isUnset(i) || T.check(type,i)});
    }

    function verify$1(...args) { return check(...args); }

    function defCollection(name, {container, member}) {
      if ( !name ) throw {error:`Type must be named.`}; 
      if ( !container || !member ) throw {error:`Type must be specified.`};
      guardRedefinition(name);

      const kind = 'defCollection';
      const spec = {kind, spec: { container, member}};
      typeCache.set(name, spec);
      return new Type(name);
    }

    function defTuple(name, {pattern}) {
      if ( !name ) throw {error:`Type must be named.`}; 
      if ( !pattern ) throw {error:`Type must be specified.`};
      const kind = 'def';
      const specObj = {};
      pattern.forEach((type,key) => specObj[key] = type);
      const spec = {kind, spec: specObj};
      typeCache.set(name, spec);
      return new Type(name);
    }

    function Type(name, mods = {}) {
      if ( ! new.target ) throw {error:`Type with new only.`};
      Object.defineProperty(this,'name', {get: () => name});
      this.typeName = name;
    }

    Type.prototype.toString = function () {
      return `${this.name} Type`;
    };

    function def(name, spec, {verify} = {}) {
      if ( !name ) throw {error:`Type must be named.`}; 
      guardRedefinition(name);

      const kind = 'def';
      typeCache.set(name, {spec,kind,verify});
      return new Type(name);
    }

    function or(...types) { // anonymous standin for defOr
      // could we do this with `name|name2|...` etc ?  we have to sort names so probably can
      throw {error: `Or is not implemented yet.`};
    }

    function defOr(name, ...types) {
      return T.def(name, null, {verify: i => types.some(t => check(t,i))});
    }

    function guard(type, instance) {
      guardType(type);
      guardExists(type);
      if ( ! verify$1(type, instance) ) throw {error: `Type ${typeName} requested, but item is not of that type.`};
    }

    function guardType(t) {
      if ( !(t instanceof Type) ) throw {error: `Type must be a valid Type object.`};
    }

    function guardExists(t) {
      if ( ! exists(t.name) ) throw {error:`Type must exist. Type ${t.name} has not been defined.`};
    }

    function errors(...args) {
      return validate(...args).errors;
    }

    function mapBuiltins() {
      BuiltIns.forEach(t => def(t.name, null, {verify: i => i.constructor.name === t.name}));  
      BuiltIns.forEach(t => defSub(T`${t.name}`, null, {verify: i => i instanceof t}));  
    }

    function defineSpecials() {
      T.def(`Any`, null, {verify: i => true});
      T.def(`Some`, null, {verify: i => !isUnset(i)});
      T.def(`None`, null, {verify: i => isUnset(i)});
      T.def(`Function`, null, {verify: i => i instanceof Function});
      T.def(`Integer`, null, {verify: i => Number.isInteger(i)});
      T.def(`Array`, null, {verify: i => Array.isArray(i)});
      T.def(`Iterable`, null, {verify: i => i[Symbol.iterator] instanceof Function});
    }

    function isUnset(i) {
      return i === null || i === undefined;
    }

  const BROWSER_SIDE$2      = (() => {try{ return self.DOMParser && true; } catch(e) { return false; }})();

    const BuiltIns$1 = [
      Symbol, Boolean, Number, String, Object, Set, Map, WeakMap, WeakSet,
      Uint8Array, Uint16Array, Uint32Array, Float32Array, Float64Array,
      Int8Array, Int16Array, Int32Array, 
      Uint8ClampedArray, 
      ...(BROWSER_SIDE$2 ? [
        Node,NodeList,Element,HTMLElement, Blob, ArrayBuffer,
        FileList, Text, Document, DocumentFragment,
        Error, File, Event, EventTarget, URL
      ] : [ Buffer ])
    ];

    const isNone$1 = instance => instance == null || instance == undefined;

    const typeCache$1 = new Map();

    Object.assign(T$1, {check: check$1, sub: sub$1, verify: verify$2, validate: validate$1, def: def$1, defSub: defSub$1, defTuple: defTuple$1, defCollection: defCollection$1, defOr: defOr$1, option: option$1, defOption: defOption$1, or: or$1, guard: guard$1, errors: errors$1});

    defineSpecials$1();
    mapBuiltins$1();

    function T$1(parts, ...vals) {
      const cooked = vals.reduce((prev,cur,i) => prev+cur+parts[i+1], parts[0]);
      const typeName = cooked;
      if ( !typeCache$1.has(typeName) ) throw {error:`Cannot use type ${typeName} before it is defined.`};
      return new Type$1(typeName);
    }

    function validate$1(type, instance) {
      guardType$1(type);
      guardExists$1(type);
      let typeName = type.name;

      const {spec,kind,verify} = typeCache$1.get(typeName);

      const bigErrors = [];

      switch(kind) {
        case "def": 
          let allValid = true;
          if ( !! spec ) {
            const keyPaths = Object.keys(spec);
            allValid = !isNone$1(instance) && keyPaths.every(kp => {
              const {resolved, errors:lookupErrors} = lookup$1(instance,kp);
              bigErrors.push(...lookupErrors);
              if ( lookupErrors.length ) return false;
              const {valid, errors: validationErrors} = validate$1(spec[kp], resolved);
              bigErrors.push(...validationErrors);
              return valid;
            });
          }
          let verified = true;
          if ( !!verify ) {
            try {
              verified = verify(instance);
            } catch(e) {
              bigErrors.push(e);
            }
          }
          return {valid: allValid && verified, errors: bigErrors}
        case "defCollection":
          const {valid:containerValid, errors:containerErrors} = validate$1(spec.container, instance);
          bigErrors.push(...containerErrors);
          let membersValid = true;
          if ( containerValid ) {
             membersValid= [...instance].every(member => {
              const {valid, errors} = validate$1(spec.member, member);
              bigErrors.push(...errors);
              return valid;
            });
          }
          return {valid:containerValid && membersValid, errors:bigErrors};
        default: {
          throw {error: `Checking for type kind ${kind} is not yet implemented.`}
        }
      }
    }

    function check$1(...args) {
      return validate$1(...args).valid;
    }

    function lookup$1(obj, keyPath) {
      if ( isNone$1(obj) ) throw {error:`Lookup requires a non-unset object.`};

      if ( !keyPath ) throw {error: `keyPath must not be empty`};

      const keys = keyPath.split(/\./g);
      const pathComplete = [];
      const errors = [];

      let resolved = obj;

      while(keys.length) {
        const nextKey = keys.shift();
        resolved = resolved[nextKey];
        pathComplete.push(nextKey);
        if ( keys.length && resolved == null || resolved == undefined ) {
          errors.push( { error: `Lookup on key path ${keyPath} failed at ${pathComplete.join('.')}
          when null or undefined was found.` });
          break;
        }
      }
      return {resolved,errors};
    }

    function option$1(type) {
      return T$1`?${type.name}`;
    }

    function sub$1(type) {
      return T$1`>${type.name}`;
    }

    function defSub$1(type, spec, {verify} = {}) {
      guardType$1(type);
      guardExists$1(type);
      return def$1(`>${type.name}`, spec, {verify});
    }

    function exists$1(name) {
      return typeCache$1.has(name);
    }

    function guardRedefinition$1(name) {
      if ( exists$1(name) ) throw {error: `Type ${name} cannot be redefined.`};
    }

    function defOption$1(type) {
      guardType$1(type);
      const typeName = type.name;
      return T$1.def(`?${typeName}`, null, {verify: i => isUnset$1(i) || T$1.check(type,i)});
    }

    function verify$2(...args) { return check$1(...args); }

    function defCollection$1(name, {container, member}) {
      if ( !name ) throw {error:`Type must be named.`}; 
      if ( !container || !member ) throw {error:`Type must be specified.`};
      guardRedefinition$1(name);

      const kind = 'defCollection';
      const spec = {kind, spec: { container, member}};
      typeCache$1.set(name, spec);
      return new Type$1(name);
    }

    function defTuple$1(name, {pattern}) {
      if ( !name ) throw {error:`Type must be named.`}; 
      if ( !pattern ) throw {error:`Type must be specified.`};
      const kind = 'def';
      const specObj = {};
      pattern.forEach((type,key) => specObj[key] = type);
      const spec = {kind, spec: specObj};
      typeCache$1.set(name, spec);
      return new Type$1(name);
    }

    function Type$1(name, mods = {}) {
      if ( ! new.target ) throw {error:`Type with new only.`};
      Object.defineProperty(this,'name', {get: () => name});
      this.typeName = name;
    }

    Type$1.prototype.toString = function () {
      return `${this.name} Type`;
    };

    function def$1(name, spec, {verify} = {}) {
      if ( !name ) throw {error:`Type must be named.`}; 
      guardRedefinition$1(name);

      const kind = 'def';
      typeCache$1.set(name, {spec,kind,verify});
      return new Type$1(name);
    }

    function or$1(...types) { // anonymous standin for defOr
      // could we do this with `name|name2|...` etc ?  we have to sort names so probably can
      throw {error: `Or is not implemented yet.`};
    }

    function defOr$1(name, ...types) {
      return T$1.def(name, null, {verify: i => types.some(t => check$1(t,i))});
    }

    function guard$1(type, instance) {
      guardType$1(type);
      guardExists$1(type);
      if ( ! verify$2(type, instance) ) throw {error: `Type ${typeName} requested, but item is not of that type.`};
    }

    function guardType$1(t) {
      if ( !(t instanceof Type$1) ) throw {error: `Type must be a valid Type object.`};
    }

    function guardExists$1(t) {
      if ( ! exists$1(t.name) ) throw {error:`Type must exist. Type ${t.name} has not been defined.`};
    }

    function errors$1(...args) {
      return validate$1(...args).errors;
    }

    function mapBuiltins$1() {
      BuiltIns$1.forEach(t => def$1(t.name, null, {verify: i => i.constructor.name === t.name}));  
      BuiltIns$1.forEach(t => defSub$1(T$1`${t.name}`, null, {verify: i => i instanceof t}));  
    }

    function defineSpecials$1() {
      T$1.def(`Any`, null, {verify: i => true});
      T$1.def(`Some`, null, {verify: i => !isUnset$1(i)});
      T$1.def(`None`, null, {verify: i => isUnset$1(i)});
      T$1.def(`Function`, null, {verify: i => i instanceof Function});
      T$1.def(`Integer`, null, {verify: i => Number.isInteger(i)});
      T$1.def(`Array`, null, {verify: i => Array.isArray(i)});
      T$1.def(`Iterable`, null, {verify: i => i[Symbol.iterator] instanceof Function});
    }

    function isUnset$1(i) {
      return i === null || i === undefined;
    }

  // server side rendering 

    const LAST_ATTR_NAME    = /\s+([\w-]+)\s*=\s*"?\s*$/;
    const NEW_TAG           = /<\w+/g;

    T$1.def('BrutalObject', {
      str: T$1`String`,
      handlers: T$1`Object`
    });

    T$1.defCollection('BrutalArray', {
      container: T$1`Array`,
      member: T$1`BrutalObject`
    });

    function S(parts, ...vals) {
      const handlers = {};
      let hid, lastNewTagIndex, lastTagName, str = '';

      parts = [...parts];

      const keyObj = vals.find( v => !!v && v.key !== undefined ) || {};

      vals = vals.map(SparseValue);

      while (parts.length > 1) {
        let part = parts.shift();
        let attrNameMatches = part.match(LAST_ATTR_NAME);
        let newTagMatches = part.match(NEW_TAG);
        let val = vals.shift();
        if (newTagMatches) {
          if ( handlers[hid] ) str = markInsertionPoint({str,lastNewTagIndex,lastTagName,hid});
          hid = `hid_${Math.random()}`.replace('.','');
          const lastTag = newTagMatches[newTagMatches.length-1];
          lastNewTagIndex = part.lastIndexOf(lastTag) + str.length;
          lastTagName = lastTag.slice(1);
        }
        if (T$1.check(T$1`Function`, val)) {
          const attrName = attrNameMatches && attrNameMatches.length > 1
              ? attrNameMatches[1].replace(/^on/,'').toLowerCase()
              : false,
            newPart = part.replace(attrNameMatches[0], '');
          str += attrName ? newPart : part;
          if ( T$1.check(T$1`Array`, handlers[hid]) ) handlers[hid] = [];
          handlers[hid].push({eventName: attrName, handler: val});
        } else if (T$1.check(T$1`BrutalObject`, val)) {
          Object.assign(handlers,val.handlers);
          str += part;
          val = val.str;
          if (attrNameMatches) val = `${val}`;
          str += val;
        } else {
          str += part;
          str += attrNameMatches ? `${safe(val)}` : safe(val);
        }
      }
      if ( handlers[hid] ) str = markInsertionPoint({str,lastNewTagIndex,lastTagName,hid});
      str += parts.shift();

      return {str,handlers,to,code:CODE};
    }

    function to(location, options) {
      let {modules,scripts} = options || {};
      modules = modules || [];
      scripts = scripts || [];
      const {str,handlers} = this;
      // notice this is a regular template literal
      const page = `
      <!DOCTYPE html>
      <meta charset=utf8>
      <body> 
        ${str}
        <script>
          const hydration = ${JSON.stringify(handlers,(k,v) => T$1.check(T$1`Function`, v) ? v.toString() : v)};

          hydrate(hydration);

          document.currentScript.remove();

          ${hydrate.toString()}

          ${activateNode.toString()}

          ${getHids.toString()}
          
          function revive(fstr) {
            const f = eval(fstr);
            return f;
          }
        </script>
        ${modules.map(src => `<script type=module src=${src}></script>`)}
        ${scripts.map(src => `<script src=${src}></script>`)}
      </body>
    `;
      location.send(page); 
    }

    function markInsertionPoint({str,lastNewTagIndex,lastTagName,hid}) {
      const before = str.slice(0,lastNewTagIndex);
      const after = str.slice(lastNewTagIndex);
      return before + `<!--${hid}-->` + after;
    }

    function SparseValue(v) {
      if ( T$1.check(T$1`BrutalArray`, v) ) {
        return Sjoin(v) || '';
      } else if ( T$1.check(T$1`Object`, v) ) {
        if ( T$1.check(T$1`BrutalObject`, v) ) {
          return v;
        }
        throw {error: OBJ(), value: v};
      } else T$1.check(T$1`None`, v) ? '' : v;
    }

    function hydrate(handlers) {
      const hids = getHids(document);

      Object.entries(handlers).forEach(
        ([hid,nodeHandlers]) => activateNode(hids,{hid,nodeHandlers}));
    }

    function activateNode(hids,{hid,nodeHandlers}) {
      const hidNode = hids[hid];
      let node;

      if (!!hidNode) {
        node = hidNode.nextElementSibling;
        hidNode.remove();
      } else throw {error:MARKER(hid)}

      const bondHandlers = [];

      if (!!node && !!nodeHandlers) {
        nodeHandlers.forEach(({eventName,handler}) => {
          handler = revive(handler);
          if ( eventName == 'bond' ) {
            bondHandlers.push(()  => handler(node));
          } else node.addEventListener(eventName,handler);
        });
      } else throw {error: HID(hid)} 

      bondHandlers.forEach(f => f());
    }

    function getHids(parent) {
      const walker = document.createTreeWalker(parent,NodeFilter.SHOW_COMMENT,{acceptNode: node => node.nodeType == Node.COMMENT_NODE && node.nodeValue.startsWith('hid_')});
      const hids = {};
      do{
        const node = walker.currentNode;
        if ( node.nodeType == Node.COMMENT_NODE && node.nodeValue.startsWith("hid_") ) {
          hids[node.data] = node;
        }
      } while(walker.nextNode());
      return hids;
    }

    function Sjoin(rs) {
      const H = {},
        str = rs.map(({str,handlers,code}) => (
          verify({str,handlers,code},currentKey),Object.assign(H,handlers),str)).join('\n');

      if (str) {
        const o = {str,handlers:H};
        o.code = CODE;
        return o;
      }
    }

  // r.js

    T.def('Key', null, {verify: v => typeof v === "object" &&  !!((v.key||'')+'') });
    T.def('BrutalLikeObject', {
      code: T`String`,
      externals: T`Array`,
      nodes: T`Array`,
      to: T`Function`,
      update: T`Function`,
      v: T`Array`
    });
    T.def('BrutalObject', {
      code: T`String`,
      externals: T`Array`,
      nodes: T`Array`,
      to: T`Function`,
      update: T`Function`,
      v: T`Array`
    }, {verify: v => verify$3(v)});

    T.defCollection('BrutalArray', {
      container: T`Array`,
      member: T`BrutalObject`
    });
    const KEYMATCH          = / ?(?:<!\-\-)? ?(key\d+) ?(?:\-\->)? ?/gm;
    const KEYLEN            = 20;
    const XSS               = () => `Possible XSS / object forgery attack detected. ` +
                              `Object code could not be verified.`;
    const OBJ$1               = () => `Object values not allowed here.`;
    const UNSET             = () => `Unset values not allowed here.`;
    const MOVE              = new class {
      beforeEnd   (frag,elem) { elem.appendChild(frag); }
      beforeBegin (frag,elem) { elem.parentNode.insertBefore(frag,elem); }
      afterEnd    (frag,elem) { elem.parentNode.insertBefore(frag,elem.nextSibling); }
      replace     (frag,elem) { elem.parentNode.replaceChild(frag,elem); }
      afterBegin  (frag,elem) { elem.insertBefore(frag,elem.firstChild); }
      innerHTML   (frag,elem) { elem.innerHTML = ''; elem.appendChild(frag); }
    };
    const INSERT            = () => `Error inserting template into DOM. ` +
      `Position must be one of: ` +
      `replace, beforeBegin, afterBegin, beforeEnd, innerHTML, afterEnd`;
    const isKey             = v => T.check(T`Key`, v);
    const cache = {};

    Object.assign(R,{s,skip,die,BROWSER_SIDE});

    function R(p,...v) {
      if ( ! BROWSER_SIDE ) return S(p,...v);

      v = v.map(parseVal);

      const {key:instanceKey} = (v.find(isKey) || {});
      const cacheKey = p.join('<link rel=join>');
      const {cached,firstCall} = isCached(cacheKey,v,instanceKey);
     
      if ( ! firstCall ) return cached;

      p = [...p]; 
      const vmap = {};
      const V = v.map(replaceVal(vmap));
      const externals = [];
      let str = '';

      while( p.length > 1 ) str += p.shift() + V.shift();
      str += p.shift();

      const frag = toDOM(str);
      const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ALL);

      do {
        makeUpdaters({walker,vmap,externals});
      } while(walker.nextNode())

      const retVal = {externals,v:Object.values(vmap),to: to$1,
        update,code:CODE,nodes:[...frag.childNodes]};
      if ( !! instanceKey ) {
        cache[cacheKey].instances[instanceKey] = retVal;
      } else {
        cache[cacheKey] = retVal;
      }
      return retVal;
    }

    function X(p,...v) {
      v = v.map(parseVal);

      p = [...p]; 
      const vmap = {};
      const V = v.map(replaceVal(vmap));
      const externals = [];
      let str = '';

      while( p.length > 1 ) str += p.shift() + V.shift();
      str += p.shift();

      const frag = toDOM(str);
      const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ALL);

      do {
        makeUpdaters({walker,vmap,externals});
      } while(walker.nextNode())

      const retVal = {externals,v:Object.values(vmap),to: to$1,
        update,code:CODE,nodes:[...frag.childNodes]};
      return retVal;
    }

    function to$1(location, options) {
      const position = options || 'replace';
      const frag = document.createDocumentFragment();
      this.nodes.forEach(n => frag.appendChild(n));
      const elem = T.check(T`>Node`, location) ? location : document.querySelector(location);
      try {
        MOVE[position](frag,elem);
      } catch(e) {
        die({error: INSERT()},e);
      }
      while(this.externals.length) {
        this.externals.shift()();
      }
    }

    function makeUpdaters({walker,vmap,externals}) {
      const node = walker.currentNode;
      switch( node.nodeType ) {
        case Node.ELEMENT_NODE:
          handleElementNode({node,vmap,externals});
        break;
        case Node.COMMENT_NODE:
        case Node.TEXT_NODE:
          handleTextNode({node,vmap,externals});
        break;
        default:
        break;
      }
    }

    function handleTextNode({node,vmap,externals}) {
      const lengths = [];
      const text = node.nodeValue; 
      let result;
      while( result = KEYMATCH.exec(text) ) {
        const {index} = result;
        const key = result[1];
        const val = vmap[key];
        const replacer = makeTextNodeUpdater({node,index,lengths,val,valIndex:val.vi});
        externals.push(() => replacer(val.val));
        val.replacers.push( replacer );
      }
    }

    function makeTextNodeUpdater({node,index,lengths,valIndex,val}) {
      let oldNodes = [node];
      let lastAnchor = node;
      return (newVal) => {
        val.val = newVal;
        switch(typeof newVal) {
          case "object":
            if ( !! newVal.nodes.length ) {
              newVal.nodes.forEach(n => lastAnchor.parentNode.insertBefore(n,lastAnchor.nextSibling));
              lastAnchor = newVal.nodes[0];
            } else {
              const placeholderNode = summonPlaceholder(lastAnchor);
              lastAnchor.parentNode.insertBefore(placeholderNode,lastAnchor.nextSibling);
              lastAnchor = placeholderNode;
            }
            const dn = diffNodes(oldNodes,newVal.nodes);
            if ( dn.size ) {
              const f = document.createDocumentFragment();
              dn.forEach(n => f.appendChild(n));
            }
            oldNodes = newVal.nodes || [lastAnchor];
            while ( newVal.externals.length ) {
              const func = newVal.externals.shift();
              func();
            } 
            break;
          default:
            const lengthBefore = lengths.slice(0,valIndex).reduce((sum,x) => sum + x, 0);
            node.nodeValue = newVal;
            lengths[valIndex] = newVal.length;
            break;
        }
      };
    }

    function summonPlaceholder(sibling) {
      let ph = [...sibling.parentNode.childNodes].find(
        node => node.nodeType == Node.COMMENT_NODE && node.nodeValue == 'brutal-placeholder' );
      if ( ! ph ) {
        ph = toDOM(`<!--brutal-placeholder-->`).firstChild;
      }
      return ph;
    }

    function handleElementNode({node,vmap,externals}) {
      const attrs = [...node.attributes]; 
      attrs.forEach(({name,value}) => {
        const lengths = [];
        let result;
        while( result = KEYMATCH.exec(name) ) {
          const {index} = result;
          const key = result[1];
          const val = vmap[key];
          const replacer = makeAttributeUpdater(
            {updateName:true,val,node,index,name,externals,lengths,valIndex:val.vi});
          externals.push(() => replacer(val.val));
          val.replacers.push( replacer );
        }
        while( result = KEYMATCH.exec(value) ) {
          const {index} = result;
          const key = result[1];
          const val = vmap[key];
          const replacer = makeAttributeUpdater({val,node,index,name,externals,lengths,valIndex:val.vi});
          externals.push(() => replacer(val.val));
          val.replacers.push( replacer );
        }
      });
    }

    function makeAttributeUpdater({
      updateName: updateName = false,node,index,name,val,externals,lengths,oldLengths,valIndex}) {
      let oldVal = {length: KEYLEN};
      let oldName = name;
      if ( updateName ) {
        return (newVal) => {
          val.val = newVal;
          switch(typeof newVal) {
            default:
              const attr = node.hasAttribute(oldName) ? oldName : '';
              if ( attr !== newVal ) {
                if ( !! attr ) {
                  node.removeAttribute(oldName);
                  node[oldName] = undefined;
                }
                if ( !! newVal ) {
                  node.setAttribute(newVal.trim(),''); 
                  node[newVal] = true;
                }
                oldName = newVal;
              }
          }
        };
      } else {
        return (newVal) => {
          const originalLengthBefore = Object.keys(lengths.slice(0,valIndex)).length*KEYLEN;
          val.val = newVal;
          switch(typeof newVal) {
            case "function":
              if ( name !== 'bond' ) {
                if ( !! oldVal ) {
                  node.removeEventListener(name, oldVal);
                }
                node.addEventListener(name, newVal); 
              } else {
                if ( !! oldVal ) {
                  const index = externals.indexOf(oldVal);
                  if ( index >= 0 ) {
                    externals.splice(index,1);
                  }
                }
                externals.push(() => newVal(node)); 
              }
              oldVal = newVal;
            break;
            default:
              lengths[valIndex] = newVal.length;
              const attr = node.getAttribute(name);
              if ( attr !== newVal ) {
                const lengthBefore = lengths.slice(0,valIndex).reduce((sum,x) => sum + x, 0);

                const correction = lengthBefore-originalLengthBefore;
                const before = attr.slice(0,index+correction);
                const after = attr.slice(index+correction+oldVal.length);

                const newAttrValue = before + newVal + after;
                node.setAttribute(name, newAttrValue);
                node[name] = newAttrValue;

                oldVal = newVal;
              }
          }
        };
      }
    }

    function isCached(cacheKey,v,instanceKey) {
      let firstCall;
      let cached = cache[cacheKey];
      if ( cached == undefined ) {
        cached = cache[cacheKey] = {};
        if ( !! instanceKey ) {
          cached.instances = {};
          cached = cached.instances[instanceKey] = {};
        }
        firstCall = true;
      } else {
        if ( !! instanceKey ) {
          if ( ! cached.instances ) {
            cached.instances = {};
            firstCall = true;
          } else {
            cached = cached.instances[instanceKey];
            if ( ! cached ) {
              firstCall = true;
            } else {
              firstCall = false;
            }
          }
        } else {
          firstCall = false;
        }
      }
      if ( ! firstCall ) {
        cached.update(v);
      }
      return {cached,firstCall};
    }

    function skip(str) {
      str = (str || '')+'';
      return { str, handlers: {}, code: CODE };
    }

    function replaceVal(vmap) {
      return (val,vi) => {
        if ( !! val.key ) {
          return '';
        }
        const key = ('key'+Math.random()).replace('.','').padEnd(KEYLEN,'0').slice(0,KEYLEN);
        let k = key;
        if ( T.check(T`BrutalObject`, val) ) {
          k = (`<!--${k}-->`);
        }
        k = `${k}`;
        vmap[key.trim()] = {vi,val,replacers:[]};
        return k;
      };
    }

    function toDOM(str) {
      const f = (new DOMParser).parseFromString(
        `<template>${str}</template>`,"text/html").head.firstElementChild.content;
      f.normalize();
      return f;
    }

    function parseVal(v) {
      const isFunc          = T.check(T`Function`, v);
      const isUnset         = T.check(T`None`, v);
      const isObject        = T.check(T`Object`, v);
      const isBrutalArray   = T.check(T`BrutalArray`, v);
      const isBrutal        = T.check(T`BrutalObject`, v);
      const isForgery       = T.check(T`BrutalLikeObject`, v)  && !isBrutal; 

      if ( isFunc )         return v;
      if ( isBrutal )       return v;
      if ( isKey(v) )       return v;
      if ( isBrutalArray )  return join(v); 
      if ( isUnset )        die({error: UNSET()});
      if ( isForgery )      die({error: XSS()});
      if ( isObject )       die({error: OBJ$1()});

      return safe(v+'');
    }

    function join(os) {
      const externals = [];
      const bigNodes = [];
      os.forEach(o => (externals.push(...o.externals),bigNodes.push(...o.nodes)));
      const retVal = {v:[],code:CODE,nodes:bigNodes,to: to$1,update,externals};
      return retVal;
    }

    function diffNodes(last,next) {
      last = new Set(last);
      next = new Set(next);
      return new Set([...last].filter(n => !next.has(n)));
    }

    function update(newVals) {
      this.v.forEach(({vi,replacers}) => replacers.forEach(f => f(newVals[vi])));
    }

    function verify$3(v) {
      return CODE === v.code;
    }

    function die(msg,err) {
      msg.stack = (new Error()).stack.split(/\s*\n\s*/g);
      throw JSON.stringify(msg,null,2);
    }

    function s(msg) {
    }

  exports.R = R;
  exports.X = X;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
