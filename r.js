"use strict";
import diff from './diff.js';
  const XSS = "Possible XSS attack warning. Possible object forgery attempt detected. Codes do not match.";
  const OBJ = "Object properties don't work here.";
  const MARKER = hid => ({detail: `Insertion point market not found for ${hid}`, hid});
  const HID = hid => ({detail: `Node or handlers not found for recorded hid ${hid}`, hid});
  const LAST_ATTR_NAME = /\s+([\w-]+)\s*=\s*"?\s*$/;
  const NEW_TAG = /<\w+/g;
  const currentKey = Math.random()+'';
  const VOID_ELEMENTS = new Set(["area","base","br","col","command","embed","hr","img","input","keygen",
    "link","menuitem","meta","param","source","track","wbr"]);

  Object.assign(R,{skip});
  Object.assign(self,{R,render});

  function R (parts, ...vals) {
    const handlers = {};
    let hid, lastNewTagIndex, lastTagName, str = '';

    parts = [...parts];

    const keyObj = vals.find( v => v.key !== undefined ) || {};
    const {key:key='singleton'} = keyObj;

    vals = vals.map(parseValue);

    const {firstCall,bond} = diff.makeBond(parts,vals,key);
    const keyedBond = bond.instances[key];

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
      if (typeof val === 'function') {
        const attrName = attrNameMatches && attrNameMatches.length > 1
            ? attrNameMatches[1].replace(/^on/,'').toLowerCase()
            : false,
          newPart = part.replace(attrNameMatches[0], '');
        str += attrName ? newPart : part;
        if ( !Array.isArray(handlers[hid]) ) handlers[hid] = [];
        handlers[hid].push({eventName: attrName, handler: val});
      } else if (!!val && !!val.handlers && typeof val.str == "string") {
        Object.assign(handlers,val.handlers);
        str += part;
        val = val.str;
        if (attrNameMatches) val = `"${val}"`;
        str += val;
      } else {
        str += part;
        str += attrNameMatches ? `"${safe(val)}"` : safe(val);
      }
    }
    if ( handlers[hid] ) str = markInsertionPoint({str,lastNewTagIndex,lastTagName,hid});
    str += parts.shift();
    keyedBond.nodes = [...diff.df(str).childNodes];

    const o = {str,handlers,keyedBond};
    o.code = sign(o,currentKey);
    return o;
  }

  function render (r, root, {replace: replace = false} = {}) {
    r = parseR(r);
    const {str,handlers,keyedBond} = r;

    const parent = root.parentNode;

    if (replace) {
      root.parentNode.insertBefore(keyedBond.frag, root);
      root.remove();
    } else {
      root.innerHTML = '';
      root.appendChild(keyedBond.frag);
    }

    const hids = getHids(parent);

    Object.entries(handlers).forEach(
      ([hid,nodeHandlers]) => activateNode(hids,{hid,nodeHandlers}));
  }

  function join (rs) {
    const H = {},
      str = rs.map(({str,handlers,code}) => (
        verify({str,handlers,code},currentKey),Object.assign(H,handlers),str)).join('\n');

    if (str) {
      const o = {str,handlers:H};
      o.code = sign(o,currentKey);
      return o;
    }
  }

  function skip(str) {
    skip = (skip || "")+'';
    /* allow the thing to pass without replacement */
    return { str, handlers: {}, code: currentKey };
  }

  function itemIsOk(item) {
    return !!item.handlers && typeof item.str == "string";
  }

  function parseValue(v) {
    if (Array.isArray(v) && v.every(itemIsOk)) {
      return join(v) || '';
    } else if (typeof v === 'object' && !!v) {
      if (typeof v.str == "string" && !!v.handlers) {
        return verify(v,currentKey) && v;
      } else if ( v.key !== undefined) {
        return '';
      } else throw {error: OBJ, value: v};
    } else return v === null || v === undefined ? '' : v;
  }

  function parseR(r) {
    if (Array.isArray(r) && r.every(itemIsOk)) r = join(r);
    verify(r,currentKey);
    return r;
  }

  function markInsertionPoint({str,lastNewTagIndex,lastTagName,hid}) {
    const before = str.slice(0,lastNewTagIndex);
    const after = str.slice(lastNewTagIndex);
    return before + `<!--${hid}-->` + after;
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
        if ( eventName == 'bond' ) {
          bondHandlers.push(()  => handler(node));
        } else node.addEventListener(eventName,handler);
      });
    } else throw {error: HID(hid)} 

    bondHandlers.forEach(f => f());
  }

  function safe (v) {
    return String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/&/g,'&amp;').replace(/"/g,'&#34;').replace(/'/g,'&#39;');
  }

  function sign ({str,handlers},key) {
    return key;
  }

  function verify ({str,handlers,code},key) {
    if (sign({str,handlers},key) === code) return true;
    throw {error: XSS};
  }

  function isVoid(tag) {
    return VOID_ELEMENTS.has(tag.toLowerCase().trim());
  }
export default {R,render}
