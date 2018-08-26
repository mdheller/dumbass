// r.js
  import {safe,CODE,BROWSER_SIDE} from './common.js';
  import {S} from './ssr.js';
  import T from './types.js';

  const DEBUG             = false;
  const KEYMATCH          = /(?:<!\-\-)?(key\d+)(?:\-\->)?/gm;
  const KEYLEN            = 20;
  const OURPROPS          = 'code,externals,nodes,to,update,v';
  const XSS               = () => `Possible XSS / object forgery attack detected. ` +
                            `Object code could not be verified.`;
  const OBJ               = () => `Object values not allowed here.`;
  const UNSET             = () => `Unset values not allowed here.`;
  const MOVE              = new class {
    beforeEnd   (frag,elem) { elem.appendChild(frag) }
    beforeBegin (frag,elem) { elem.parentNode.insertBefore(frag,elem) }
    afterEnd    (frag,elem) { elem.parentNode.insertBefore(frag,elem.nextSibling) }
    replace     (frag,elem) { elem.parentNode.replaceChild(frag,elem) }
    afterBegin  (frag,elem) { elem.insertBefore(frag,elem.firstChild) }
    innerHTML   (frag,elem) { elem.innerHTML = ''; elem.appendChild(frag) }
  };
  const INSERT            = () => `Error inserting template into DOM. ` +
    `Position must be one of: ` +
    `replace, beforeBegin, afterBegin, beforeEnd, innerHTML, afterEnd`;
  const isKey             = v => T.check(T`Key`, v);
  const isHandlers        = v => T.check(T`Handlers`, v);
  const cache = {};

  Object.assign(R,{s,skip,die,BROWSER_SIDE});

  if ( DEBUG && BROWSER_SIDE ) {
    Object.assign(self, {R,T}); 
  }

  export function R(p,...v) {
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

    const retVal = {externals,v:Object.values(vmap),to,
      update,code:CODE,nodes:[...frag.childNodes]};
    if ( !! instanceKey ) {
      cache[cacheKey].instances[instanceKey] = retVal;
    } else {
      cache[cacheKey] = retVal;
    }
    return retVal;
  }

  export function X(p,...v) {
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

    const retVal = {externals,v:Object.values(vmap),to,
      update,code:CODE,nodes:[...frag.childNodes]};
    return retVal;
  }

  function to(location, options) {
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
            newVal.nodes.forEach(n => {
              lastAnchor.parentNode.insertBefore(n,lastAnchor.nextSibling);
              lastAnchor = lastAnchor.nextSibling;
            });
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
        const {index,input} = result;
        const key = result[1];
        const val = vmap[key];
        const replacer = makeAttributeUpdater({val,node,input,index,name,externals,lengths,valIndex:val.vi});
        externals.push(() => replacer(val.val));
        val.replacers.push( replacer );
      }
    });
  }

  function makeAttributeUpdater({
    updateName: updateName = false,node,input,index,name,val,externals,lengths,oldLengths,valIndex}) {
    let oldVal = {length: KEYLEN};
    let oldName = name;
    if ( updateName ) {
      return (newVal) => {
        val.val = newVal;
        switch(typeof newVal) {
          default:
            const attr = node.hasAttribute(oldName) ? oldName : ''
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
        const type = T.check(T`Function`, newVal) ? 'function' :
          T.check(T`Handlers`, newVal) ? 'handlers' : 'default';
        switch(type) {
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
          case "handlers":
            // Add a remove for oldVal handlers object, to remove the handlers in oldVal
            Object.entries(newVal).forEach(([eventName,funcVal]) => {
              if ( eventName !== 'bond' ) {
                node.addEventListener(eventName, funcVal); 
              } else {
                externals.push(() => funcVal(node)); 
              }
            });
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
              //console.log(JSON.stringify({index,input,originalLengthBefore,valIndex,correction,before,after,oldValLength:oldVal.length},null,2));

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
    str = T.check(T`None`, str) ? '' : str; 
    const frag = toDOM(str);
    const retVal = {externals:[],v:[],to,
      update,code:CODE,nodes:[...frag.childNodes]};
    return retVal;
  }

  function replaceVal(vmap) {
    return (val,vi) => {
      if ( T.check(T`Key`, val) ) {
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
    if ( isHandlers(v) )  return v;
    if ( isBrutalArray )  return join(v); 
    if ( isUnset )        die({error: UNSET()});
    if ( isForgery )      die({error: XSS()});
    if ( isObject )       die({error: OBJ()});

    return safe(v+'');
  }

  function join(os) {
    const externals = [];
    const bigNodes = [];
    os.forEach(o => (externals.push(...o.externals),bigNodes.push(...o.nodes)));
    const retVal = {v:[],code:CODE,nodes:bigNodes,to,update,externals};
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

  function verify(v) {
    return CODE === v.code;
  }

  function die(msg,err) {
    if (DEBUG && err) console.warn(err);
    msg.stack = ((DEBUG && err) || new Error()).stack.split(/\s*\n\s*/g);
    throw JSON.stringify(msg,null,2);
  }

  function s(msg) {
    if ( DEBUG ) {
      console.log(JSON.stringify(msg,showNodes,2));
      console.info('.');
    }
  }

  function showNodes(k,v) {
    let out = v;
    if ( T.check(T`>Node`, v) ) {
      out = `<${v.nodeName.toLowerCase()} ${
        !v.attributes ? '' : [...v.attributes].map(({name,value}) => `${name}='${value}'`).join(' ')}>${
        v.nodeValue || ''}`;
    } else if ( typeof v === "function" ) {
      return `${v.name || 'anon'}() { ... }`
    }
    return out;
  }
