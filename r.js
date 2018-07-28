// Note: 
  // now is not the time for optimization. 
  // That comes later.
"use strict";
  const DEBUG             = false;
  const KEYMATCH          = / ?(key\d+) ?/gm;
  const OURPROPS          = 'code,externals,frag,nodes,to,update,v';
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
    v = v.map(parseVal);

    const cacheKey = p.join('<link rel=join>');
    const {cached,firstCall} = isCached(cacheKey,v);
   
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

    do makeUpdaters({walker,vmap,externals}); while(walker.nextNode())

    const retVal = cache[cacheKey] = {externals,frag,v:Object.values(vmap),to,
      update,code:CODE,nodes:[...frag.childNodes]};
    return retVal;
  }

  function makeUpdaters({walker,vmap,externals}) {
    let node = walker.currentNode;
    switch( node.nodeType ) {
      case Node.ELEMENT_NODE:
        handleElementNode({node,vmap,externals});
      break;
      case Node.TEXT_NODE:
        handleTextNode({node,vmap});
      break;
    }
  }

  function handleTextNode({node,vmap}) {
    const text = node.wholeText; 
    let result;
    while( result = KEYMATCH.exec(text) ) {
      const {index} = result;
      const key = result[1];
      const val = vmap[key];
      const replacer = makeTextNodeUpdater({node});
      replacer(val.val);
      val.replacers.push( replacer );
    }
  }

  function makeTextNodeUpdater({node}) {
    let oldNodes = [node];
    return (newVal) => {
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
    };
  }

  function handleElementNode({node,vmap,externals}) {
    const attrs = [...node.attributes]; 
    attrs.forEach(({name,value}) => {
      let result;
      while( result = KEYMATCH.exec(value) ) {
        const {index} = result;
        const key = result[1];
        const val = vmap[key];
        const replacer = makeAttributeUpdater({node,name,externals});
        replacer(val.val);
        val.replacers.push( replacer );
      }
    });
  }

  function makeAttributeUpdater({node,name,externals}) {
    let oldVal;
    return (newVal) => {
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
          if ( node.getAttribute(name) !== newVal ) {
            node.setAttribute(name,newVal);
          }
      }
    };
  }

  function isCached(cacheKey,v) {
    let firstCall;
    let cached = cache[cacheKey];
    if ( cached == undefined ) {
      cached = cache[cacheKey] = {};
      firstCall = true;
    } else {
      cached.update(v);
      firstCall = false;
    }
    return {cached,firstCall};
  }

  function replaceVal(vmap) {
    return (val,vi) => {
      const k = (' key'+Math.random()+' ').replace('.','');
      vmap[k.trim()] = {vi,val,replacers:[]};
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
    const isFunc          = typeof v == "function";
    const isUnset         = v == null         ||    v == undefined;
    const isObject        = !isUnset          &&    typeof v === "object";
    const isGoodArray     = Array.isArray(v)  &&    v.every(itemIsFine);
    const isVerified      = isObject          &&    verify(v);
    const isForgery       = onlyOurProps(v)   &&    !isVerified; 

    if ( isFunc )        return v;
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
    this.externals.forEach(f => f());
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
