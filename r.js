// Note: 
  // now is not the time for optimization. 
  // That comes later.
"use strict";
  const DEBUG             = false;
  const KEYMATCH          = / ?(key\d+) ?/gm;
  const OURPROPS          = 'code,frag,nodes,to,update,v';
  const CODE              = ''+Math.random();
  const XSS               = () => `Possible XSS / object forgery attack detected. ` +
                            `Object value could not be verified.`;
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
  const cache = {};

  export {R};

  function R(p,...v) {
    p = [...p]; v = [...v];
    v = v.map(parseVal);
    const cacheKey = p.join('<link rel=join>');
    let cached = cache[cacheKey];
    if ( cached == undefined ) {
      cached = cache[cacheKey] = {};
    } else {
      cached.update(v);
      return cached;
    }
    const vmap = {};
    const V = v.map((val,vi) => {
      const k = (' key'+Math.random()+' ').replace('.','');
      vmap[k.trim()] = {vi,val,replacers:[]};
      return k;
    });
    let str = '';
    while( p.length > 1 ) {
      str += p.shift();
      str += V.shift();
    }
    str += p.shift();
    const frag = (new DOMParser).parseFromString(
      `<template>${str}</template>`,"text/html").head.firstElementChild.content;
    frag.normalize();
    const nodes = [...frag.childNodes];
    const walker = document.createTreeWalker(frag, NodeFilter.SHOW_ALL);
    do {
      let node = walker.currentNode;
      switch( node.nodeType ) {
        case Node.ELEMENT_NODE:
          const attrs = [...node.attributes]; 
          attrs.forEach(({name,value}) => {
            let result;
            while( result = KEYMATCH.exec(value) ) {
              const {index} = result;
              const key = result[1];
              const val = vmap[key];
              const replacer = (newVal) => {
                const oldVal = node.getAttribute(name);
                if ( oldVal !== newVal ) {
                  node.setAttribute(name,newVal);
                }
              }
              replacer(val.val);
              val.replacers.push( replacer );
            }
          });
        break;
        case Node.TEXT_NODE:
          const text = node.wholeText; 
          let result;
          while( result = KEYMATCH.exec(text) ) {
            const {index} = result;
            const key = result[1];
            const val = vmap[key];
            let oldNodes = [node];
            const replacer = (newVal) => {
              switch(typeof newVal) {
                case "object":
                  if ( sameNodes(oldNodes,newVal.nodes) ) return;
                  const anchorNode = oldNodes[0];
                  newVal.nodes.forEach(n => anchorNode.parentNode.insertBefore(n,anchorNode.nextSibling));
                  oldNodes.forEach(n => n.remove());
                  oldNodes = newVal.nodes;
                  break;
                default:
                  node.nodeValue = newVal;
                  break;
              }
            }
            replacer(val.val);
            val.replacers.push( replacer );
          }
        break;
      }
    } while( walker.nextNode() );
    const retVal = cache[cacheKey] = {frag,v:Object.values(vmap),to,update,code:CODE,nodes};
    return retVal;
  }

  function parseVal(v) {
    const isUnset         = v == null         ||    v == undefined;
    const isObject        = !isUnset          &&    typeof v === "object";
    const isGoodArray     = Array.isArray(v)  &&    v.every(itemIsFine);
    const isVerified      = isObject          &&    verify(v);
    const isForgery       = onlyOurProps(v)   &&    !isVerified; 

    if ( isVerified )     return v;
    if ( isGoodArray )    return join(v); 
    if ( isUnset )        die({error: UNSET()});
    if ( isForgery )      die({error: XSS()});
    if ( isObject )       die({error: OBJ()});

    return v+'';
  }

  function join(os) {
    const bigFrag = document.createDocumentFragment();
    os.forEach(o => bigFrag.appendChild(frag))
    return {v:[],code:CODE,nodes:[...bigFrag.childNodes],frag:bigFrag,to,update};
  }

  function to(selector, position = 'replace') {
    const frag = document.createDocumentFragment();
    this.nodes.forEach(n => frag.appendChild(n));
    const elem = document.querySelector(selector);
    try {
      MOVE[position](frag,elem);
    } catch(e) {
      die({error: INSERT()},e);
    }
  }

  function sameNodes(a,b) {
    return a.every((node,index) => node === b[index])
  }

  function update(newVals) {
    this.v.forEach(({vi,replacers}) => replacers.forEach(f => f(newVals[vi])));
  }

  function onlyOurProps(v) {
    return OURPROPS === Object.keys(v||{}).sort().join(',');
  }

  function verify(v) {
    return CODE === v.code;
  }

  function die(msg,err) {
    if (DEBUG && err) console.warn(err);
    msg.stack = ((DEBUG && err) || new Error()).stack.split(/\s*\n\s*/g);
    throw JSON.stringify(msg,null,2);
  }
